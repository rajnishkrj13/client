// // import React, { useEffect, useState, useRef, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();

// //   const initialRows = [
//     // { id: 1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
//     // { id: 2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
//     // { id: 7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     // { id: 8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
//     // { id: 9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     // { id: 10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     // { id: 11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
//     // { id: 12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
//     // { id: 13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     // { id: 21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
//     // { id: 22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
//     // { id: 23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     // { id: 24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     // { id: 25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
//     // { id: 26, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
//     // { id: 32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
//     // { id: 33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
//     // { id: 35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
//     // { id: 36, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
//     // { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//     // { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//     // { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     // { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     // { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//     // { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//     // { id: 48, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //   ];

// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       // Filter out users with ID 4 and 14 or specific email addresses
// //       // const filteredUsers = usersData.data.filter(user =>
// //       //   user.id !== 4 && user.id !== 14 && user.email !== 'treta@justorganik.com' && user.email !== 'printing@justorganik.com'
// //       // );

// //       // const filteredUsers = usersData.data.filter(user => {
// //       //   return user.id === 33 || user.id === 34 || user.id === 35 || user.id === 36 || user.id === 37 || user.id === 38 || user.id === 39 || user.id === 40;
// //       // });
// //       const userIDs = [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));


// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   // const handleLogout = () => {
// //   //   localStorage.removeItem('token');
// //   //   navigate('/login');
// //   // };

// //   const handleFileChange = (e, id) => {
// //     const file = e.target.files[0];
// //     const fileName = e.target.value;
// //     const fileExtension = fileName.split('.').pop().toLowerCase();
// //     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
// //       setError('Please select a JPG, JPEG, or PDF file to upload.');
// //       return;
// //     }
// //     const newFiles = { ...files, [id]: file };
// //     setFiles(newFiles);
// //     setError(null);
// //   };

// //   const handleFileNameChange = (e, id) => {
// //     const newFileNames = { ...fileNames, [id]: e.target.value };
// //     setFileNames(newFileNames);
// //   };

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleFileUpload = async (e, id) => {
// //     e.preventDefault();
// //     const token = localStorage.getItem('token');
// //     const file = files[id];
// //     const fileName = fileNames[id];
// //     if (!file) {
// //       setError('Please select a file to upload.');
// //       return;
// //     }
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     formData.append('fileName', fileName);
// //     formData.append('rowId', id);

// //     try {
// //       const response = await axios.post('http://localhost:5000/api/upload', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       const newResponse = {
// //         id: response.data.id, // Assuming the backend returns the new response ID
// //         user_id: response.data.user_id,
// //         file: response.data.file,
// //         fileName: fileName,
// //         rowId: id,
// //       };
// //       setResponses((prevResponses) => [...prevResponses, newResponse]);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads(selectedUser);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   // const handleFileDelete = async (_rowId, fileId, fileName) => {
// //   //   const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
// //   //   if (!confirmation) {
// //   //     return;
// //   //   }

// //   //   const token = localStorage.getItem('token');

// //   //   try {
// //   //     const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //   //       headers: {
// //   //         Authorization: `Bearer ${token}`,
// //   //       },
// //   //     });

// //   //     if (response.data.success) {
// //   //       alert('File deleted successfully.');
// //   //       const updatedResponses = responses.filter((response) => response.id == fileId);
// //   //       setResponses(updatedResponses);
// //   //       fetchUploads(selectedUser);
// //   //     } else {
// //   //       setError(response.data.message);
// //   //     }
// //   //   } catch (error) {
// //   //     console.error(error);
// //   //     setError('Failed to delete file. Please try again later.');
// //   //   }
// //   // };

// //   // const handleAddMore = (id) => {
// //   //   setEditingRow(id);
// //   // };

// //   const handleSelectUser = async (userName) => {
// //     setSelectedUser(userName);
// //     fetchUploads(userName);
// //   };

// //   return (
// //     <div className="dashboard-container">
// //       <header className="dashboard-header">
// //         <h1>Welcome, {user && user.name}!</h1>
// //         {/* <div className="dashboard-actions">
// //           <button onClick={handleLogout}>Logout</button>
// //         </div> */}
// //       </header>
// //       <div className="user-list">
// //         <h2>User List</h2>
// //         {users.map((user) => (
// //           <div key={user.id} className="user-item">
// //             <span>{user.name}</span>
// //             <button onClick={() => handleSelectUser(user.name)}>View Documents</button>
// //           </div>
// //         ))}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser}</h2>
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>Upload</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                           {/* <button onClick={() => handleFileDelete(row.id, response.id, response.fileName)}>Delete</button> */}
// //                         </div>
// //                       ))}
// //                       {/* <button onClick={() => handleAddMore(row.id)}>Add More</button> */}
// //                       {editingRow === row.id && (
// //                         <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                           <input
// //                             type="file"
// //                             ref={(ref) => (fileInputRefs.current[row.id] = ref)}
// //                             onChange={(e) => handleFileChange(e, row.id)}
// //                           />
// //                           <input
// //                             type="text"
// //                             placeholder="Enter file name"
// //                             value={fileNames[row.id] || ''}
// //                             onChange={(e) => handleFileNameChange(e, row.id)}
// //                           />
// //                           {/* <button type="submit">Upload</button> */}
// //                         </form>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;



// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [uploadProgress, setUploadProgress] = useState({});
// //   const navigate = useNavigate();
// //   const { updateUser } = useUser();
// //   const initialRows = [
// //     { id: 1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
// //     { id: 2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
// //     { id: 7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
// //     { id: 9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
// //     { id: 12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
// //     { id: 13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
// //     { id: 22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
// //     { id: 23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
// //     { id: 26, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
// //     { id: 32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
// //     { id: 33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
// //     { id: 35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
// //     { id: 36, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //     { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
// //     { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
// //     { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
// //     { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
// //     { id: 48, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //   ];
// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const userIDs = [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);
      
// //       // Calculate progress
// //       const userResponses = responsesData.data;
// //       const totalFiles = rows.length; // Assuming you want to show progress for each row
// //       const uploadedFiles = userResponses.length; // Number of files uploaded

// //       setUploadProgress(prev => ({
// //         ...prev,
// //         [userName]: {
// //           uploadedFiles,
// //           totalFiles
// //         }
// //       }));

// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleSelectUser = async (userName) => {
// //     setSelectedUser(userName);
// //     fetchUploads(userName);
// //   };

// //   const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //     const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;
// //     return (
// //       <div className="progress-bar">
// //         <div className="progress" style={{ width: `${progress}%` }}>
// //           {uploadedFiles}/{totalFiles} files uploaded
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="dashboard-container">
// //       <header className="dashboard-header">
// //         <h1>Welcome, {user && user.name}!</h1>
// //       </header>
// //       <div className="user-list">
// //         <h2>User List</h2>
// //         {users.map((user) => (
// //           <div key={user.id} className="user-item">
// //             <span>{user.name}</span>
// //             <button onClick={() => handleSelectUser(user.name)}>View Documents</button>
// //           </div>
// //         ))}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser}</h2>
// //           <ProgressBar
// //             uploadedFiles={uploadProgress[selectedUser]?.uploadedFiles || 0}
// //             totalFiles={uploadProgress[selectedUser]?.totalFiles || rows.length}
// //           />
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>File</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                         </div>
// //                       ))}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;












// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [uploadProgress, setUploadProgress] = useState({});
// //   const navigate = useNavigate();
// //   const { updateUser } = useUser();

// //   const initialRows = [
//     // { id: 1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
//     // { id: 2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
//     // { id: 6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
//     // { id: 7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     // { id: 8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
//     // { id: 9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     // { id: 10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     // { id: 11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
//     // { id: 12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
//     // { id: 13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     // { id: 21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
//     // { id: 22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
//     // { id: 23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     // { id: 24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     // { id: 25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
//     // { id: 26, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
//     // { id: 32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
//     // { id: 33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
//     // { id: 35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
//     // { id: 36, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
//     // { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//     // { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//     // { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     // { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     // { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//     // { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//     // { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//     // { id: 48, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //   ];
// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const userIDs = [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);
      
// //       // Calculate progress
// //       const userResponses = responsesData.data;
// //       const totalFiles = rows.length; // Assuming you want to show progress for each row
// //       const uploadedFiles = userResponses.length; // Number of files uploaded

// //       setUploadProgress(prev => ({
// //         ...prev,
// //         [userName]: {
// //           uploadedFiles,
// //           totalFiles
// //         }
// //       }));

// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleSelectUser = async (userName) => {
// //     setSelectedUser(userName);
// //     fetchUploads(userName);
// //   };
  
// //   // const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //   //   const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;
// //   //   return (
// //   //      <div className="progress-bar">
        
// //   //       <div className="progress" style={{ width: `${progress}%` }}>
// //   //        <table className='progresstable'><tr><td> {uploadedFiles}/{totalFiles} </td></tr></table>
// //   //       </div>
// //   //     </div>
// //   //   );
// //   // };


// //   // const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //   //   const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;
// //   //   return (
// //   //     <div className="progress-bar">
// //   //       <div className="progress" style={{ width: `${progress}%` }}>
// //   //         <table className="progresstable">
// //   //           <tbody>
// //   //             <tr>
// //   //               <td>{uploadedFiles}/{totalFiles} Progress</td>
// //   //             </tr>
// //   //             {/* Render each file in a separate row */}
// //   //             {[...Array(uploadedFiles)].map((_, index) => (
// //   //               <tr key={index}>
// //   //                 <td>File {index + 1} uploaded</td>
// //   //               </tr>
// //   //             ))}
// //   //           </tbody>
// //   //         </table>
// //   //       </div>
// //   //     </div>
// //   //   );
// //   // };

// //   const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //     const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;
    
// //     const getStageText = (uploadedFiles) => {
// //       if (uploadedFiles >= 41) {
// //         return "Stage 4 Completed";
// //       } else if (uploadedFiles >= 31) {
// //         return "Stage 3 Completed";
// //       } else if (uploadedFiles >= 21) {
// //         return "Stage 2 Completed";
// //       } else if (uploadedFiles >= 13) {
// //         return "Stage 1 Completed";
// //       } else {
// //         return `Uploaded ${uploadedFiles} files`;
// //       }
// //     };
  
// //     return (
// //       <div className="progress-bar">
// //         <div className="progress" style={{ width: `${progress}%` }}>
// //           <table className="progresstable">
// //             <tbody>
// //               <tr>
// //                 <td>{uploadedFiles}/{totalFiles} Progress</td>
// //               </tr>
// //               <tr>
// //                 <td>{getStageText(uploadedFiles)}</td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     );
// //   };
  
  
  

// //   return (
// //     <div className="dashboard-container">
     
// //       <h1>User List</h1>
// //       <div className="user-list">
 
// //         {users.map((user) => (
// //           <div key={user.id} className="user-item">
// //             <span>{user.name}</span>
// //             <ProgressBar
// //               uploadedFiles={uploadProgress[user.name]?.uploadedFiles || 0}
// //               totalFiles={uploadProgress[user.name]?.totalFiles || rows.length}
// //             />
// //             <button onClick={() => handleSelectUser(user.name)}>View Documents</button>
// //           </div>
// //         ))}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser}</h2>
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>File</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                         </div>
// //                       ))}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;


// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';

// // const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //   const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;

// //   const getStageText = (uploadedFiles) => {
// //     if (uploadedFiles >= 41) {
// //       return "Stage 4 Completed";
// //     } else if (uploadedFiles >= 31) {
// //       return "Stage 3 Completed";
// //     } else if (uploadedFiles >= 21) {
// //       return "Stage 2 Completed";
// //     } else if (uploadedFiles >= 13) {
// //       return "Stage 1 Completed";
// //     } else {
// //       return `Uploaded ${uploadedFiles} files`;
// //     }
// //   };

// //   return (
// //     <div className="progress-bar">
// //       <div className="progress" style={{ width: `${progress}%` }}>
// //         <table className="progresstable">
// //           <tbody>
// //             <tr>
// //               <td>{uploadedFiles}/{totalFiles} Progress</td>
// //             </tr>
// //             <tr>
// //               <td>{getStageText(uploadedFiles)}</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [selectedUserFiles, setSelectedUserFiles] = useState(0);
// //   const navigate = useNavigate();
// //   const { updateUser } = useUser();


// //   const initialRows = [
// //     { id: 1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
// //     { id: 2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
// //     { id: 7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
// //     { id: 9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
// //     { id: 12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
// //     { id: 13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
// //     { id: 22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
// //     { id: 23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
// //     { id: 26, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
// //     { id: 32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
// //     { id: 33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
// //     { id: 35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
// //     { id: 36, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //     { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
// //     { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
// //     { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
// //     { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
// //     { id: 48, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //   ];
// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleSelectUser = async (event) => {
// //     const selectedUserId = parseInt(event.target.value, 10);
// //     const selectedUser = users.find(user => user.id === selectedUserId);
// //     if (selectedUser) {
// //       setSelectedUser(selectedUser);
// //       const uploadedFiles = selectedUser.uploadedFiles || 0; // Replace with the actual property name for uploaded files count
// //       setSelectedUserFiles(uploadedFiles);
// //       fetchUploads(selectedUser.name);
// //     }
// //   };

// //   const totalFiles = 48; // Total files count for progress calculation

// //   return (
// //     <div className="dashboard-container">
// //       <header className="dashboard-header">
// //         <h1>Welcome, {user && user.name}!</h1>
// //       </header>
// //       <div className="user-list">
// //         <h2>User List</h2>
// //         <select onChange={handleSelectUser} defaultValue="">
// //           <option value="" disabled>Select a user</option>
// //           {users.map((user) => (
// //             <option key={user.id} value={user.id}>{user.name}</option>
// //           ))}
// //         </select>
// //         {selectedUser && (
// //           <div className="user-item">
// //             <ProgressBar uploadedFiles={selectedUserFiles} totalFiles={totalFiles} />
// //           </div>
// //         )}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser.name}</h2>
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>File</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                         </div>
// //                       ))}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;





// //progress bar 


// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';

// // const ProgressBar = ({ uploadedFiles, totalFiles }) => {
// //   const progress = totalFiles === 0 ? 0 : (uploadedFiles / totalFiles) * 100;

// //   const getStageText = (uploadedFiles) => {
// //     if (uploadedFiles >= 41) {
// //       return "Stage 4 Completed";
// //     } else if (uploadedFiles >= 31) {
// //       return "Stage 3 Completed";
// //     } else if (uploadedFiles >= 21) {
// //       return "Stage 2 Completed";
// //     } else if (uploadedFiles >= 13) {
// //       return "Stage 1 Completed";
// //     } else {
// //       return `Uploaded ${uploadedFiles} files`;
// //     }
// //   };

// //   return (
// //     <div className="progress-bar">
// //       <div className="progress" style={{ width: `${progress}%` }}>
// //         <table className="progresstable">
// //           <tbody>
// //             <tr>
// //               <td>{uploadedFiles}/{totalFiles} Progress</td>
// //             </tr>
// //             <tr>
// //               <td>{getStageText(uploadedFiles)}</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
// //   const navigate = useNavigate();
// //   const { updateUser } = useUser();


// //   const initialRows = [
// //     { id: 1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
// //     { id: 2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
// //     { id: 6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
// //     { id: 7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
// //     { id: 9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
// //     { id: 11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
// //     { id: 12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
// //     { id: 13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
// //     { id: 21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
// //     { id: 22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
// //     { id: 23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
// //     { id: 26, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
// //     { id: 32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
// //     { id: 33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
// //     { id: 35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
// //     { id: 36, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //     { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
// //     { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
// //     { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
// //     { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
// //     { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
// //     { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
// //     { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
// //     { id: 48, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
// //   ];
// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);
      
// //       // Count the number of uploaded files
// //       const count = responsesData.data.length;
// //       setUploadedFilesCount(count);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleSelectUser = async (event) => {
// //     const selectedUserId = parseInt(event.target.value, 10);
// //     const user = users.find(user => user.id === selectedUserId);
// //     if (user) {
// //       setSelectedUser(user);
// //       fetchUploads(user.name);
// //     }
// //   };

// //   const totalFiles = 48; // Total files count for progress calculation

// //   return (
// //     <div className="dashboard-container">
// //       <header className="dashboard-header">
// //         <h1>Welcome, {user && user.name}!</h1>
// //       </header>
// //       <div className="user-list">
// //         <h2>User List</h2>
// //         <select onChange={handleSelectUser} defaultValue="">
// //           <option value="" disabled>Select a user</option>
// //           {users.map((user) => (
// //             <option key={user.id} value={user.id}>{user.name}</option>
// //           ))}
// //         </select>
// //         {selectedUser && (
// //           <div className="user-item">
// //             <ProgressBar uploadedFiles={uploadedFilesCount} totalFiles={totalFiles} />
// //           </div>
// //         )}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser.name}</h2>
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>File</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                         </div>
// //                       ))}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;

// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './UserList.css';
// // import { useUser } from './UserContext';


// // const ProgressBar = ({ uploadedFiles }) => {
// //   const totalFiles = 34; // Total files count for progress calculation

// //   // Define stage ranges
// //   const stages = [
// //     { range: [1, 13], label: 'Stage 1 Completed' },
// //     { range: [14, 20], label: 'Stage 2 Completed' },
// //     { range: [21, 26], label: 'Stage 3 Completed' },
// //     { range: [27, 34], label: 'Stage 4 Completed' },
// //   ];

// //   // Determine the maximum completed stage
// //   const completedStage = stages.reduce((maxStage, { range }) => {
// //     if (uploadedFiles >= range[0] && uploadedFiles <= range[1]) {
// //       return range[1];
// //     }
// //     return maxStage;
// //   }, 0);

// //   const progress = totalFiles === 0 ? 0 : (completedStage / totalFiles) * 100;

// //   // Get the stage text based on the completed stage
// //   const getStageText = (completedStage) => {
// //     const stage = stages.find(({ range }) => completedStage >= range[1]);
// //     return stage ? stage.label : `Uploaded ${uploadedFiles} files`;
// //   };

// //   return (
// //     <div className="progress-bar">
// //       <div className="progress" style={{ width: `${progress}%` }}>
// //         <table className="progresstable">
// //           <tbody>
// //             <tr>
// //               <td>{uploadedFiles}/{totalFiles} Progress</td>
// //             </tr>
// //             <tr>
// //               <td>{getStageText(completedStage)}</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // const UserList = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
// //   const navigate = useNavigate();
// //   const { updateUser } = useUser();

//   // const initialRows = [
//   //   { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
//   //   { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
//   //   { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
//   //   { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
//   //   { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
//   //   { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
//   //   { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//   //   { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
//   //   { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//   //   { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//   //   { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
//   //   { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
//   //   { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

//   //   { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
//   //   { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
//   //   { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//   //   { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//   //   { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
//   //   { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
//   //   { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

//   //   { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
//   //   { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
//   //   { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
//   //   { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
//   //   { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
//   //   { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

//   //   { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//   //   { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//   //   { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//   //   { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//   //   { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//   //   { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//   //   { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//   //   { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
//   // ];
// //   const [rows] = useState(initialRows);

// //   const fetchUserData = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const userData = await axios.get('http://localhost:5000/api/user', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setUser(userData.data);
// //       localStorage.setItem('user', JSON.stringify(userData.data));
// //       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //       updateUser(userData.data);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   const fetchUsers = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const usersData = await axios.get('http://localhost:5000/api/users', {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
// //       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

// //       setUsers(filteredUsers);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   }, [navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await fetchUserData();
// //       await fetchUsers();
// //     };
// //     fetchData();
// //   }, [fetchUserData, fetchUsers]);

// //   const fetchUploads = async (userName) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       setResponses(responsesData.data);

// //       // Count the number of uploaded files
// //       const count = responsesData.data.length;
// //       setUploadedFilesCount(count);
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to fetch data. Please try again later.');
// //     }
// //   };

// //   const handleSelectUser = async (event) => {
// //     const selectedUserId = parseInt(event.target.value, 10);
// //     const user = users.find(user => user.id === selectedUserId);
// //     if (user) {
// //       setSelectedUser(user);
// //       fetchUploads(user.name);
// //     }
// //   };

// //   return (
// //     <div className="dashboard-container">
// //       <header className="dashboard-header">
// //         <h1>Welcome, {user && user.name}!</h1>
// //       </header>
// //       <div className="user-list">
// //         <h2>User List</h2>
// //         <select onChange={handleSelectUser} defaultValue="">
// //           <option value="" disabled>Select a user</option>
// //           {users.map((user) => (
// //             <option key={user.id} value={user.id}>{user.name}</option>
// //           ))}
// //         </select>
// //         {selectedUser && (
// //           <div className="user-item">
// //             <ProgressBar uploadedFiles={uploadedFilesCount} />
// //           </div>
// //         )}
// //       </div>
// //       {selectedUser && (
// //         <div className="responses-list">
// //           <h2>Responses for {selectedUser.name}</h2>
// //           {responses.length === 0 ? (
// //             <p>No responses found.</p>
// //           ) : (
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>ID</th>
// //                   <th>Timeline</th>
// //                   <th>Activity</th>
// //                   <th>Deliverables</th>
// //                   <th>Means</th>
// //                   <th>Budget</th>
// //                   <th>File</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row) => (
// //                   <tr key={row.id}>
// //                     <td>{row.id}</td>
// //                     <td>{row.timeline}</td>
// //                     <td>{row.activity}</td>
// //                     <td>{row.deliverables}</td>
// //                     <td>{row.means}</td>
// //                     <td>{row.budget}</td>
// //                     <td>
// //                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
// //                         <div key={index}>
// //                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
// //                         </div>
// //                       ))}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserList;




// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserList.css';
// import { useUser } from './UserContext';


// // const ProgressBar = ({ uploadedFiles }) => {
// //   // Define stage ranges
// //   const stage1Range = [1, 13];
// //   const stage2Range = [14, 20];
// //   const stage3Range = [21, 26];
// //   const stage4Range = [27, 34];

// //   // Function to determine if a stage is completed
// //   const isStageCompleted = (uploadedFiles, range) => {
// //     const [min, max] = range;
// //     return uploadedFiles >= min && uploadedFiles <= max;
// //   };

// //   // Determine completion status for each stage
// //   const stage1Completed = isStageCompleted(uploadedFiles, stage1Range) ? 'Stage 1 Completed' : 'Stage 1 Not Completed';
// //   const stage2Completed = isStageCompleted(uploadedFiles, stage2Range) ? 'Stage 2 Completed' : 'Stage 2 Not Completed';
// //   const stage3Completed = isStageCompleted(uploadedFiles, stage3Range) ? 'Stage 3 Completed' : 'Stage 3 Not Completed';
// //   const stage4Completed = isStageCompleted(uploadedFiles, stage4Range) ? 'Stage 4 Completed' : 'Stage 4 Not Completed';

// //   return (
// //     <div>
// //       <p>{stage1Completed}</p>
// //       <p>{stage2Completed}</p>
// //       <p>{stage3Completed}</p>
// //       <p>{stage4Completed}</p>
// //     </div>
// //   );
// // };


// const isStage1Completed = (uploadedFiles) => {
//   const stage1Range = [1, 13];
//   const [min, max] = stage1Range;
//   return uploadedFiles >= min && uploadedFiles <= max ? 'Stage 1 Completed' : 'Stage 1 Not Completed';
// };

// const isStage2Completed = (uploadedFiles) => {
//   const stage2Range = [14, 20];
//   const [min, max] = stage2Range;
//   return uploadedFiles >= min && uploadedFiles <= max ? 'Stage 2 Completed' : 'Stage 2 Not Completed';
// };

// const isStage3Completed = (uploadedFiles) => {
//   const stage3Range = [21, 26];
//   const [min, max] = stage3Range;
//   return uploadedFiles >= min && uploadedFiles <= max ? 'Stage 3 Completed' : 'Stage 3 Not Completed';
// };

// const isStage4Completed = (uploadedFiles) => {
//   const stage4Range = [27, 34];
//   const [min, max] = stage4Range;
//   return uploadedFiles >= min && uploadedFiles <= max ? 'Stage 4 Completed' : 'Stage 4 Not Completed';
// };

// const ProgressBar = ({ uploadedFiles }) => {
//   return (
//     <div>
//       <p>{isStage1Completed(uploadedFiles)}</p>
//       <p>{isStage2Completed(uploadedFiles)}</p>
//       <p>{isStage3Completed(uploadedFiles)}</p>
//       <p>{isStage4Completed(uploadedFiles)}</p>
//     </div>
//   );
// };

// const UserList = () => {
//   const [responses, setResponses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
//   const navigate = useNavigate();
//   const { updateUser } = useUser();

  // const initialRows = [
  //   { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
  //   { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
  //   { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
  //   { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
  //   { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
  //   { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
  //   { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

  //   { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
  //   { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
  //   { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
  //   { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

  //   { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
  //   { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
  //   { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
  //   { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
  //   { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

  //   { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
  //   { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
  //   { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
  //   { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
  //   { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
  // ];
//   const [rows] = useState(initialRows);

//   const fetchUserData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const userData = await axios.get('http://localhost:5000/api/user', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUser(userData.data);
//       localStorage.setItem('user', JSON.stringify(userData.data));
//       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//       updateUser(userData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const usersData = await axios.get('http://localhost:5000/api/users', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
//       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUserData();
//       await fetchUsers();
//     };
//     fetchData();
//   }, [fetchUserData, fetchUsers]);

//   const fetchUploads = async (userName) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);

//       // Count the number of uploaded files
//       const count = responsesData.data.length;
//       setUploadedFilesCount(count);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleSelectUser = async (event) => {
//     const selectedUserId = parseInt(event.target.value, 10);
//     const user = users.find(user => user.id === selectedUserId);
//     if (user) {
//       setSelectedUser(user);
//       fetchUploads(user.name);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Welcome, {user && user.name}!</h1>
//       </header>
//       <div className="user-list">
//         <h2>User List</h2>
//         <select onChange={handleSelectUser} defaultValue="">
//           <option value="" disabled>Select a user</option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>{user.name}</option>
//           ))}
//         </select>
//         {selectedUser && (
//           <div className="user-item">
//             <ProgressBar uploadedFiles={uploadedFilesCount} />
//           </div>
//         )}
//       </div>
//       {selectedUser && (
//         <div className="responses-list">
//           <h2>Responses for {selectedUser.name}</h2>
//           {responses.length === 0 ? (
//             <p>No responses found.</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Timeline</th>
//                   <th>Activity</th>
//                   <th>Deliverables</th>
//                   <th>Means</th>
//                   <th>Budget</th>
//                   <th>File</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row) => (
//                   <tr key={row.id}>
//                     <td>{row.id}</td>
//                     <td>{row.timeline}</td>
//                     <td>{row.activity}</td>
//                     <td>{row.deliverables}</td>
//                     <td>{row.means}</td>
//                     <td>{row.budget}</td>
//                     <td>
//                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
//                         <div key={index}>
//                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
//                         </div>
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;





// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserList.css';
// import { useUser } from './UserContext';
// import ProgressBar from './ProgressBar';

// const UserList = () => {
//   const [responses, setResponses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [uploadedFilesCount, setUploadedFilesCount] = useState([]); // Set as an array initially
//   const navigate = useNavigate();
//   const { updateUser } = useUser();

//   const initialRows = [
//     { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
//     { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
//     { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
//     { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
//     { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
//     { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

//     { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
//     { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
//     { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
//     { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

//     { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
//     { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
//     { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
//     { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
//     { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

//     { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//     { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//     { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//     { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//     { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
//   ];
//   const [rows] = useState(initialRows);

//   const fetchUserData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const userData = await axios.get('http://localhost:5000/api/user', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUser(userData.data);
//       localStorage.setItem('user', JSON.stringify(userData.data));
//       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//       updateUser(userData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const usersData = await axios.get('http://localhost:5000/api/users', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
//       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUserData();
//       await fetchUsers();
//     };
//     fetchData();
//   }, [fetchUserData, fetchUsers]);

//   const fetchUploads = async (userName) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);

//       // Set uploadedFilesCount as an array of response objects
//       setUploadedFilesCount(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleSelectUser = async (event) => {
//     const selectedUserId = parseInt(event.target.value, 10);
//     const user = users.find(user => user.id === selectedUserId);
//     if (user) {
//       setSelectedUser(user);
//       fetchUploads(user.name);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Welcome, {user && user.name}!</h1>
//       </header>
//       <div className="user-list">
//         <h2>User List</h2>
//         <select onChange={handleSelectUser} defaultValue="">
//           <option value="" disabled>Select a user</option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>{user.name}</option>
//           ))}
//         </select>
//         {selectedUser && (
//           <div className="user-item">
//             <ProgressBar uploadedFiles={uploadedFilesCount} />
//           </div>
//         )}
//       </div>
//       {selectedUser && (
//         <div className="responses-list">
//           <h2>Responses for {selectedUser.name}</h2>
//           {responses.length === 0 ? (
//             <p>No responses found.</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Timeline</th>
//                   <th>Activity</th>
//                   <th>Deliverables</th>
//                   <th>Means</th>
//                   <th>Budget</th>
//                   <th>File</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row) => (
//                   <tr key={row.id}>
//                     <td>{row.id}</td>
//                     <td>{row.timeline}</td>
//                     <td>{row.activity}</td>
//                     <td>{row.deliverables}</td>
//                     <td>{row.means}</td>
//                     <td>{row.budget}</td>
//                     <td>
//                       {responses.filter(response => response.rowId === row.id).map((response, index) => (
//                         <div key={index}>
//                           <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
//                         </div>
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;






// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserList.css';
// import { useUser } from './UserContext';
// import ProgressBar from './ProgressBar';

// const UserList = () => {
//   const [responses, setResponses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [uploadedFilesCount, setUploadedFilesCount] = useState([]);
//   const navigate = useNavigate();
//   const { updateUser } = useUser();

  // const initialRows = [
  //   { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
  //   { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
  //   { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
  //   { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
  //   { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
  //   { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
  //   { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

  //   { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
  //   { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
  //   { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
  //   { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

  //   { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
  //   { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
  //   { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
  //   { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
  //   { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

  //   { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
  //   { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
  //   { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
  //   { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
  //   { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
  // ];
//   const [rows] = useState(initialRows);

//   const fetchUserData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const userData = await axios.get('http://localhost:5000/api/user', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUser(userData.data);
//       localStorage.setItem('user', JSON.stringify(userData.data));
//       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//       updateUser(userData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const usersData = await axios.get('http://localhost:5000/api/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
//       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUserData();
//       await fetchUsers();
//     };
//     fetchData();
//   }, [fetchUserData, fetchUsers]);

//   const fetchUploads = async (userName) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResponses(responsesData.data);
//       setUploadedFilesCount(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleSelectUser = async (event) => {
//     const selectedUserId = parseInt(event.target.value, 10);
//     const user = users.find(user => user.id === selectedUserId);
//     if (user) {
//       setSelectedUser(user);
//       fetchUploads(user.name);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Welcome, {user && user.name}!</h1>
//       </header>
//       <div className="user-list">
//         <h2>User List</h2>
//         <div className="user-circles">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className={`user-circle ${selectedUser?.id === user.id ? 'selected' : ''}`}
//               onClick={() => handleSelectUser({ target: { value: user.id } })}
//             >
//               {user.name}
//             </div>
//           ))}
//         </div>
//         {selectedUser && (
//           <div className="user-details">
//             <ProgressBar uploadedFiles={uploadedFilesCount} />
//             <div className="responses-list">
//               <h2>Responses for {selectedUser.name}</h2>
//               {responses.length === 0 ? (
//                 <p>No responses found.</p>
//               ) : (
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Timeline</th>
//                       <th>Activity</th>
//                       <th>Deliverables</th>
//                       <th>Means</th>
//                       <th>Budget</th>
//                       <th>File</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row) => (
//                       <tr key={row.id}>
//                         <td>{row.id}</td>
//                         <td>{row.timeline}</td>
//                         <td>{row.activity}</td>
//                         <td>{row.deliverables}</td>
//                         <td>{row.means}</td>
//                         <td>{row.budget}</td>
//                         <td>
//                           {responses.filter(response => response.rowId === row.id).map((response, index) => (
//                             <div key={index}>
//                               <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
//                             </div>
//                           ))}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserList;






// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserList.css';
// import { useUser } from './UserContext';
// import ProgressBar from './ProgressBar';

// const UserList = () => {
//   const [responses, setResponses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [uploadedFilesCount, setUploadedFilesCount] = useState([]);
//   const navigate = useNavigate();
//   const { updateUser } = useUser();
 
//   const initialRows = [
//     { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
//     { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
//     { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
//     { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
//     { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
//     { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
//     { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
//     { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
//     { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

//     { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
//     { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
//     { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
//     { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

//     { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
//     { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
//     { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
//     { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
//     { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

//     { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//     { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//     { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//     { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//     { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
//   ];
//   const [rows] = useState(initialRows);

//   const fetchUserData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const userData = await axios.get('http://localhost:5000/api/user', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUser(userData.data);
//       localStorage.setItem('user', JSON.stringify(userData.data));
//       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//       updateUser(userData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const usersData = await axios.get('http://localhost:5000/api/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
//       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUserData();
//       await fetchUsers();
//     };
//     fetchData();
//   }, [fetchUserData, fetchUsers]);

//   const fetchUploads = async (userName) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResponses(responsesData.data);
//       setUploadedFilesCount(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleSelectUser = async (event) => {
//     const selectedUserId = parseInt(event.target.value, 10);
//     const user = users.find(user => user.id === selectedUserId);
//     if (user) {
//       setSelectedUser(user);
//       fetchUploads(user.name);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Welcome, {user && user.name}!</h1>
//       </header>
//       <div className="user-list">
//         <h2>User List</h2>
        
//         <div className="user-rectangle">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className={`user-rectangle small ${selectedUser?.id === user.id ? 'selected' : ''}`}
//               onClick={() => handleSelectUser({ target: { value: user.id } })}
//             >
//               <div className="user-rectangle medium">
//                 <div className="user-rectangle large">
//                   <span>{uploadedFilesCount.length === 0 ? 'Not Uploaded' : 'File Uploaded'}</span>
                  
//                 </div>
//                 <span>{user.name}</span>
               
//               </div>
//             </div>
//           ))}
//         </div>
//         {selectedUser && (
//           <div className="user-details">
//             <ProgressBar uploadedFiles={uploadedFilesCount} />
//             <div className="responses-list">
//               <h2>Responses for {selectedUser.name}</h2>
//               {responses.length === 0 ? (
//                 <p>No responses found.</p>
//               ) : (
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Timeline</th>
//                       <th>Activity</th>
//                       <th>Deliverables</th>
//                       <th>Means</th>
//                       <th>Budget</th>
//                       <th>File</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row) => (
//                       <tr key={row.id}>
//                         <td>{row.id}</td>
//                         <td>{row.timeline}</td>
//                         <td>{row.activity}</td>
//                         <td>{row.deliverables}</td>
//                         <td>{row.means}</td>
//                         <td>{row.budget}</td>
//                         <td>
//                           {responses.filter(response => response.rowId === row.id).map((response, index) => (
//                             <div key={index}>
//                               <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
//                             </div>
//                           ))}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserList;






// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserList.css';
// import { useUser } from './UserContext';
// import ProgressBar from './ProgressBar';

// const UserList = () => {
//   const [responses, setResponses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [uploadedFilesCount, setUploadedFilesCount] = useState({});
//   const navigate = useNavigate();
//   const { updateUser } = useUser();
  // const initialRows = [
  //   { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
  //   { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
  //   { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
  //   { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
  //   { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
  //   { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
  //   { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
  //   { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
  //   { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

  //   { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
  //   { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
  //   { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
  //   { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

  //   { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
  //   { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
  //   { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
  //   { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
  //   { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

  //   { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
  //   { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
  //   { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
  //   { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
  //   { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
  //   { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
  //   { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
  //   { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
  // ];
//   const [rows] = useState(initialRows);

//   const fetchUserData = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const userData = await axios.get('http://localhost:5000/api/user', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUser(userData.data);
//       localStorage.setItem('user', JSON.stringify(userData.data));
//       localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//       updateUser(userData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   const fetchUsers = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const usersData = await axios.get('http://localhost:5000/api/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
//       const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUserData();
//       await fetchUsers();
//     };
//     fetchData();
//   }, [fetchUserData, fetchUsers]);

//   const fetchUploads = async (userName) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResponses(responsesData.data);
//       setUploadedFilesCount(prev => ({ ...prev, [userName]: responsesData.data }));
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleSelectUser = async (user) => {
//     setSelectedUser(user);
//     fetchUploads(user.name);
//   };

//   useEffect(() => {
//     // Fetch uploaded files count for all users initially
//     users.forEach(user => {
//       fetchUploads(user.name);
//     });
//   }, [users]);

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Welcome, {user && user.name}!</h1>
//       </header>

//       <div className="user-list">
//         <h2>User List</h2>
//         <table className='userprogress'>
//           <tbody>
//             {users.map((user) => (
//               <tr
//                 key={user.id}
//                 className={`user-row ${selectedUser?.id === user.id ? 'selected' : ''}`}
//                 onClick={() => handleSelectUser(user)}
//               >
//                 <td className='userrr' >{user.name}</td>
//                 <td>
//                   <ProgressBar uploadedFiles={uploadedFilesCount[user.name] || []} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedUser && (
//         <div className="user-details">
//           <div className="responses-list">
//             <h2>Responses for {selectedUser.name}</h2>
//             {responses.length === 0 ? (
//               <p>No responses found.</p>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Timeline</th>
//                     <th>Activity</th>
//                     <th>Deliverables</th>
//                     <th>Means</th>
//                     <th>Budget</th>
//                     <th>File</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((row) => (
//                     <tr key={row.id}>
//                       <td>{row.id}</td>
//                       <td>{row.timeline}</td>
//                       <td>{row.activity}</td>
//                       <td>{row.deliverables}</td>
//                       <td>{row.means}</td>
//                       <td>{row.budget}</td>
//                       <td>
//                         {responses.filter(response => response.rowId === row.id).map((response, index) => (
//                           <div key={index}>
//                             <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
//                           </div>
//                         ))}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;


import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserList.css';
import { useUser } from './UserContext';
import ProgressBar from './ProgressBar';

const UserList = () => {
  const [responses, setResponses] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [uploadedFilesCount, setUploadedFilesCount] = useState({});
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const initialRows = [
    { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
    { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
    { id :7, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },
    { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
    { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
    { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
    { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
    { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
    { id :13, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '125000' },

    { id:14, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
    { id:15, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
    { id:16, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
    { id:17, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
    { id:18, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
    { id:19, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:20, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

    { id:21, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
    { id:22, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
    { id:23, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:24, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
    { id:25, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
    { id:26, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },

    { id:27, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
    { id:28, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
    { id:29, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
    { id:30, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
    { id:31, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
    { id:32, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:33, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
    { id:34, timeline: '', activity: '', deliverables: '', means: 'Invoice', budget: '250000' },
  ];
  const [rows] = useState(initialRows);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const userData = await axios.get('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userData.data);
      localStorage.setItem('user', JSON.stringify(userData.data));
      localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
      updateUser(userData.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data. Please try again later.');
    }
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const usersData = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userIDs = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
      const filteredUsers = usersData.data.filter(user => userIDs.includes(user.id));

      setUsers(filteredUsers);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data. Please try again later.');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchUsers();
    };
    fetchData();
  }, [fetchUserData, fetchUsers]);

  const fetchUploads = async (userName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const responsesData = await axios.get(`http://localhost:5000/api/responses/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponses(responsesData.data);
      setUploadedFilesCount(prev => ({ ...prev, [userName]: responsesData.data }));
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  // const handleSelectUser = async (user) => {
  //   setSelectedUser(user);
  //   fetchUploads(user.name);
  // };

  const handleSelectUser = async (user) => {
    if (selectedUser?.id === user.id) {
      // If the clicked user is already selected, deselect it
      setSelectedUser(null);
    } else {
      // Otherwise, select the new user and fetch their uploads
      setSelectedUser(user);
      fetchUploads(user.name);
    }
  };

  useEffect(() => {
    // Fetch uploaded files count for all users initially
    users.forEach(user => {
      fetchUploads(user.name);
    });
  }, [users]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user && user.name}!</h1>
      </header>

      <div className="user-list">
        <h2>User List</h2>
        <table className='userprogress'>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`user-row ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <td className='nameuser' >{user.name}</td>
                <td className='userprogress'>
                  <ProgressBar uploadedFiles={uploadedFilesCount[user.name] || []} />
                </td>
                <td className='usertable'>
                  {selectedUser?.id === user.id && responses.length > 0 && (
                    <div className="responses-list">
                      <h3>Responses</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Timeline</th>
                            <th>Activity</th>
                            <th>Deliverables</th>
                            <th>Means</th>
                            <th>Budget</th>
                            <th>File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.timeline}</td>
                              <td>{row.activity}</td>
                              <td>{row.deliverables}</td>
                              <td>{row.means}</td>
                              <td>{row.budget}</td>
                              <td>
                                {responses.filter(response => response.rowId === row.id).map((response, index) => (
                                  <div key={index}>
                                    <p>File: <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">{response.fileName}</a></p>
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
