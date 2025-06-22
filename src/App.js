import { useEffect, useState } from "react";
import { DataStore, SortDirection, Predicates } from "aws-amplify/datastore";
import { Question } from "./models";
import { Link } from "react-router-dom";

const QuestionsPage = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await DataStore.query(Question, Predicates.ALL, {
        sort: (s) => s.createdAt(SortDirection.DESCENDING),
      });
      setAllQuestions(questions);
      setFilteredQuestions(questions);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = allQuestions.filter((q) => {
      const matchesText = q.Text.toLowerCase().includes(searchText.toLowerCase());
      const matchesAuthor = q.Author?.toLowerCase().includes(selectedAuthor.toLowerCase());
      return matchesText && matchesAuthor;
    });
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [searchText, selectedAuthor, allQuestions]);

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  return (
    <div className="bg-[#f6f9fc] min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-xl shadow mb-10">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-blue-800 mb-3">
              Ask Anything,<br />
              Answer Everything
            </h1>
            <p className="text-gray-600 mb-4">
              A simple and beautiful app where you can freely post your questions
              and help others by answering theirs.
            </p>
            <a
              href="/new-question"
              className="inline-block bg-pink-600 text-white px-5 py-2 rounded shadow hover:bg-pink-700 transition"
            >
              🚀 Let's Get Started
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="Illustration"
              className="max-w-xs md:max-w-md lg:max-w-lg"
            />
          </div>
        </div>

        {/* Question Section */}
        <div id="questions">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
            📚 Question List
          </h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm"
              placeholder="🔍 Search by content"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input
              type="text"
              className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm"
              placeholder="👤 Filter by author"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            />
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {paginatedQuestions.map((q) => (
              <Link
                to={`/question/${q.id}`}
                key={q.id}
                className="block bg-white p-4 rounded-lg border shadow hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${q.Author || "anonymous"}-${q.id}`}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border"
                  />
                  <span className="text-sm text-gray-600">
                    ✍ {q.Author || "anonymous"} • {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                  {q.Text}
                </h3>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border-blue-300"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
