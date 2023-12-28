import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/auth';
import ToasterProvider from './providers/ToasterProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToasterProvider/>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>
);

