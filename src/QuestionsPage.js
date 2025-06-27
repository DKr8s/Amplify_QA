// src/QuestionsPage.js
import { useEffect, useState } from "react";
import { generateClient } from '@aws-amplify/api';
import { listQuestions } from './graphql/queries';
import { updateQuestion } from './graphql/mutations';
import { Link } from "react-router-dom";
import SearchInput from './ui-components/SearchInput';
import { FaFacebookF, FaFacebookMessenger, FaTwitter } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const client = generateClient();

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [authorText, setAuthorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [animateId, setAnimateId] = useState(null);
  const [animateType, setAnimateType] = useState(null);
  const [shareModalId, setShareModalId] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const filter = {};
      if (searchText.trim()) {
        filter.Text = { contains: searchText.trim() };
      }
      if (authorText.trim()) {
        filter.Author = { contains: authorText.trim() };
      }

      const res = await client.graphql({
        query: listQuestions,
        variables: {
          filter: Object.keys(filter).length ? filter : undefined,
          limit: 1000,
        },
      });

      const sorted = [...res.data.listQuestions.items]
        .filter((q) => q && q.createdAt)
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

      setQuestions(sorted);
    } catch (err) {
      console.error('❌ GraphQL fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const voteQuestion = async (question, type = "up") => {
    try {
      const newVotes = {
        upvotes: type === "up" ? (question.upvotes || 0) + 1 : question.upvotes,
        downvotes: type === "down" ? (question.downvotes || 0) + 1 : question.downvotes,
      };

      const updated = await client.graphql({
        query: updateQuestion,
        variables: {
          input: {
            id: question.id,
            _version: question._version,
            ...newVotes,
          },
        },
      });

      const updatedQuestion = updated.data.updateQuestion;
      setQuestions((prev) =>
        [...prev]
          .map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      );
    } catch (err) {
      console.error("❌ Vote failed:", err);
    }
  };

  const handleVoteAnimation = (id, type) => {
    setAnimateId(id);
    setAnimateType(type);
    voteQuestion(questions.find(q => q.id === id), type);
    setTimeout(() => {
      setAnimateId(null);
      setAnimateType(null);
    }, 300);
  };

  const renderShareModal = (id) => {
    if (!id) return null;
    const url = `${window.location.origin}/question/${id}`;
    const encodedURL = encodeURIComponent(url);
    const links = [
      { label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`, icon: <FaFacebookF />, color: "hover:text-blue-600" },
      { label: "Messenger", url: `https://www.facebook.com/dialog/send?link=${encodedURL}`, icon: <FaFacebookMessenger />, color: "hover:text-blue-500" },
      { label: "Twitter", url: `https://twitter.com/intent/tweet?url=${encodedURL}`, icon: <FaTwitter />, color: "hover:text-sky-500" },
      { label: "Zalo", url: `https://zalo.me/share?url=${encodedURL}`, icon: <SiZalo />, color: "hover:text-indigo-500" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-blue-800 text-center mb-4 flex flex-col items-center">
  <span className="text-3xl mb-1">📤</span>
  <span className="border-b border-blue-300 pb-1">Share the question</span>
</h2>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-gray-700 font-medium ${link.color}`}
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/question/${shareModalId}`);
                alert("✅ Link has been copied!");
              }}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 rounded text-sm"
            >
              📋 Copy question link
            </button>
          </div>

          <button
            onClick={() => setShareModalId(null)}
            className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchText, authorText]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🔥 Top Voted Questions</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by content"
        />
        <SearchInput
          value={authorText}
          onChange={(e) => setAuthorText(e.target.value)}
          placeholder="👤 Search by author"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No matching questions found 🤷‍♂️
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                <span>✍ {q.Author || "anonymous"} • {new Date(q.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteAnimation(q.id, "up")}
                    className={`text-green-600 hover:text-green-800 transition-transform duration-200 ${
                      animateId === q.id && animateType === "up" ? "scale-125" : ""
                    }`}
                  >
                    👍 {q.upvotes || 0}
                  </button>
                  <button
                    onClick={() => handleVoteAnimation(q.id, "down")}
                    className={`text-red-600 hover:text-red-800 transition-transform duration-200 ${
                      animateId === q.id && animateType === "down" ? "scale-125" : ""
                    }`}
                  >
                    👎 {q.downvotes || 0}
                  </button>
                  <button
                    onClick={() => setShareModalId(q.id)}
                    className="text-blue-500 hover:underline"
                  >
                    📤 Share
                  </button>
                </div>
              </div>
              <Link to={`/question/${q.id}`}>
                <h3 className="text-lg font-semibold text-blue-800 hover:underline">
                  {q.Text}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      )}

      {renderShareModal(shareModalId)}
    </div>
  );
};

export default QuestionsPage;
