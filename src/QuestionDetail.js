import { Button } from "@aws-amplify/ui-react";
import { DataStore, SortDirection } from "aws-amplify/datastore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Question, Answer } from "./models";
import { useAuthenticator } from "@aws-amplify/ui-react";

const QuestionPage = () => {
  const { id } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);

  const [question, setQuestion] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function queryQuestion(id) {
      const result = await DataStore.query(Question, id);
      setQuestion(result);
    }
    if (id) queryQuestion(id);
  }, [id]);

  async function queryAnswers(qid) {
    const results = await DataStore.query(Answer, (c) => c.questionID.eq(qid), {
      sort: (s) => s.createdAt(SortDirection.ASCENDING),
    });

    const mapped = results.map((a) => ({
      ...a,
      createdAt: new Date(a.createdAt).toISOString(),
      Author: a.Author || "anonymous",
    }));

    setAnswerList(mapped);
  }

  useEffect(() => {
    if (question) queryAnswers(question.id);
  }, [question]);

  if (!question) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-gray-800">
      {/* Câu hỏi */}
      <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-blue-800">{question.Text}</h1>
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${question.Author}-${question.id}`}
            alt="avatar"
            className="w-5 h-5 rounded-full border"
          />
          <span>{question.Author || "anonymous"}</span>
          <span>• {new Date(question.createdAt).toLocaleDateString()}</span>
        </p>

        {question?.imageUrl && (
          <div className="w-full mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={question.imageUrl}
              alt="Ảnh minh họa"
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        <Button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Answer Question
        </Button>
      </div>

      {/* Form trả lời chính */}
      {showAnswerForm && (
        <div className="mb-10">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await DataStore.save(
                new Answer({
                  Text: replyText,
                  Author: user?.username || "anonymous",
                  questionID: question.id,
                })
              );
              setReplyText("");
              setShowAnswerForm(false);
              queryAnswers(question.id);
            }}
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border rounded p-2 mb-2 text-sm"
              placeholder="Your answer..."
            />
            <button
              type="submit"
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send Answer
            </button>
          </form>
        </div>
      )}

      {/* Danh sách câu trả lời */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
        🗨️ Câu trả lời
      </h3>

      {answerList
        .filter((item) => !item.parentID)
        .map((item) => (
          <div key={item.id} className="mb-6 bg-gray-50 rounded-lg shadow-sm border border-sky-200 p-4">
            <div className="flex items-start gap-3">
              <img
                src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${item.Author}-${item.id}`}
                alt="avatar"
                className="w-8 h-8 rounded-full border"
              />
              <div className="flex-1">
                <p className="text-gray-800 mb-1 leading-relaxed">{item.Text}</p>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>✍ {item.Author}</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <button
                  className="text-sm text-blue-600 hover:underline mt-2"
                  onClick={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
                >
                  Reply
                </button>

                {replyingTo === item.id && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await DataStore.save(
                        new Answer({
                          Text: replyText,
                          Author: user?.username || "anonymous",
                          questionID: question.id,
                          parentID: item.id,
                        })
                      );
                      setReplyText("");
                      setReplyingTo(null);
                      queryAnswers(question.id);
                    }}
                    className="mt-2"
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full border rounded p-2 mb-2 text-sm"
                      placeholder="Your reply..."
                    />
                    <button
                      type="submit"
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Send
                    </button>
                  </form>
                )}

                {answerList
                  .filter((reply) => reply.parentID === item.id)
                  .map((reply) => (
                    <div
                      key={reply.id}
                      className="ml-8 mt-4 p-3 rounded-md bg-blue-50 text-sm border border-blue-100"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${reply.Author}-${reply.id}`}
                          alt="avatar"
                          className="w-5 h-5 rounded-full border"
                        />
                        <span className="font-medium">{reply.Author}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="ml-7">{reply.Text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default QuestionPage;
