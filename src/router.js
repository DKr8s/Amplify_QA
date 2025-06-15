// router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import AppLayout from './AppLayout';
import QuestionPage from './QuestionPage';
import AdminDashboard from './AdminDashboard';

export default function Router() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AppLayout user={user} signOut={signOut}>
          <Routes>
            <Route path="/" element={<QuestionPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AppLayout>
      )}
    </Authenticator>
  );
}
