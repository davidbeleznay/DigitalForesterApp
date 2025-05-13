import React from 'react';
import AppRouter from './navigation/AppRouter';
import './styles/index.css';
import './styles/culvert-form.css';
import './styles/home.css';

function App() {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
}

export default App;
