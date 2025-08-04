import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting React app...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
}