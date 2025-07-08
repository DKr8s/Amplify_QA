import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { listQuestions, listAnswers } from './graphql/queries';
import { deleteQuestion, deleteAnswer } from './graphql/mutations';

const client = generateClient();

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authorized, setAuthorized] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const alreadyNotified = useRef(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const qRes = await client.graphql({ query: listQuestions });
      const aRes = await client.graphql({ query: listAnswers });
      setQuestions(qRes.data.listQuestions.items);
      setAnswers(aRes.data.listAnswers.items);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) {
        console.warn("No idToken found in session.");
        setAuthorized(false);
        return;
      }

      let payload;
      try {
        payload = JSON.parse(atob(idToken.split('.')[1]));
      } catch (err) {
        console.error("❌ Failed to decode ID token:", err);
        setAuthorized(false);
        return;
      }

      const groups = payload['cognito:groups'] || [];
      if (groups.includes('Admin')) {
        setAuthorized(true);
        fetchData();
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      setAuthorized(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const deleteGraphQLItem = async (mutation, id, version) => {
    return client.graphql({
      query: mutation,
      variables: { input: { id, _version: version } },
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirm = window.confirm('Are you sure you want to delete this question?');
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
      console.error('❌Error while deleting:', err);
    }
  };

  const filterBySearch = (items) =>
    items.filter((item) =>
      [item.Text, item.Author].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );

  const filteredQuestions = filterBySearch(questions);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (authorized === false) {
    return (
      <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '70vh', textAlign: 'center' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Access Denied" style={{ width: '180px', height: '180px', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2rem', color: '#d9534f', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#333' }}>
          You do not have permission to access this admin page.<br />
          Please contact the administrator if you believe this is an error.
        </p>
        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', backgroundColor: '#084DC5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>⬅ Back to Home Page</button>
      </div>
    );
  }

  if (authorized === null) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><p>🔐 Checking permissions...</p></div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search questions or authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '1.5rem', fontSize: '1rem' }}
      />

      {isRefreshing && <p style={{ color: 'gray' }}>🔄 Loading data...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {paginatedQuestions.map((q) => (
          <div key={q.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{q.Text}</strong>
              <button onClick={() => handleDeleteQuestion(q.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>🗑 Delete</button>
            </div>
            <p style={{ color: 'gray', fontSize: '0.9rem' }}>✍ {q.Author || 'anonymous'}</p>
            <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '3px solid #007bff' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Answers:</h4>
              {answers.filter((a) => a.questionID === q.id).map((a) => (
                <div key={a.id} style={{ marginBottom: '0.5rem', backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{a.Text}</span>
                    <button onClick={() => handleDeleteAnswer(a.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>🗑</button>
                  </div>
                  <small style={{ color: 'gray' }}>✍ {a.Author || 'anonymous'}</small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              backgroundColor: currentPage === i + 1 ? '#007bff' : '#fff',
              color: currentPage === i + 1 ? '#fff' : '#007bff',
              border: '1px solid #007bff',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
      </div>
    </div>
  );
}
