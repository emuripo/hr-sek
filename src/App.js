import React from 'react';  
import { BrowserRouter as Router } from 'react-router-dom'; 
import './App.css';
import AppRoutes from './routes/AppRoutes'; 
import Header from './components/Header'; // Importa el Header
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {/* Agrega el Header dentro de AuthProvider y antes de las rutas */}
          <Header />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
