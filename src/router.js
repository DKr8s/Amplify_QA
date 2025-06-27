// src/router.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import HomePage from './Homepage';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import CleanupInvalidQuestions from './CleanupInvalidQuestions';
import NewQuestionWithImage from './NewQuestionWithImage';
import QuestionDetail from './QuestionDetail';
import RequireAdmin from './RequireAdmin';

export default function Router() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
        <Route path="/new-question" element={<NewQuestionWithImage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route path="/cleanup" element={<CleanupInvalidQuestions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
