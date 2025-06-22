import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import QuestionCreateForm from './ui-components/QuestionCreateForm';
import QuestionPage from './QuestionPage';
import AdminDashboard from './AdminDashboard';
import CleanupInvalidQuestions from './CleanupInvalidQuestions';
import NewQuestionWithImage from './NewQuestionWithImage';
import AuthPage from './AuthPage';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import { studioTheme } from './ui-components';
import AppNavbar from './AppNavbar';

// 👉 Override redirect URIs theo origin hiện tại (để hoạt động ở cả localhost và production)
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
          <AppNavbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cleanup" element={<CleanupInvalidQuestions />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/new-question" element={<NewQuestionWithImage />} />
          </Routes>
        </Authenticator.Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
