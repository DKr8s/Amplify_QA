// src/QuestionsPage.jsx
import { useEffect, useState } from "react";
import { DataStore, SortDirection } from "aws-amplify/datastore";
import { Question } from "./models";
import { Link } from "react-router-dom";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    DataStore.query(Question, undefined, {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    }).then(setQuestions);
  }, []);

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <Link
          to={`/question/${q.id}`}
          key={q.id}
          className="block p-4 bg-white rounded shadow hover:shadow-md"
        >
          <div className="text-sm text-gray-600 mb-1">
            ✍ {q.Author || "anonymous"} •{" "}
            {new Date(q.createdAt).toLocaleDateString()}
          </div>
          <h3 className="text-lg font-semibold text-blue-800">{q.Text}</h3>
        </Link>
      ))}
    </div>
  );
};

export default QuestionsPage;
