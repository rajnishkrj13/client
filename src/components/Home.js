import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to Just Organik Document Management System</h1>
        {!isAuthenticated && (
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
