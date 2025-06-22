import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import AppLayout from './AppLayout';
import QuestionPage from './QuestionPage';
import AdminDashboard from './AdminDashboard';
import CleanupInvalidQuestions from './CleanupInvalidQuestions';
import RequireAdmin from './RequireAdmin'; // thêm dòng này

export default function Router() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AppLayout user={user} signOut={signOut}>
          <Routes>
            <Route path="/" element={<QuestionPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin user={user}>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route path="/cleanup" element={<CleanupInvalidQuestions />} />
            {/* Optional fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      )}
    </Authenticator>
  );
}
