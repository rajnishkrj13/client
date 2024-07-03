import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ authenticated }) => {
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({ authenticated, user }) => {
//   if (!authenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user !== 'treta@justorganik.com') {
//     return <Navigate to="/not-authorized" replace />; // or some other component indicating no access
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
