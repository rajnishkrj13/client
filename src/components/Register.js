// import React, { useState } from 'react';
// import axios from 'axios';
// import './Register.css';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/register', { name, email, password, phone });
//       if (response.data.success) {
//         navigate('/login');
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during registration. Please try again.');
//     }
//   };

//   return (
//     <div className='classregister'>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="tel"
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//         <button type="submit">Register</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default Register;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Assuming you have a UserContext to get user information

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser(); // Assuming you have a useUser hook to get user information

  useEffect(() => {
    // Redirect if user is not treta@justorganik.com
    if (user && user.email !== 'treta@justorganik.com') {
      navigate('/users'); // Redirect to homepage or any other appropriate page
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password, phone });
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className='classregister'>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
