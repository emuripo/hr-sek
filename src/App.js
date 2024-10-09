// src/App.js
import React from 'react'; 
import { BrowserRouter as Router } from 'react-router-dom'; 
import './App.css';
import AppRoutes from './routes/AppRoutes'; 
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
