import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AppNavbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#084DC5',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'bold',
    }}>
      <div style={{ fontSize: '1.5rem' }}>🌟 Question & Answer App</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home Page</Link>
        <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
        <Link to="/new-question" style={{ color: '#fff', textDecoration: 'none' }}>New Question</Link>

        {user ? (
          <>
            <span>👤 {user.username}</span>
            <button onClick={signOut} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" style={{ color: '#fff', textDecoration: 'none' }}>Log in/ Sign up</Link>
        )}
      </div>
    </nav>
  );
}
