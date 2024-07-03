

// // src/components/MailidPass.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import './MailidPass.css'; // Assuming you have some CSS for styling

// const accounts = [
//   { email: "pipluagro@justorganik.com", password: "Password:fpo154" },
//   { email: "Malpuraagro@justorganik.com", password: "Password:fpo156" },
//   { email: "Ramganjmandi@justorganik.com", password: "Password:fpo158" },
//   { email: "Mabijasan@justorganik.com", password: "Password:fpo160" },
//   { email: "Tharmaniorganic@justorganik.com", password: "Password:fpo162" },
//   { email: "sajani@justorganik.com", password: "Password:fpo164" },
//   { email: "Shivshakti@justorganik.com", password: "Password:fpo166" },
//   { email: "Chachiotvalley@justorganik.com", password: "Password:fpo168" },
//   { email: "Gadhpatitreta@justorganik.com", password: "Password:fpo170" },
//   { email: "Nihritreta@justorganik.com", password: "Password:fpo172" },
//   { email: "Farukhnagartreta@justorganik.com", password: "Password:fpo174" },
//   { email: "Pataudifed@justorganik.com", password: "Password:fpo176" },
//   { email: "Naharwadifed@justorganik.com", password: "Password:fpo178" },
//   { email: "Jatusanafed@justorganik.com", password: "Password:fpo180" },
//   { email: "Krshakswayat@justorganik..com", password: "Password:fpo182" },
//   { email: "Gomtifed@justorganik.com", password: "Password:fpo184" },
//   { email: "Sonalifed@justorganik.com", password: "Password:fpo186" },
//   { email: "Nandadevi@justorganik.com", password: "Password:fpo188" }
// ];

// const MailidPass = ({ handleLogin }) => {
//   const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleLoginClick = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log('Logging in with:', selectedAccount);
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email: selectedAccount.email,
//         password: selectedAccount.password
//       });
//       console.log('Response:', response.data);
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         handleLogin();
//         window.open('/stage1', '_blank');
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError('Please Enter Correct Login details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>Select an Account</h2>
//       <div className="tabs">
//         {accounts.map((account, index) => (
//           <button
//             key={index}
//             className={`tab ${selectedAccount.email === account.email ? 'active' : ''}`}
//             onClick={() => setSelectedAccount(account)}
//           >
//             {account.email}
//           </button>
//         ))}
//       </div>
//       <button
//         onClick={handleLoginClick}
//         style={{ marginTop: '20px' }}
//         disabled={loading}
//       >
//         {loading ? 'Logging in...' : 'Login'}
//       </button>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// };

// export default MailidPass;


// // src/components/MailidPass.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import './MailidPass.css'; // Assuming you have some CSS for styling

// const accounts = [
//   { email: "treta@justorganik.com", password: "treta@justorganik.com" },
//   { email: "pipluagro@justorganik.com", password: "Password:fpo154" },
//   { email: "Malpuraagro@justorganik.com", password: "Password:fpo156" },
//   { email: "Ramganjmandi@justorganik.com", password: "Password:fpo158" },
//   { email: "Mabijasan@justorganik.com", password: "Password:fpo160" },
//   { email: "Tharmaniorganic@justorganik.com", password: "Password:fpo162" },
//   { email: "sajani@justorganik.com", password: "Password:fpo164" },
//   { email: "Shivshakti@justorganik.com", password: "Password:fpo166" },
//   { email: "Chachiotvalley@justorganik.com", password: "Password:fpo168" },
//   { email: "Gadhpatitreta@justorganik.com", password: "Password:fpo170" },
//   { email: "Nihritreta@justorganik.com", password: "Password:fpo172" },
//   { email: "Farukhnagartreta@justorganik.com", password: "Password:fpo174" },
//   { email: "Pataudifed@justorganik.com", password: "Password:fpo176" },
//   { email: "Naharwadifed@justorganik.com", password: "Password:fpo178" },
//   { email: "Jatusanafed@justorganik.com", password: "Password:fpo180" },
//   { email: "Krshakswayat@justorganik..com", password: "Password:fpo182" },
//   { email: "Gomtifed@justorganik.com", password: "Password:fpo184" },
//   { email: "Sonalifed@justorganik.com", password: "Password:fpo186" },
//   { email: "Nandadevi@justorganik.com", password: "Password:fpo188" }
// ];

// const MailidPass = ({ handleLogin }) => {
//   const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleLoginClick = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log('Logging in with:', selectedAccount);
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email: selectedAccount.email,
//         password: selectedAccount.password
//       });
//       console.log('Response:', response.data);
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         handleLogin();
//         window.open('http://localhost:3000/stage1', '_blank');
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError('Please Enter Correct Login details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>Select an Account</h2>
//       <div className="tabs">
//         {accounts.map((account, index) => (
//           <button
//             key={index}
//             className={`tab ${selectedAccount.email === account.email ? 'active' : ''}`}
//             onClick={() => setSelectedAccount(account)}
//           >
//             {account.email}
//           </button>
//         ))}
//       </div>
//       <button
//         onClick={handleLoginClick}
//         style={{ marginTop: '20px' }}
//         disabled={loading}
//       >
//         {loading ? 'Logging in...' : 'Login'}
//       </button>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// };

// export default MailidPass;





// import React, { useState } from 'react';
// import axios from 'axios';
// import './MailidPass.css'; // Assuming you have some CSS for styling

// const accounts = [
//   { email: "treta@justorganik.com", password: "treta@justorganik.com" },
//   { email: "pipluagro@justorganik.com", password: "Password:fpo154" },
//   { email: "Malpuraagro@justorganik.com", password: "Password:fpo156" },
//   { email: "Ramganjmandi@justorganik.com", password: "Password:fpo158" },
//   { email: "Mabijasan@justorganik.com", password: "Password:fpo160" },
//   { email: "Tharmaniorganic@justorganik.com", password: "Password:fpo162" },
//   { email: "sajani@justorganik.com", password: "Password:fpo164" },
//   { email: "Shivshakti@justorganik.com", password: "Password:fpo166" },
//   { email: "Chachiotvalley@justorganik.com", password: "Password:fpo168" },
//   { email: "Gadhpatitreta@justorganik.com", password: "Password:fpo170" },
//   { email: "Nihritreta@justorganik.com", password: "Password:fpo172" },
//   { email: "Farukhnagartreta@justorganik.com", password: "Password:fpo174" },
//   { email: "Pataudifed@justorganik.com", password: "Password:fpo176" },
//   { email: "Naharwadifed@justorganik.com", password: "Password:fpo178" },
//   { email: "Jatusanafed@justorganik.com", password: "Password:fpo180" },
//   { email: "Krshakswayat@justorganik..com", password: "Password:fpo182" },
//   { email: "Gomtifed@justorganik.com", password: "Password:fpo184" },
//   { email: "Sonalifed@justorganik.com", password: "Password:fpo186" },
//   { email: "Nandadevi@justorganik.com", password: "Password:fpo188" }
// ];

// const MailidPass = ({ handleLogin }) => {
//   const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleLoginClick = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log('Logging in with:', selectedAccount);
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email: selectedAccount.email,
//         password: selectedAccount.password
//       });
//       console.log('Response:', response.data);
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         handleLogin();
//         // Redirect logic based on email
//         if (selectedAccount.email === "treta@justorganik.com") {
//           window.open('http://localhost:3000/mailidpass');
//         } else {
//           window.open('http://localhost:3000/stage1', '_blank');
//         }
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       setError('Please Enter Correct Login details.');
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>Select an Account</h2>
//       <div className="tabs">
//         {accounts.map((account, index) => (
//           <button
//             key={index}
//             className={`tab ${selectedAccount.email === account.email ? 'active' : ''}`}
//             onClick={() => setSelectedAccount(account)}
//           >
//             {account.email}
//           </button>
//         ))}
//       </div>
//       <button
//         onClick={handleLoginClick}
//         style={{ marginTop: '20px' }}
//         disabled={loading}
//       >
//         {loading ? 'Logging in...' : 'Login'}
//       </button>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// };

// export default MailidPass;

import React, { useState } from 'react';
import axios from 'axios';
import './MailidPass.css'; // Assuming you have some CSS for styling

const accounts = [
  { email: "treta@justorganik.com", password: "treta@justorganik.com" },
  { email: "pipluagro@justorganik.com", password: "Password:fpo154" },
  { email: "Malpuraagro@justorganik.com", password: "Password:fpo156" },
  { email: "Ramganjmandi@justorganik.com", password: "Password:fpo158" },
  { email: "Mabijasan@justorganik.com", password: "Password:fpo168" },
  { email: "Tharmaniorganic@justorganik.com", password: "Password:fpo162" },
  { email: "sajani@justorganik.com", password: "Password:fpo164" },
  { email: "Shivshakti@justorganik.com", password: "Password:fpo166" },
  { email: "Chachiotvalley@justorganik.com", password: "Password:fpo160" },
  { email: "Gadhpatitreta@justorganik.com", password: "Password:fpo170" },
  { email: "Nihritreta@justorganik.com", password: "Password:fpo172" },
  { email: "Farukhnagartreta@justorganik.com", password: "Password:fpo174" },
  { email: "Pataudifed@justorganik.com", password: "Password:fpo176" },
  { email: "Naharwadifed@justorganik.com", password: "Password:fpo178" },
  { email: "Jatusanafed@justorganik.com", password: "Password:fpo180" },
  { email: "Krshakswayat@justorganik..com", password: "Password:fpo182" },
  { email: "Gomtifed@justorganik.com", password: "Password:fpo184" },
  { email: "Sonalifed@justorganik.com", password: "Password:fpo186" },
  { email: "Nandadevi@justorganik.com", password: "Password:fpo188" }
];

const MailidPass = ({ handleLogin }) => {
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
        if (selectedAccount.email === "treta@justorganik.com") {
          window.open('http://localhost:3000/users', '_blank');
        } else {
          window.open('http://localhost:3000/stage1', '_blank');
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

export default MailidPass;
