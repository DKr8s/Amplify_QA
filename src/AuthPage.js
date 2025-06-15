import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  // Nếu chưa đăng nhập → render Authenticator
  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
        <Authenticator />
      </div>
    );
  }

  // Nếu đã đăng nhập → render welcome + ảnh + nút quay về
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
     <img
  src="https://plus.unsplash.com/premium_vector-1720824711748-50e59cfd92b7?q=80&w=800&auto=format&fit=crop"
  alt="Confirmed"
  style={{ maxWidth: '300px', marginBottom: '1rem', borderRadius: '10px' }}
/>
      <h2>✅ Welcome: {user.username}</h2>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '1.5rem',
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#084DC5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ⬅ BACK TO HOME PAGE
      </button>
    </div>
  );
}
