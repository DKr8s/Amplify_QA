import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataStore } from '@aws-amplify/datastore';
import { Question, Answer } from './models';
import { generateClient } from 'aws-amplify/api';
import { deleteQuestion, deleteAnswer } from './graphql/mutations';

const client = generateClient();

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const q = await DataStore.query(Question);
      const a = await DataStore.query(Answer);
      setQuestions(q);
      setAnswers(a);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteGraphQLItem = async (mutation, id, version) => {
    return client.graphql({
      query: mutation,
      variables: { input: { id, _version: version } },
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirm = window.confirm('Are you sure you want to delete this question??');
    if (!confirm) return;

    try {
      const relatedAnswers = answers.filter((ans) => ans.questionID === questionId);
      for (const ans of relatedAnswers) {
        await deleteGraphQLItem(deleteAnswer, ans.id, ans._version);
      }

      const questionToDelete = questions.find((q) => q.id === questionId);
      if (!questionToDelete) return;

      await deleteGraphQLItem(deleteQuestion, questionId, questionToDelete._version);

      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setAnswers((prev) => prev.filter((a) => a.questionID !== questionId));
    } catch (err) {
      console.error('❌ Error while deleting:', err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const confirm = window.confirm('Are you sure you want to delete this answer?');
    if (!confirm) return;

    try {
      const ans = answers.find((a) => a.id === answerId);
      if (!ans) return;

      await deleteGraphQLItem(deleteAnswer, answerId, ans._version);
      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
    } catch (err) {
      console.error('❌Error while deleting :', err);
    }
  };

  const filterBySearch = (items) =>
    items.filter((item) =>
      [item.Text, item.Author].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );

  const filteredQuestions = filterBySearch(questions);
  const filteredAnswers = filterBySearch(answers);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '3rem',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
  };

  const cellStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    verticalAlign: 'top',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h2>🛠️ Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by author or text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          onClick={fetchData}
          disabled={isRefreshing}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      <p style={{ marginBottom: '1rem' }}>📄 Saved Questions List:</p>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={cellStyle}>Author</th>
            <th style={cellStyle}>Text</th>
            <th style={cellStyle}>Created At</th>
            <th style={cellStyle}>Image</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q.id}>
              <td style={cellStyle}>{q.Author}</td>
              <td style={cellStyle}>{q.Text}</td>
              <td style={cellStyle}>{new Date(q.createdAt).toLocaleString()}</td>
              <td style={cellStyle}>{q.imageUrl ? <a href={q.imageUrl} target="_blank" rel="noopener noreferrer">View</a> : '—'}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 16px' }}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginBottom: '1rem' }}>💬 Saved Answers List:</p>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={cellStyle}>Author</th>
            <th style={cellStyle}>Text</th>
            <th style={cellStyle}>Created At</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnswers.map((a) => (
            <tr key={a.id}>
              <td style={cellStyle}>{a.Author}</td>
              <td style={cellStyle}>{a.Text}</td>
              <td style={cellStyle}>{new Date(a.createdAt).toLocaleString()}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleDeleteAnswer(a.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 16px' }}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 20px', backgroundColor: '#084DC5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ⬅ Back to Home Page
        </button>
      </div>
    </div>
  );
}
