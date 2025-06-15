import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import QuestionCreateForm from './ui-components/QuestionCreateForm';
import QuestionPage from './QuestionPage';
import AdminDashboard from './AdminDashboard'; // 👈 thêm dòng này nếu chưa có

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react'; // 👈 import Authenticator
import { studioTheme } from './ui-components';
import AppNavbar from './AppNavbar';
import AuthPage from './AuthPage';
import NewQuestionWithImage from './NewQuestionWithImage';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={studioTheme}>
        <Authenticator.Provider>
          <AppNavbar />
          <Routes>
 <Route path="/" element={<App />} />
  <Route path="/auth" element={<AuthPage />} /> {/* 👈 CHỈ CẦN THẾ NÀY */}
  
  <Route path="/question/:id" element={<QuestionPage />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/new-question" element={<NewQuestionWithImage />} />
</Routes>
        </Authenticator.Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
