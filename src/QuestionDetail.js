import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getQuestion,
  listAnswers,
} from "./graphql/queries";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from "./graphql/mutations";
import { onCreateAnswer } from "./graphql/subscriptions";
import { uploadData, getUrl } from "@aws-amplify/storage";
import { generateClient } from "@aws-amplify/api";
import { useAuthenticator, Button } from "@aws-amplify/ui-react";

const client = generateClient();

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);

  const [question, setQuestion] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [voteAnimatingId, setVoteAnimatingId] = useState(null);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      const q = await client.graphql({ query: getQuestion, variables: { id } });
      setQuestion(q.data.getQuestion);

      const a = await client.graphql({
        query: listAnswers,
        variables: { filter: { questionID: { eq: id } }, limit: 100 },
      });

      const mapped = await Promise.all(
        a.data.listAnswers.items.map(async (ans) => {
          const imageUrl = ans.imageUrl
            ? (
                await getUrl({ key: ans.imageUrl, options: { accessLevel: "public" } })
              ).url
            : null;
          return {
            ...ans,
            Author: ans.Author || "anonymous",
            imageUrl,
            upvotes: ans.upvotes || 0,
            downvotes: ans.downvotes || 0,
          };
        })
      );

      setAnswerList(mapped);
    }

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const sub = client.graphql({ query: onCreateAnswer, variables: {}, authMode: "API_KEY" }).subscribe({
      next: async ({ value }) => {
        const newAnswer = value?.data?.onCreateAnswer;
        if (!newAnswer || newAnswer.questionID !== id) return;

        const imageUrl = newAnswer.imageUrl
          ? (await getUrl({ key: newAnswer.imageUrl, options: { accessLevel: "public" } })).url
          : null;

        setAnswerList((prev) => {
          if (prev.some((a) => a.id === newAnswer.id)) return prev;
          return [
            ...prev,
            {
              ...newAnswer,
              Author: newAnswer.Author || "anonymous",
              imageUrl,
              upvotes: newAnswer.upvotes || 0,
              downvotes: newAnswer.downvotes || 0,
            },
          ];
        });
      },
      error: (err) => console.error("🔥 Subscription error", err),
    });

    return () => sub.unsubscribe();
  }, [id]);

  const sortedAnswers = answerList
    .filter((a) => !a.parentID)
    .sort((a, b) => {
      const aScore = (a.upvotes || 0) - (a.downvotes || 0);
      const bScore = (b.upvotes || 0) - (b.downvotes || 0);
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const paginatedAnswers = sortedAnswers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedAnswers.length / itemsPerPage);

  const handleVote = async (answer, type) => {
    const updated = await client.graphql({
      query: updateAnswer,
      variables: {
        input: {
          id: answer.id,
          _version: answer._version,
          [type]: (answer[type] || 0) + 1,
        },
      },
    });
    animateVote(`${answer.id}-${type}`);
    setAnswerList((prev) =>
      prev.map((a) => (a.id === answer.id ? { ...a, ...updated.data.updateAnswer } : a))
    );
  };

  const animateVote = (id) => {
    setVoteAnimatingId(id);
    setTimeout(() => setVoteAnimatingId(null), 300);
  };

  const uploadImageToS3 = async (file) => {
    const filename = `${Date.now()}_${file.name}`;
    await uploadData({ key: filename, data: file, options: { accessLevel: "public" } }).result;
    return filename;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const submitAnswer = async (e, parentID = null) => {
    e.preventDefault();
    let imageKey = null;
    if (imageFile) imageKey = await uploadImageToS3(imageFile);

    if (editingAnswerId) {
      const original = answerList.find((a) => a.id === editingAnswerId);
      const updated = await client.graphql({
        query: updateAnswer,
        variables: {
          input: {
            id: editingAnswerId,
            _version: original._version,
            Text: replyText,
            imageUrl: imageKey || original.imageUrl,
          },
        },
      });
      setAnswerList((prev) =>
        prev.map((a) =>
          a.id === editingAnswerId ? { ...a, ...updated.data.updateAnswer, imageUrl: previewUrl || a.imageUrl } : a
        )
      );
      setEditingAnswerId(null);
    } else {
      await client.graphql({
        query: createAnswer,
        variables: {
          input: {
            Text: replyText,
            Author: user?.username || "anonymous",
            questionID: question.id,
            parentID,
            imageUrl: imageKey,
            upvotes: 0,
            downvotes: 0,
          },
        },
      });
    }

    setReplyText("");
    clearImage();
    setReplyingTo(null);
    setShowAnswerForm(false);
  };

  const startEdit = (a) => {
    setReplyText(a.Text);
    setEditingAnswerId(a.id);
    setPreviewUrl(a.imageUrl || null);
    setImageFile(null);
    setReplyingTo(null);
    setShowAnswerForm(true);
  };

  const handleDelete = async (a) => {
    const confirmed = window.confirm("Are you sure you want to delete this answer?");
    if (!confirmed) return;

    await client.graphql({
      query: deleteAnswer,
      variables: { input: { id: a.id, _version: a._version } },
    });

    setAnswerList((prev) => prev.filter((x) => x.id !== a.id && x.parentID !== a.id));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  function renderAnswerTree(answer, depth) {
    const replies = answerList.filter((x) => x.parentID === answer.id);

    return (
      <div key={answer.id} className={`ml-${depth > 0 ? 6 : 0}`}>
        <div className="bg-gray-50 rounded-lg border border-blue-100 p-4">
          <div className="flex items-start gap-3">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${answer.Author}-${answer.id}`}
              className="w-8 h-8 rounded-full border"
              alt="avatar"
            />
            <div className="flex-1">
              <p className="mb-2">{answer.Text}</p>
              {answer.imageUrl && <img src={answer.imageUrl} className="max-w-xs rounded mb-2 border" alt="img" />}
              <div className="text-sm text-gray-500 flex justify-between">
                <span>✍ {answer.Author}</span>
                <span>{new Date(answer.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <button
                  className={`text-green-600 zoom ${voteAnimatingId === `${answer.id}-upvotes` ? "active" : ""}`}
                  onClick={() => handleVote(answer, "upvotes")}
                >⬆ {answer.upvotes || 0}</button>
                <button
                  className={`text-red-600 zoom ${voteAnimatingId === `${answer.id}-downvotes` ? "active" : ""}`}
                  onClick={() => handleVote(answer, "downvotes")}
                >⬇ {answer.downvotes || 0}</button>
                {user?.username === answer.Author && (
                  <>
                    <button className="text-blue-600" onClick={() => startEdit(answer)}>✏ Edit</button>
                    <button className="text-red-600" onClick={() => handleDelete(answer)}>🗑 Delete</button>
                  </>
                )}
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === answer.id ? null : answer.id);
                    setShowAnswerForm(false);
                    setEditingAnswerId(null);
                    setReplyText("");
                  }}
                  className="text-blue-600"
                >Reply</button>
              </div>
              {replyingTo === answer.id && (
                <form onSubmit={(e) => submitAnswer(e, answer.id)} className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Your reply..."
                  />
                  <input type="file" onChange={handleImageChange} className="mb-2" />
                  {previewUrl && (
                    <img src={previewUrl} alt="preview" className="max-w-xs rounded border mb-2" />
                  )}
                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-4 ml-6">
          {replies.map((r) => renderAnswerTree(r, depth + 1))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-gray-800">
      <div className="bg-white p-6 rounded-xl border border-blue-100 shadow">
        <h1 className="text-2xl font-bold mb-2 text-blue-800">{question?.Text}</h1>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>👤 {question?.Author || "anonymous"}</span>
          <span>{question && new Date(question.createdAt).toLocaleString()}</span>
        </div>
        {question?.imageUrl && (
          <img src={question.imageUrl} alt="" className="w-full max-w-lg rounded border mb-4" />
        )}
        <Button onClick={() => setShowAnswerForm(!showAnswerForm)}>Answer Question</Button>
      </div>

      {showAnswerForm && (
        <form onSubmit={(e) => submitAnswer(e)} className="my-6">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border rounded p-2 mb-2"
            placeholder="Your answer..."
          />
          <input type="file" onChange={handleImageChange} className="mb-2" />
          {previewUrl && (
            <img src={previewUrl} alt="preview" className="max-w-xs rounded border mb-2" />
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingAnswerId ? "Update" : "Send"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-4 text-blue-800">🗨️ Answers</h3>
      <div className="space-y-6">
        {paginatedAnswers.map((a) => renderAnswerTree(a, 0))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
        >← Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded transition-all duration-300 ${
              currentPage === i + 1 ? "bg-blue-500 text-white scale-110" : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >{i + 1}</button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
        >Next →</button>
      </div>
    </div>
  );
}