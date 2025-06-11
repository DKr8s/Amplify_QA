import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

import { ThemeProvider } from "@aws-amplify/ui-react";
import QuestionCreateForm from "./ui-components/QuestionCreateForm";
import QuestionPage from "./QuestionPage";
import { studioTheme, Navbar } from "./ui-components";


Amplify.configure(awsconfig);

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/new-question", element: <QuestionCreateForm /> },
  { path: "/question/:id", element: <QuestionPage /> },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={studioTheme}>
      <Navbar />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
