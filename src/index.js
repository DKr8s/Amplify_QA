import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import { studioTheme } from './ui-components';

import AppLayout from './AppLayout';
import HomePage from './Homepage';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import CleanupInvalidQuestions from './CleanupInvalidQuestions';
import NewQuestionWithImage from './NewQuestionWithImage';
import QuestionPage from './QuestionsPage';
import QuestionDetail from './QuestionDetail';
const updatedAwsConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redirectSignIn: `${window.location.origin}/`,
    redirectSignOut: `${window.location.origin}/`,
  },
};
Amplify.configure(updatedAwsConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={studioTheme}>
        <Authenticator.Provider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/cleanup" element={<CleanupInvalidQuestions />} />
              <Route path="/question/:id" element={<QuestionDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/new-question" element={<NewQuestionWithImage />} />
            </Route>
          </Routes>
        </Authenticator.Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
