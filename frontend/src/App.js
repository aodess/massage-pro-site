import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('App component loaded successfully');
    
    fetch('http://localhost:8000/api/test')
      .then(res => res.json())
      .then(data => console.log('API response:', data))
      .catch(err => console.error('API error:', err));
  }, []);

  return (
    <div>
      <h1>Сайт массажиста</h1>
      <p>Проверьте консоль для логов</p>
    </div>
  );
}

export default App;