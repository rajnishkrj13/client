
// import React, { useState } from 'react';
// import axios from 'axios';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ handleLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', { email, password });
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         handleLogin();
//         navigate('/stage1');
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Please Enter Correct Login details.');
//     }
//   };

//   return (
//     <div className="logcontainer">
//       <h2>Login</h2>
//       <form onSubmit={handleLoginSubmit}>
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
//         <button type="submit">Login</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default Login;







import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        handleLogin();
        
        // Check if email is treta@justorganik.com for redirect
        if (email === 'treta@justorganik.com') {
          navigate('/users');
        }
         else if (email === 'printing@justorganik.com') {
          navigate('/printing');
        }
        // else if (email === 'printingviewer@justorganik.com') {
        //   navigate('/PrintingViewer');
        // }
        else {
          navigate('/stage1');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Please Enter Correct Login details.');
    }
  };

  return (
    <div className="logcontainer">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
