import React, { useState } from 'react';
import axios from 'axios';
import './MailidPass.css'; // Assuming you have some CSS for styling

const accounts = [
  { email: "Sensational@justorganik.com", password: "Sen@#JO123" },
  { email: "Vdhyas@justorganik.com", password: "Vdh@#JO124" },
  { email: "Stena@justorganik.com", password: "Ste@#JO125" },
  { email: "Uae@justorganik.com", password: "Uae@#JO126" },
  { email: "Vrl@justorganik.com", password: "Vrl@#JO127" },
];


const ExportUserID = ({ handleLogin }) => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

    const handleLoginClick = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Logging in with:', selectedAccount);
      const response = await axios.post('http://localhost:5000/api/login', {
        email: selectedAccount.email,
        password: selectedAccount.password
      });
      console.log('Response:', response.data);
      if (response.data.success) {
        // Store user data and admin status in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isAdmin', response.data.email === 'treta@justorganik.com');
        
        handleLogin();

        // Redirect logic based on email
        if (emailList.includes(selectedAccount.email)) {
          window.open('http://localhost:3000/tableform', '_blank');
        } 
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const emailList = [
    "Sensational@justorganik.com",
    "Vdhyas@justorganik.com",
    "Stena@justorganik.com",
    "Uae@justorganik.com",
    "Vrl@justorganik.com",
  ];
  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Select an Account</h2>
      <div className="tabs">
        {accounts.map((account, index) => (
          <button
            key={index}
            className={`tab ${selectedAccount.email === account.email ? 'active' : ''}`}
            onClick={() => setSelectedAccount(account)}
          >
            {account.email}
          </button>
        ))}
      </div>
      <button
        onClick={handleLoginClick}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ExportUserID;
