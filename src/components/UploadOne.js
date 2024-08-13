// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './Dashboard.css';
// // import { useUser } from './UserContext';

// // const Uploadexport = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         navigate('/login');
// //         return;
// //       }
// //       try {
// //         const [responsesData, userData] = await Promise.all([
// //           axios.get('http://localhost:5000/api/responses', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //           axios.get('http://localhost:5000/api/user', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //         ]);

// //         setResponses(responsesData.data);
// //         setUser(userData.data);
// //         localStorage.setItem('user', JSON.stringify(userData.data));
// //         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //         updateUser(userData.data);
// //       } catch (error) {
// //         console.error(error);
// //         setError('Failed to fetch data. Please try again later.');
// //       }
// //     };

// //     fetchData();
// //   }, [navigate, updateUser]);

 

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

// //   const fetchUploads = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get('http://localhost:5000/api/responses', {
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
// //       const updatedResponses = responses.map((item) => {
// //         if (item.rowId === id) {
// //           return {
// //             ...item,
// //             file: response.data.file,
// //             fileName: fileName,
// //           };
// //         }
// //         return item;
// //       });
// //       setResponses(updatedResponses);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   const handleFileDelete = async (rowId, fileId, fileName) => {
// //     const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
// //     if (!confirmation) {
// //       return;
// //     }

// //     const token = localStorage.getItem('token');

// //     try {
// //       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         alert('File deleted successfully.');
// //         const updatedResponses = responses.filter((response) => response.id !== fileId);
// //         setResponses(updatedResponses);
// //         setFiles((prevFiles) => {
// //           const newFiles = { ...prevFiles };
// //           if (newFiles[rowId]) {
// //             newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
// //           }
// //           return newFiles;
// //         });
// //         setFileNames((prevFileNames) => {
// //           const newFileNames = { ...prevFileNames };
// //           delete newFileNames[fileId];
// //           return newFileNames;
// //         });

// //         fetchUploads();
// //       } else {
// //         setError(response.data.message);
// //       }
// //     } catch (error) {
// //       if (error.response) {
// //         console.error('Error response:', error.response.data);
// //         console.error('Error status:', error.response.status);
// //         console.error('Error headers:', error.response.headers);
// //       } else if (error.request) {
// //         console.error('Error request:', error.request);
// //       } else {
// //         console.error('Error message:', error.message);
// //       }
// //       setError('Failed to delete file. Please try again later.');
// //     }
// //   };

// //   const handleAddMore = (id) => {
// //     setEditingRow(id);
// //   };

// //   const handleDownloadAll = async () => {
// //     const token = localStorage.getItem('token');
// //     try {
// //       const fileUrls = responses
// //         .filter((response) => response.file)
// //         .map((response) => ({
// //           url: `http://localhost:5000/uploads/${response.file}`,
// //           name: response.fileName || response.file,
// //         }));

// //       for (const { url, name } of fileUrls) {
// //         const response = await fetch(url, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         const blob = await response.blob();
// //         const link = document.createElement('a');
// //         const urlObject = URL.createObjectURL(blob);
// //         link.href = urlObject;
// //         link.setAttribute('download', name);
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //         URL.revokeObjectURL(urlObject);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to download files. Please try again later.');
// //     }
// //   };
  
  

// //   const rows = [
// //    { id : 99997 }, { id : 99998 }, { id : 99999 }, { id : 100000 }, { id : 100001 }, { id : 100002 }, { id : 100003 }, 
// //    { id : 100004 }, { id : 100005 }, { id : 100006 }, { id : 100007 }, { id : 100008 }, { id : 100009 }, { id : 100010 }, 
// //    { id : 100011 }, { id : 100012 }, { id : 100013 }, { id : 100014 }, { id : 100015 }, { id : 100016 }, { id : 100017 }, 
// //    { id : 100018 }, { id : 100019 }, { id : 100020 }, { id : 100021 }, { id : 100022 }, { id : 100023 }, { id : 100024 }, 
// //    { id : 100025 }, { id : 100026 }, { id : 100027 }, { id : 100028 }, { id : 100029 }, { id : 100030 }, { id : 100031 }, 
// //    { id : 100032 }, { id : 100033 }, { id : 100034 }, { id : 100035 }, { id : 100036 }, { id : 100037 }, { id : 100038 }, 
// //    { id : 100039 }, { id : 100040 }, { id : 100041 }, { id : 100042 }, { id : 100043 }, { id : 100044 }, { id : 100045 }, 
// //    { id : 100046 }, { id : 100047 }, { id : 100048 }, { id : 100049 }, { id : 100050 }, { id : 100051 }, { id : 100052 }, 
// //    { id : 100053 }, { id : 100054 }, { id : 100055 }, { id : 100056 }, { id : 100057 }, { id : 100058 }, { id : 100059 }, 
// //    { id : 100060 }, { id : 100061 }, { id : 100062 }, { id : 100063 }, { id : 100064 }, { id : 100065 }, { id : 100066 }, 
// //    { id : 100067 }, { id : 100068 }, { id : 100069 }, { id : 100070 }, { id : 100071 }, { id : 100072 }, { id : 100073 }, 
// //    { id : 100074 }, { id : 100075 }, { id : 100076 }, { id : 100077 }, { id : 100078 }, { id : 100079 }, { id : 100080 }, 
// //    { id : 100081 }, { id : 100082 }, { id : 100083 }, { id : 100084 }, { id : 100085 }, { id : 100086 }, { id : 100087 }, 
// //    { id : 100088 }, { id : 100089 }, { id : 100090 }, { id : 100091 }, { id : 100092 }, { id : 100093 }, { id : 100094 }, 
// //    { id : 100095 }, { id : 100096 }, { id : 100097 }, { id : 100098 }, { id : 100099 }, { id : 100100 }, { id : 100101 }, 
// //    { id : 100102 }, { id : 100103 }, { id : 100104 }, { id : 100105 }, { id : 100106 }, { id : 100107 }, { id : 100108 }, 
// //    { id : 100109 }, { id : 100110 }, { id : 100111 }, { id : 100112 }, { id : 100113 }, { id : 100114 }, { id : 100115 }, 
// //    { id : 100116 }, { id : 100117 }, { id : 100118 }, { id : 100119 }, { id : 100120 }, { id : 100121 }, { id : 100122 }, 
// //    { id : 100123 }, { id : 100124 }, { id : 100125 }, { id : 100126 }, { id : 100127 }, { id : 100128 }, { id : 100129 }, 
// //    { id : 100130 }, { id : 100131 }, { id : 100132 }, { id : 100133 }, { id : 100134 }, { id : 100135 }, { id : 100136 }, 
// //    { id : 100137 }, { id : 100138 }, { id : 100139 }, { id : 100140 }, { id : 100141 }, { id : 100142 }, { id : 100143 }, 
// //    { id : 100144 }, { id : 100145 }, { id : 100146 }, { id : 100147 }, { id : 100148 }, { id : 100149 }, { id : 100150 }, 
// //    { id : 100151 }, { id : 100152 }, { id : 100153 }, { id : 100154 }, { id : 100155 }, { id : 100156 }, { id : 100157 }, 
// //    { id : 100158 }, { id : 100159 }, { id : 100160 }, { id : 100161 }, { id : 100162 }, { id : 100163 }, { id : 100164 }, 
// //    { id : 100165 }, { id : 100166 }, { id : 100167 }, { id : 100168 }, { id : 100169 }, { id : 100170 }, { id : 100171 }, 
// //    { id : 100172 }, { id : 100173 }, { id : 100174 }, { id : 100175 }, { id : 100176 }, { id : 100177 }, { id : 100178 }, 
// //    { id : 100179 }, { id : 100180 }, { id : 100181 }, { id : 100182 }, { id : 100183 }, { id : 100184 }, { id : 100185 }, 
// //    { id : 100186 }, { id : 100187 }, { id : 100188 }, { id : 100189 }, { id : 100190 }, { id : 100191 }, { id : 100192 }, 
// //    { id : 100193 }, { id : 100194 }, { id : 100195 }, { id : 100196 },

// //   ];

// //   return (
// //     <div className="Content-container">
// //       {user && <p>Welcome, {user.name}</p>}
// //       {/* <button onClick={handleLogout}>Logout</button> */}

// //       <h1>FPO ALL STAGES</h1>
// //       {error && <p>{error}</p>}
// //       <button onClick={handleDownloadAll}>Download All Files</button>
// //       <table>
// //         <thead>
// //           <tr>
// //             {/* <th>Timeline</th>
// //             <th>Activity</th>
// //             <th>Deliverables</th>
// //             <th>Means of Verification</th>
// //             <th>Budget</th> */}
// //             <th>Upload Files</th>
// //             {/* <th>File and Date</th> */}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((row) => (
// //             <tr key={row.id}>
// //               {/* <td>{row.timeline}</td>
// //               <td>{row.activity}</td>
// //               <td>{row.deliverables}</td>
// //               <td>{row.means}</td>
// //               <td>{row.budget}</td> */}
// //               <td>
// //                 {responses.filter((response) => response.rowId === row.id).map((response) => (
// //                   <div key={response.id}>
// //                     <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
// //                       {response.fileName || response.file}
// //                     </a>
// //                     <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>Delete</button>
// //                   </div>
// //                 ))}
// //                 <button onClick={() => handleAddMore(row.id)}>Add file</button>
// //                 {editingRow === row.id && (
// //                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter file name"
// //                       value={fileNames[row.id] || ''}
// //                       onChange={(e) => handleFileNameChange(e, row.id)}
// //                       ref={(el) => (fileInputRefs.current[row.id] = el)}
// //                     />
// //                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
// //                     <button type="submit">Upload</button>
// //                   </form>
// //                 )}
// //               </td>
// //               {/* <td>{new Date().toLocaleString()}</td> */}
// //             </tr>
// //           ))}
// //         </tbody>





// //       </table>
// //     </div>
// //   );
// // };

// // export default Uploadexport;








// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './Dashboard.css';
// // import { useUser } from './UserContext';

// // const Uploadexport = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         navigate('/login');
// //         return;
// //       }
// //       try {
// //         const [responsesData, userData] = await Promise.all([
// //           axios.get('http://localhost:5000/api/responses', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //           axios.get('http://localhost:5000/api/user', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //         ]);

// //         setResponses(responsesData.data);
// //         setUser(userData.data);
// //         localStorage.setItem('user', JSON.stringify(userData.data));
// //         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //         updateUser(userData.data);
// //       } catch (error) {
// //         console.error(error);
// //         setError('Failed to fetch data. Please try again later.');
// //       }
// //     };

// //     fetchData();
// //   }, [navigate, updateUser]);

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

// //   const fetchUploads = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get('http://localhost:5000/api/responses', {
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
// //       const updatedResponses = responses.map((item) => {
// //         if (item.rowId === id) {
// //           return {
// //             ...item,
// //             file: response.data.file,
// //             fileName: fileName,
// //           };
// //         }
// //         return item;
// //       });
// //       setResponses(updatedResponses);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   const handleFileDelete = async (rowId, fileId, fileName) => {
// //     const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
// //     if (!confirmation) {
// //       return;
// //     }

// //     const token = localStorage.getItem('token');

// //     try {
// //       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         alert('File deleted successfully.');
// //         const updatedResponses = responses.filter((response) => response.id !== fileId);
// //         setResponses(updatedResponses);
// //         setFiles((prevFiles) => {
// //           const newFiles = { ...prevFiles };
// //           if (newFiles[rowId]) {
// //             newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
// //           }
// //           return newFiles;
// //         });
// //         setFileNames((prevFileNames) => {
// //           const newFileNames = { ...prevFileNames };
// //           delete newFileNames[fileId];
// //           return newFileNames;
// //         });

// //         fetchUploads();
// //       } else {
// //         setError(response.data.message);
// //       }
// //     } catch (error) {
// //       if (error.response) {
// //         console.error('Error response:', error.response.data);
// //         console.error('Error status:', error.response.status);
// //         console.error('Error headers:', error.response.headers);
// //       } else if (error.request) {
// //         console.error('Error request:', error.request);
// //       } else {
// //         console.error('Error message:', error.message);
// //       }
// //       setError('Failed to delete file. Please try again later.');
// //     }
// //   };

// //   const handleAddMore = (id) => {
// //     setEditingRow(id);
// //   };

// //   const handleDownloadAll = async () => {
// //     const token = localStorage.getItem('token');
// //     try {
// //       const fileUrls = responses
// //         .filter((response) => response.file && rows.some(row => row.id === response.rowId))
// //         .map((response) => ({
// //           url: `http://localhost:5000/uploads/${response.file}`,
// //           name: response.fileName || response.file,
// //         }));

// //       for (const { url, name } of fileUrls) {
// //         const response = await fetch(url, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         const blob = await response.blob();
// //         const link = document.createElement('a');
// //         const urlObject = URL.createObjectURL(blob);
// //         link.href = urlObject;
// //         link.setAttribute('download', name);
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //         URL.revokeObjectURL(urlObject);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to download files. Please try again later.');
// //     }
// //   };

// //   const rows = [
// //     { id: 99997 }, { id: 99998 }, { id: 99999 }, { id: 100000 }, { id: 100001 }, { id: 100002 }, { id: 100003 },
// //     { id: 100004 }, { id: 100005 }, { id: 100006 }, { id: 100007 }, { id: 100008 }, { id: 100009 }, { id: 100010 },
// //     { id: 100011 }, { id: 100012 }, { id: 100013 }, { id: 100014 }, { id: 100015 }, { id: 100016 }, { id: 100017 },
// //     { id: 100018 }, { id: 100019 }, { id: 100020 }, { id: 100021 }, { id: 100022 }, { id: 100023 }, { id: 100024 },
// //     { id: 100025 }, { id: 100026 }, { id: 100027 }, { id: 100028 }, { id: 100029 }, { id: 100030 }, { id: 100031 },
// //     { id: 100032 }, { id: 100033 }, { id: 100034 }, { id: 100035 }, { id: 100036 }, { id: 100037 }, { id: 100038 },
// //     { id: 100039 }, { id: 100040 }, { id: 100041 }, { id: 100042 }, { id: 100043 }, { id: 100044 }, { id: 100045 },
// //     { id: 100046 }, { id: 100047 }, { id: 100048 }, { id: 100049 }, { id: 100050 }, { id: 100051 }, { id: 100052 },
// //     { id: 100053 }, { id: 100054 }, { id: 100055 }, { id: 100056 }, { id: 100057 }, { id: 100058 }, { id: 100059 },
// //     { id: 100060 }, { id: 100061 }, { id: 100062 }, { id: 100063 }, { id: 100064 }, { id: 100065 }, { id: 100066 },
// //     { id: 100067 }, { id: 100068 }, { id: 100069 }, { id: 100070 }, { id: 100071 }, { id: 100072 }, { id: 100073 },
// //     { id: 100074 }, { id: 100075 }, { id: 100076 }, { id: 100077 }, { id: 100078 }, { id: 100079 }, { id: 100080 },
// //     { id: 100081 }, { id: 100082 }, { id: 100083 }, { id: 100084 }, { id: 100085 }, { id: 100086 }, { id: 100087 },
// //     { id: 100088 }, { id: 100089 }, { id: 100090 }, { id: 100091 }, { id: 100092 }, { id: 100093 }, { id: 100094 },
// //     { id: 100095 }, { id: 100096 }, { id: 100097 }, { id: 100098 }, { id: 100099 }, { id: 100100 }, { id: 100101 },
// //     { id: 100102 }, { id: 100103 }, { id: 100104 }, { id: 100105 }, { id: 100106 }, { id: 100107 }, { id: 100108 },
// //     { id: 100109 }, { id: 100110 }, { id: 100111 }, { id: 100112 }, { id: 100113 }, { id: 100114 }, { id: 100115 },
// //     { id: 100116 }, { id: 100117 }, { id: 100118 }, { id: 100119 }, { id: 100120 }, { id: 100121 }, { id: 100122 },
// //     { id: 100123 }, { id: 100124 }, { id: 100125 }, { id: 100126 }, { id: 100127 }, { id: 100128 }, { id: 100129 },
// //     { id: 100130 }, { id: 100131 }, { id: 100132 }, { id: 100133 }, { id: 100134 }, { id: 100135 }, { id: 100136 },
// //     { id: 100137 }, { id: 100138 }, { id: 100139 }, { id: 100140 }, { id: 100141 }, { id: 100142 }, { id: 100143 },
// //     { id: 100144 }, { id: 100145 }, { id: 100146 }, { id: 100147 }, { id: 100148 }, { id: 100149 }, { id: 100150 },
// //     { id: 100151 }, { id: 100152 }, { id: 100153 }, { id: 100154 }, { id: 100155 }, { id: 100156 }, { id: 100157 },
// //     { id: 100158 }, { id: 100159 }, { id: 100160 }, { id: 100161 }, { id: 100162 }, { id: 100163 }, { id: 100164 },
// //     { id: 100165 }, { id: 100166 }, { id: 100167 }, { id: 100168 }, { id: 100169 }, { id: 100170 }, { id: 100171 },
// //     { id: 100172 }, { id: 100173 }, { id: 100174 }, { id: 100175 }, { id: 100176 }, { id: 100177 }, { id: 100178 },
// //     { id: 100179 }, { id: 100180 }, { id: 100181 }, { id: 100182 }, { id: 100183 }, { id: 100184 }, { id: 100185 },
// //     { id: 100186 }, { id: 100187 }, { id: 100188 }, { id: 100189 }, { id: 100190 }, { id: 100191 }, { id: 100192 },
// //     { id: 100193 }, { id: 100194 }, { id: 100195 }, { id: 100196 },

// //   ];

// //   return (
// //     <div className="Content-container">
// //       {user && <p>Welcome, {user.name}</p>}

// //       <h1>FPO ALL STAGES</h1>
// //       {error && <p>{error}</p>}
// //       <button onClick={handleDownloadAll}>Download All Files</button>
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>Upload Files</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((row) => (
// //             <tr key={row.id}>
// //               <td>
// //                 {responses.filter((response) => response.rowId === row.id).map((response) => (
// //                   <div key={response.id}>
// //                     <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
// //                       {response.fileName || response.file}
// //                     </a>
// //                     <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>Delete</button>
// //                   </div>
// //                 ))}
// //                 <button onClick={() => handleAddMore(row.id)}>Add file</button>
// //                 {editingRow === row.id && (
// //                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter file name"
// //                       value={fileNames[row.id] || ''}
// //                       onChange={(e) => handleFileNameChange(e, row.id)}
// //                       ref={(el) => (fileInputRefs.current[row.id] = el)}
// //                     />
// //                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
// //                     <button type="submit">Upload</button>
// //                   </form>
// //                 )}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Uploadexport;




// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './Dashboard.css';
// // import { useUser } from './UserContext';

// // const Uploadexport = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [totalRows, setTotalRows] = useState(200); // Change this value to set the desired number of rows
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         navigate('/login');
// //         return;
// //       }
// //       try {
// //         const [responsesData, userData] = await Promise.all([
// //           axios.get('http://localhost:5000/api/responses', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //           axios.get('http://localhost:5000/api/user', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //         ]);

// //         setResponses(responsesData.data);
// //         setUser(userData.data);
// //         localStorage.setItem('user', JSON.stringify(userData.data));
// //         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //         updateUser(userData.data);
// //       } catch (error) {
// //         console.error(error);
// //         setError('Failed to fetch data. Please try again later.');
// //       }
// //     };

// //     fetchData();
// //   }, [navigate, updateUser]);

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

// //   const fetchUploads = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get('http://localhost:5000/api/responses', {
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
// //       const updatedResponses = responses.map((item) => {
// //         if (item.rowId === id) {
// //           return {
// //             ...item,
// //             file: response.data.file,
// //             fileName: fileName,
// //           };
// //         }
// //         return item;
// //       });
// //       setResponses(updatedResponses);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   const handleFileDelete = async (rowId, fileId, fileName) => {
// //     const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
// //     if (!confirmation) {
// //       return;
// //     }

// //     const token = localStorage.getItem('token');

// //     try {
// //       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         alert('File deleted successfully.');
// //         const updatedResponses = responses.filter((response) => response.id !== fileId);
// //         setResponses(updatedResponses);
// //         setFiles((prevFiles) => {
// //           const newFiles = { ...prevFiles };
// //           if (newFiles[rowId]) {
// //             newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
// //           }
// //           return newFiles;
// //         });
// //         setFileNames((prevFileNames) => {
// //           const newFileNames = { ...prevFileNames };
// //           delete newFileNames[fileId];
// //           return newFileNames;
// //         });

// //         fetchUploads();
// //       } else {
// //         setError(response.data.message);
// //       }
// //     } catch (error) {
// //       if (error.response) {
// //         console.error('Error response:', error.response.data);
// //         console.error('Error status:', error.response.status);
// //         console.error('Error headers:', error.response.headers);
// //       } else if (error.request) {
// //         console.error('Error request:', error.request);
// //       } else {
// //         console.error('Error message:', error.message);
// //       }
// //       setError('Failed to delete file. Please try again later.');
// //     }
// //   };

// //   const handleAddMore = (id) => {
// //     setEditingRow(id);
// //   };

// //   const handleDownloadAll = async () => {
// //     const token = localStorage.getItem('token');
// //     try {
// //       const fileUrls = responses
// //         .filter((response) => response.file && rows.some(row => row.id === response.rowId))
// //         .map((response) => ({
// //           url: `http://localhost:5000/uploads/${response.file}`,
// //           name: response.fileName || response.file,
// //         }));

// //       for (const { url, name } of fileUrls) {
// //         const response = await fetch(url, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         const blob = await response.blob();
// //         const link = document.createElement('a');
// //         const urlObject = URL.createObjectURL(blob);
// //         link.href = urlObject;
// //         link.setAttribute('download', name);
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //         URL.revokeObjectURL(urlObject);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to download files. Please try again later.');
// //     }
// //   };

// //   const generateRows = (startId, total) => {
// //     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
// //   };

// //   const rows = generateRows(99997, totalRows);

// //   return (
// //     <div className="Content-container">
// //       {user && <p>Welcome, {user.name}</p>}

// //       <h1>FPO ALL STAGES</h1>
// //       {error && <p>{error}</p>}
// //       <button onClick={handleDownloadAll}>Download All Files</button>
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>Upload Files</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((row) => (
// //             <tr key={row.id}>
// //               <td>
// //                 {responses.filter((response) => response.rowId === row.id).map((response) => (
// //                   <div key={response.id}>
// //                     <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
// //                       {response.fileName || response.file}
// //                     </a>
// //                     <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>Delete</button>
// //                   </div>
// //                 ))}
// //                 <button onClick={() => handleAddMore(row.id)}>Add file</button>
// //                 {editingRow === row.id && (
// //                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter file name"
// //                       value={fileNames[row.id] || ''}
// //                       onChange={(e) => handleFileNameChange(e, row.id)}
// //                       ref={(el) => (fileInputRefs.current[row.id] = el)}
// //                     />
// //                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
// //                     <button type="submit">Upload</button>
// //                   </form>
// //                 )}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Uploadexport;

// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './Dashboard.css';
// // import { useUser } from './UserContext';

// // const Uploadexport = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [setUser] = useState(null);
// //   const [totalRows] = useState(1); // Change this value to set the desired number of rows
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         navigate('/login');
// //         return;
// //       }
// //       try {
// //         const [responsesData, userData] = await Promise.all([
// //           axios.get('http://localhost:5000/api/responses', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //           axios.get('http://localhost:5000/api/user', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //         ]);

// //         setResponses(responsesData.data);
// //         setUser(userData.data);
// //         localStorage.setItem('user', JSON.stringify(userData.data));
// //         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //         updateUser(userData.data);
// //       } catch (error) {
// //         console.error(error);
// //         setError('Failed to fetch data. Please try again later.');
// //       }
// //     };

// //     fetchData();
// //   }, [navigate]);

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

// //   const fetchUploads = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get('http://localhost:5000/api/responses', {
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
// //       const updatedResponses = responses.map((item) => {
// //         if (item.rowId === id) {
// //           return {
// //             ...item,
// //             file: response.data.file,
// //             fileName: fileName,
// //           };
// //         }
// //         return item;
// //       });
// //       setResponses(updatedResponses);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   const handleFileDelete = async (rowId, fileId, fileName) => {
// //     const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
// //     if (!confirmation) {
// //       return;
// //     }

// //     const token = localStorage.getItem('token');

// //     try {
// //       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success) {
// //         alert('File deleted successfully.');
// //         const updatedResponses = responses.filter((response) => response.id !== fileId);
// //         setResponses(updatedResponses);
// //         setFiles((prevFiles) => {
// //           const newFiles = { ...prevFiles };
// //           if (newFiles[rowId]) {
// //             newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
// //           }
// //           return newFiles;
// //         });
// //         setFileNames((prevFileNames) => {
// //           const newFileNames = { ...prevFileNames };
// //           delete newFileNames[fileId];
// //           return newFileNames;
// //         });

// //         fetchUploads();
// //       } else {
// //         setError(response.data.message);
// //       }
// //     } catch (error) {
// //       if (error.response) {
// //         console.error('Error response:', error.response.data);
// //         console.error('Error status:', error.response.status);
// //         console.error('Error headers:', error.response.headers);
// //       } else if (error.request) {
// //         console.error('Error request:', error.request);
// //       } else {
// //         console.error('Error message:', error.message);
// //       }
// //       setError('Failed to delete file. Please try again later.');
// //     }
// //   };

// //   const handleAddMore = (id) => {
// //     setEditingRow(id);
// //   };


// //   const generateRows = (startId, total) => {
// //     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
// //   };

// //   const rows = generateRows(99997, totalRows);

// //   return (
// //     <div className="Content-container">
     

     
// //       {/* {error && <p>{error}</p>} */}
// //       {/* <button onClick={handleDownloadAll}>Download All Files</button> */}
// //       <table>
// //         <thead>
// //           <tr>
// //             {/* <th>Serial No.</th> */}
// //             {/* <th>Upload Files</th> */}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((row) => (
// //             <tr key={row.id}>
// //               {/* <td>{index + 1}</td> */}
// //               <td>
// //                 {responses.filter((response) => response.rowId === row.id).map((response) => (
// //                   <div key={response.id}>
// //                     <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
// //                       {response.fileName || response.file}
// //                     </a>
// //                     <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>Delete</button>
// //                   </div>
// //                 ))}
// //                 <button onClick={() => handleAddMore(row.id)}>Add file</button>
// //                 {editingRow === row.id && (
// //                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter file name"
// //                       value={fileNames[row.id] || ''}
// //                       onChange={(e) => handleFileNameChange(e, row.id)}
// //                       ref={(el) => (fileInputRefs.current[row.id] = el)}
// //                     />
// //                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
// //                     <button type="submit">Upload</button>
// //                   </form>
// //                 )}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Uploadexport;
// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import './Dashboard.css';
// // import { useUser } from './UserContext';

// // const Uploadexport = () => {
// //   const [responses, setResponses] = useState([]);
// //   const [files, setFiles] = useState({});
// //   const [fileNames, setFileNames] = useState({});
// //   const [error, setError] = useState(null);
// //   const [setUser] = useState(null);
// //   const [totalRows] = useState(1);
// //   const navigate = useNavigate();
// //   const [editingRow, setEditingRow] = useState(null);
// //   const fileInputRefs = useRef({});
// //   const { updateUser } = useUser();
// //   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
// //   const [password, setPassword] = useState('');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         navigate('/login');
// //         return;
// //       }
// //       try {
// //         const [responsesData, userData] = await Promise.all([
// //           axios.get('http://localhost:5000/api/responses', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //           axios.get('http://localhost:5000/api/user', {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }),
// //         ]);

// //         setResponses(responsesData.data);
// //         setUser(userData.data);
// //         localStorage.setItem('user', JSON.stringify(userData.data));
// //         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
// //         updateUser(userData.data);
// //       } catch (error) {
// //         console.error(error);
// //         setError('Failed to fetch data. Please try again later.');
// //       }
// //     };

// //     fetchData();
// //   }, [navigate]);

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

// //   const fetchUploads = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }
// //     try {
// //       const responsesData = await axios.get('http://localhost:5000/api/responses', {
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
// //     formData.append('password', password); // include password in request

// //     try {
// //       const response = await axios.post('http://localhost:5000/api/upload', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       const updatedResponses = responses.map((item) => {
// //         if (item.rowId === id) {
// //           return {
// //             ...item,
// //             file: response.data.file,
// //             fileName: fileName,
// //           };
// //         }
// //         return item;
// //       });
// //       setResponses(updatedResponses);
// //       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
// //       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
// //       setError(null);
// //       setEditingRow(null);
// //       if (fileInputRefs.current[id]) {
// //         fileInputRefs.current[id].value = null;
// //       }
// //       fetchUploads();
// //       setPasswordModal({ show: false, action: null, rowId: null, fileId: null }); // hide modal after successful upload
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to upload file. Please try again later.');
// //     }
// //   };

// //   const handleFileDelete = async (rowId, fileId, fileName) => {
// //     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
// //   };

// //   const confirmDelete = async () => {
// //     const { rowId, fileId } = passwordModal;
// //     const token = localStorage.getItem('token');
// //     try {
// //       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         data: { password }, // include password in request
// //       });

// //       if (response.data.success) {
// //         alert('File deleted successfully.');
// //         const updatedResponses = responses.filter((response) => response.id !== fileId);
// //         setResponses(updatedResponses);
// //         setFiles((prevFiles) => {
// //           const newFiles = { ...prevFiles };
// //           if (newFiles[rowId]) {
// //             newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
// //           }
// //           return newFiles;
// //         });
// //         setFileNames((prevFileNames) => {
// //           const newFileNames = { ...prevFileNames };
// //           delete newFileNames[fileId];
// //           return newFileNames;
// //         });

// //         fetchUploads();
// //       } else {
// //         setError(response.data.message);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to delete file. Please try again later.');
// //     } finally {
// //       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
// //     }
// //   };

// //   const handleAddMore = (id) => {
// //     setEditingRow(id);
// //     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
// //   };

// //   const generateRows = (startId, total) => {
// //     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
// //   };

// //   const rows = generateRows(99997, totalRows);

// //   return (
// //     <div className="Content-container">
// //       {passwordModal.show && (
// //         <div className="password-modal">
// //           <h3>{passwordModal.action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Add File'}</h3>
// //           <input
// //             type="password"
// //             placeholder="Enter password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />
// //           <button
// //             onClick={() => {
// //               passwordModal.action === 'delete' ? confirmDelete() : handleFileUpload({}, passwordModal.rowId);
// //             }}
// //           >
// //             Confirm
// //           </button>
// //           <button onClick={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}>
// //             Cancel
// //           </button>
// //         </div>
// //       )}
// //       {error && <p>{error}</p>}
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>Files</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map((row) => (
// //             <tr key={row.id}>
// //               <td>
// //                 {responses
// //                   .filter((response) => response.rowId === row.id)
// //                   .map((response) => (
// //                     <div key={response.id}>
// //                       <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
// //                         {response.fileName || response.file}
// //                       </a>
// //                       <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>
// //                         Delete
// //                       </button>
// //                     </div>
// //                   ))}
// //                 <button onClick={() => handleAddMore(row.id)}>Add file</button>
// //                 {editingRow === row.id && (
// //                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
// //                     <input
// //                       type="text"
// //                       placeholder="Enter file name"
// //                       value={fileNames[row.id] || ''}
// //                       onChange={(e) => handleFileNameChange(e, row.id)}
// //                       ref={(el) => (fileInputRefs.current[row.id] = el)}
// //                     />
// //                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
// //                     <button type="submit">Upload</button>
// //                   </form>
// //                 )}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Uploadexport;



import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useUser } from './UserContext';

const UploadOne = () => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [setUser] = useState(null);
  const [totalRows] = useState(1);
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState(null);
  const fileInputRefs = useRef({});
  const { updateUser } = useUser();
  const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const [responsesData, userData] = await Promise.all([
          axios.get('http://localhost:5000/api/responses', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:5000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setResponses(responsesData.data);
        setUser(userData.data);
        localStorage.setItem('user', JSON.stringify(userData.data));
        localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
        updateUser(userData.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [navigate]);

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
      setError('Please select a JPG, JPEG, or PDF file to upload.');
      return;
    }
    const newFiles = { ...files, [id]: file };
    setFiles(newFiles);
    setError(null);
  };

  const handleFileNameChange = (e, id) => {
    const newFileNames = { ...fileNames, [id]: e.target.value };
    setFileNames(newFileNames);
  };

  const fetchUploads = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const responsesData = await axios.get('http://localhost:5000/api/responses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponses(responsesData.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const handleFileUpload = async (e, id) => {
    e.preventDefault(); // Ensure this is an event from a form submission
    const token = localStorage.getItem('token');
    const file = files[id];
    const fileName = fileNames[id];
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('rowId', id);
    formData.append('password', password); // include password in request

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedResponses = responses.map((item) => {
        if (item.rowId === id) {
          return {
            ...item,
            file: response.data.file,
            fileName: fileName,
          };
        }
        return item;
      });
      setResponses(updatedResponses);
      setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
      setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
      setError(null);
      setEditingRow(null);
      if (fileInputRefs.current[id]) {
        fileInputRefs.current[id].value = null;
      }
      fetchUploads();
      setPasswordModal({ show: false, action: null, rowId: null, fileId: null }); // hide modal after successful upload
    } catch (error) {
      console.error(error);
      setError('Failed to upload file. Please try again later.');
    }
  };

  const handleFileDelete = async (rowId, fileId) => {
    setPasswordModal({ show: true, action: 'delete', rowId, fileId });
  };

  const confirmDelete = async () => {
    const { rowId, fileId } = passwordModal;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password }, // include password in request
      });

      if (response.data.success) {
        alert('File deleted successfully.');
        const updatedResponses = responses.filter((response) => response.id !== fileId);
        setResponses(updatedResponses);
        setFiles((prevFiles) => {
          const newFiles = { ...prevFiles };
          if (newFiles[rowId]) {
            newFiles[rowId] = newFiles[rowId].filter((file) => file.id !== fileId);
          }
          return newFiles;
        });
        setFileNames((prevFileNames) => {
          const newFileNames = { ...prevFileNames };
          delete newFileNames[fileId];
          return newFileNames;
        });

        fetchUploads();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to delete file. Please try again later.');
    } finally {
      setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
    }
  };

  const handleAddMore = (id) => {
    setEditingRow(id);
    setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
  };

  const handlePasswordConfirm = async () => {
    if (passwordModal.action === 'delete') {
      await confirmDelete();
    } else if (passwordModal.action === 'upload') {
      // Create a fake event to prevent calling preventDefault directly
      const fakeEvent = { preventDefault: () => {} };
      await handleFileUpload(fakeEvent, passwordModal.rowId);
    }
    setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
  };

  const generateRows = (startId, total) => {
    return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
  };

  const rows = generateRows(99997, totalRows);

  return (
    <div className="Content-container">
      {passwordModal.show && (
        <div className="password-modal">
          <h3>{passwordModal.action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Add File'}</h3>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordConfirm}>
            Confirm
          </button>
          <button onClick={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}>
            Cancel
          </button>
        </div>
      )}
      {/* {error && <p>{error}</p>} */}
      <table>
        <thead>
          <tr>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                {responses
                  .filter((response) => response.rowId === row.id)
                  .map((response) => (
                    <div key={response.id}>
                      <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
                        {response.fileName || response.file}
                      </a>
                      <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>
                        Delete
                      </button>
                    </div>
                  ))}
                <button onClick={() => handleAddMore(row.id)}>Add file</button>
                {editingRow === row.id && (
                  <form onSubmit={(e) => handleFileUpload(e, row.id)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[row.id] || ''}
                      onChange={(e) => handleFileNameChange(e, row.id)}
                      ref={(el) => (fileInputRefs.current[row.id] = el)}
                    />
                    <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
                    <button type="submit">Upload</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadOne;



