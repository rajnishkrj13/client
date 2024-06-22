

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import Printing from './components/Printing';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import { UserProvider } from './components/UserContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <UserProvider>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute authenticated={isAuthenticated} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path='/printing' element ={<Printing/>}/>    
          {isAuthenticated && <Route path="/stage1" element={<Stage1 />} />}
          {isAuthenticated && <Route path="/stage2" element={<Stage2 />} />}
          {isAuthenticated && <Route path="/stage3" element={<Stage3 />} />}
          {isAuthenticated && <Route path="/stage4" element={<Stage4 />} />}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
