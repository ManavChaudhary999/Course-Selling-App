import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { InstructorProvider } from './contexts/InstructorContext';
import { StudentProvider } from './contexts/StudentContext';
import { CoursesProvider } from './contexts/CoursesContext';
import App from './App';
import './index.css';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <StudentProvider>
          {/* <CoursesProvider> */}
            <App />
          {/* </CoursesProvider> */}
          </StudentProvider>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);