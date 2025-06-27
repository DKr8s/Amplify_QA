import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function AuthPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center">
      <Authenticator
        socialProviders={['google']}
        variation="default" // 👈 để mặc định mới có giao diện tab SignIn / Create
      />
    </div>
  );
}
