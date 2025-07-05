import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from '@aws-amplify/auth';
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
  const [authorized, setAuthorized] = useState(null);
  const alreadyNotified = useRef(false);

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

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const payload = JSON.parse(atob(idToken.split('.')[1]));
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

  if (authorized === false) {
    return (
      <div style={{
        padding: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '70vh',
        textAlign: 'center'
      }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
          alt="Access Denied"
          style={{ width: '180px', height: '180px', marginBottom: '1.5rem' }}
        />
        <h2 style={{ fontSize: '2rem', color: '#d9534f', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#333' }}>
          You do not have permission to access this admin page.<br />
          Please contact the administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#084DC5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Home Page
        </button>
      </div>
    );
  }

  if (authorized === null) return null;

  // ... rest of code remains unchanged
}
