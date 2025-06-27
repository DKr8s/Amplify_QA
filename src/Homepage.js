import React from 'react';
import QuestionsPage from './QuestionsPage';

const HomePage = () => {
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

        <QuestionsPage />
      </div>
    </div>
  );
};

export default HomePage;
