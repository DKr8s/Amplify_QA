import { useEffect, useState, useCallback } from "react";
import { generateClient } from '@aws-amplify/api';
import { listQuestions } from './graphql/queries';
import { updateQuestion } from './graphql/mutations';
import { onCreateQuestion } from './graphql/subscriptions';
import { Link } from "react-router-dom";
import debounce from 'lodash.debounce';
import SearchInput from './ui-components/SearchInput';
import { FaFacebookF, FaTwitter, FaLink } from "react-icons/fa";
const client = generateClient();

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [animateId, setAnimateId] = useState(null);
  const [animateType, setAnimateType] = useState(null);
  const [shareModalId, setShareModalId] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newlyCreatedIds, setNewlyCreatedIds] = useState([]);
  const itemsPerPage = 15;

  const sortQuestions = (items) => {
    return items.sort((a, b) => {
      const aScore = (a.upvotes || 0) - (a.downvotes || 0);
      const bScore = (b.upvotes || 0) - (b.downvotes || 0);
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const fetchQuestions = async (keywordVal = "") => {
    setLoading(true);
    try {
      let allItems = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: listQuestions,
          variables: { limit: 50, nextToken },
        });

        const items = result.data.listQuestions.items.filter((q) => q && q.createdAt);
        allItems = [...allItems, ...items];
        nextToken = result.data.listQuestions.nextToken;
      } while (nextToken);

      const keywordLC = keywordVal.trim().toLowerCase();
      if (keywordLC) {
        allItems = allItems.filter(
          (q) =>
            q.Text?.toLowerCase().includes(keywordLC) ||
            q.Author?.toLowerCase().includes(keywordLC)
        );
      }

      const sorted = sortQuestions(allItems);
      setAllQuestions(sorted);
      setQuestions(sorted.slice(0, itemsPerPage));
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ GraphQL fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((val) => {
      fetchQuestions(val);
    }, 400),
    []
  );

  useEffect(() => {
    debouncedFetch(keyword);
  }, [keyword]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const sub = client.graphql({ query: onCreateQuestion }).subscribe({
      next: ({ value }) => {
        const newQ = value.data.onCreateQuestion;
        const updated = sortQuestions([newQ, ...allQuestions]);
        setAllQuestions(updated);
        setQuestions(updated.slice(0, itemsPerPage));
        setNewlyCreatedIds((prev) => [...prev, newQ.id]);
      },
      error: (err) => console.error("❌ Subscription error:", err),
    });
    return () => sub.unsubscribe();
  }, [allQuestions]);

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
      const updatedAll = sortQuestions(
        allQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
      );
      setAllQuestions(updatedAll);
      setQuestions(updatedAll.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } catch (err) {
      console.error("❌ Vote failed:", err);
    }
  };

  const handleVoteAnimation = (id, type) => {
    setAnimateId(id);
    setAnimateType(type);
    voteQuestion(allQuestions.find((q) => q.id === id), type);
    setTimeout(() => {
      setAnimateId(null);
      setAnimateType(null);
    }, 300);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const start = (page - 1) * itemsPerPage;
    const newPageQuestions = allQuestions.slice(start, start + itemsPerPage);
    setQuestions([]);
    setTimeout(() => setQuestions(newPageQuestions), 100);
  };

  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);

  const copyToClipboard = (q) => {
    const url = `${window.location.origin}/question/${q.id}`;
    navigator.clipboard.writeText(`${q.Text}\n\nLink: ${url}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-0">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🔥 Top Voted Questions</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder=" Search by content or author"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No matching questions found 🤷‍♂️
        </div>
      ) : (
        <div className="space-y-4 transition-all duration-300">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-white rounded shadow hover:shadow-md transition-transform duration-300 transform hover:scale-[1.01]"
            >
              <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                <span>
                  ✍ {q.Author || "anonymous"} • {new Date(q.createdAt).toLocaleDateString()}
                  {newlyCreatedIds.includes(q.id) && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">🆕</span>
                  )}
                </span>
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

          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100"
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}

     {shareModalId && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setShareModalId(null)}
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
        📤 Share this question
      </h2>
      <p className="mb-2 text-gray-800 font-medium">
        {allQuestions.find((q) => q.id === shareModalId)?.Text}
      </p>
      <div className="bg-gray-100 p-2 rounded text-sm text-gray-800 mb-4 break-words">
        {`${window.location.origin}/question/${shareModalId}`}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() =>
            copyToClipboard(allQuestions.find((q) => q.id === shareModalId))
          }
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaLink /> Copy Link
        </button>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            `${window.location.origin}/question/${shareModalId}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
        >
          <FaFacebookF /> Facebook
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            `${window.location.origin}/question/${shareModalId}`
          )}&text=${encodeURIComponent(
            allQuestions.find((q) => q.id === shareModalId)?.Text || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
        >
          <FaTwitter /> Twitter
        </a>

        <button
          onClick={() => setShareModalId(null)}
          className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default QuestionsPage;
