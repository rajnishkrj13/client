import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useUser } from './UserContext';

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const isAdminUser = localStorage.getItem('isAdmin');
    setIsAdmin(isAdminUser === 'true');
  }, [user]);
  

  const onLogoutClick = () => {
    localStorage.clear();
    handleLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">JO DMS</Link>
      <ul className="navbar-links">
        {!isAuthenticated ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/stage1">Stage1</Link></li>
            <li><Link to="/stage2">Stage2</Link></li>
            <li><Link to="/stage3">Stage3</Link></li>
            <li><Link to="/stage4">Stage4</Link></li>
            {isAdmin  && <li><Link to="/printing">Printing</Link></li>}
            <li><button onClick={onLogoutClick}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
