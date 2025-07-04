import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestion, listAnswers } from "./graphql/queries";
import { createAnswer, updateAnswer } from "./graphql/mutations";
import { onCreateAnswer } from "./graphql/subscriptions";
import { uploadData, getUrl } from "@aws-amplify/storage";
import { generateClient } from "@aws-amplify/api";
import { useAuthenticator, Button } from "@aws-amplify/ui-react";

const client = generateClient();

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);

  const [question, setQuestion] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [voteAnimatingId, setVoteAnimatingId] = useState(null);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
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
            ? (await getUrl({ key: ans.imageUrl, options: { accessLevel: "public" } })).url
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
    const sub = client.graphql({
      query: onCreateAnswer,
      variables: {},
      authMode: "API_KEY",
    }).subscribe({
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

  const paginatedAnswers = sortedAnswers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedAnswers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    await uploadData({
      key: filename,
      data: file,
      options: { accessLevel: "public" },
    }).result;
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

    setReplyText("");
    clearImage();
    setReplyingTo(null);
    setShowAnswerForm(false);
  };

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
            Send
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-4 text-blue-800">🗨️ Answers</h3>

      {paginatedAnswers.map((a) => (
        <div key={a.id} className="mb-6 bg-gray-50 rounded-lg border border-blue-100 p-4">
          <div className="flex items-start gap-3">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${a.Author}-${a.id}`}
              className="w-8 h-8 rounded-full border"
              alt="avatar"
            />
            <div className="flex-1">
              <p className="mb-2">{a.Text}</p>
              {a.imageUrl && (
                <img src={a.imageUrl} className="max-w-xs rounded mb-2 border" alt="img" />
              )}
              <div className="text-sm text-gray-500 flex justify-between">
                <span>✍ {a.Author}</span>
                <span>{new Date(a.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button
                  className={`text-green-600 zoom ${
                    voteAnimatingId === `${a.id}-upvotes` ? "active" : ""
                  }`}
                  onClick={() => handleVote(a, "upvotes")}
                >
                  ⬆ {a.upvotes || 0}
                </button>
                <button
                  className={`text-red-600 zoom ${
                    voteAnimatingId === `${a.id}-downvotes` ? "active" : ""
                  }`}
                  onClick={() => handleVote(a, "downvotes")}
                >
                  ⬇ {a.downvotes || 0}
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === a.id ? null : a.id)}
                  className="text-blue-600 text-sm ml-4"
                >
                  Reply
                </button>
              </div>

              {replyingTo === a.id && (
                <form onSubmit={(e) => submitAnswer(e, a.id)} className="mt-3">
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
                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
                    Send
                  </button>
                </form>
              )}

              {answerList
                .filter((r) => r.parentID === a.id)
                .map((r) => (
                  <div
                    key={r.id}
                    className="ml-8 mt-4 p-3 bg-blue-50 border border-blue-100 rounded"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${r.Author}-${r.id}`}
                        className="w-5 h-5 rounded-full border"
                        alt="avatar"
                      />
                      <span className="font-medium">{r.Author}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{r.Text}</p>
                    {r.imageUrl && (
                      <img
                        src={r.imageUrl}
                        className="ml-7 max-w-xs rounded mt-2 border"
                        alt=""
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
        >
          ← Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded transition-all duration-300 ${
              currentPage === i + 1
                ? "bg-blue-500 text-white scale-110"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
