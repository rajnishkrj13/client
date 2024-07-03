// UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DataTable = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLoginAsUser = async (userId) => {
    try {
      const response = await axios.post('/api/login-as-user', { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Fetch user data to determine if the logged-in user is an admin
      const userResponse = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAdmin', user.email === 'treta@justorganik.com');

      setMessage('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in as user:', error);
      setMessage('Failed to log in as user');
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {message && <p>{message}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}) 
            <button onClick={() => handleLoginAsUser(user.id)}>Login as {user.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataTable;
