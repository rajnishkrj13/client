// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [totalRows] = useState(1);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate, updateUser]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', id);

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const updatedResponses = responses.map((item) => {
//         if (item.rowId === id) {
//           return {
//             ...item,
//             file: response.data.file,
//             fileName: fileName,
//           };
//         }
//         return item;
//       });
//       setResponses(updatedResponses);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       fetchUploads();
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });

//         fetchUploads();
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   const rows = generateRows(99997, totalRows);

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         {/* <input name="frontLabelInUse" value={formData.frontLabelInUse} onChange={handleChange} placeholder="Front label In Use" />
//         <input name="backLabelInUse" value={formData.backLabelInUse} onChange={handleChange} placeholder="Back label in use" /> */}
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((row) => (
//                         <tr key={row.id}>
//                           <td>
//                             {responses
//                               .filter((response) => response.rowId === row.id)
//                               .map((response) => (
//                                 <div key={response.id}>
//                                   <a
//                                     href={`http://localhost:5000/uploads/${response.file}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     {response.fileName || response.file}
//                                   </a>
//                                   <button onClick={() => handleFileDelete(row.id, response.id)}>
//                                     Delete
//                                   </button>
//                                 </div>
//                               ))}
//                             <button onClick={() => handleAddMore(row.id)}>Add file</button>
//                             {editingRow === row.id && (
//                               <form onSubmit={(e) => handleFileUpload(e, row.id)}>
//                                 <input
//                                   type="text"
//                                   placeholder="Enter file name"
//                                   value={fileNames[row.id] || ''}
//                                   onChange={(e) => handleFileNameChange(e, row.id)}
//                                   ref={(el) => (fileInputRefs.current[row.id] = el)}
//                                 />
//                                 <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
//                               </form>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((row) => (
//                         <tr key={row.id}>
//                           <td>
//                             {responses
//                               .filter((response) => response.rowId === row.id)
//                               .map((response) => (
//                                 <div key={response.id}>
//                                   <a
//                                     href={`http://localhost:5000/uploads/${response.file}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     {response.fileName || response.file}
//                                   </a>
//                                   <button onClick={() => handleFileDelete(row.id, response.id)}>
//                                     Delete
//                                   </button>
//                                 </div>
//                               ))}
//                             <button onClick={() => handleAddMore(row.id)}>Add file</button>
//                             {editingRow === row.id && (
//                               <form onSubmit={(e) => handleFileUpload(e, row.id)}>
//                                 <input
//                                   type="text"
//                                   placeholder="Enter file name"
//                                   value={fileNames[row.id] || ''}
//                                   onChange={(e) => handleFileNameChange(e, row.id)}
//                                   ref={(el) => (fileInputRefs.current[row.id] = el)}
//                                 />
//                                 <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
//                               </form>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((row) => (
//                         <tr key={row.id}>
//                           <td>
//                             {responses
//                               .filter((response) => response.rowId === row.id)
//                               .map((response) => (
//                                 <div key={response.id}>
//                                   <a
//                                     href={`http://localhost:5000/uploads/${response.file}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     {response.fileName || response.file}
//                                   </a>
//                                   <button onClick={() => handleFileDelete(row.id, response.id)}>
//                                     Delete
//                                   </button>
//                                 </div>
//                               ))}
//                             <button onClick={() => handleAddMore(row.id)}>Add file</button>
//                             {editingRow === row.id && (
//                               <form onSubmit={(e) => handleFileUpload(e, row.id)}>
//                                 <input
//                                   type="text"
//                                   placeholder="Enter file name"
//                                   value={fileNames[row.id] || ''}
//                                   onChange={(e) => handleFileNameChange(e, row.id)}
//                                   ref={(el) => (fileInputRefs.current[row.id] = el)}
//                                 />
//                                 <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
//                               </form>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', id);

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const updatedResponses = responses.map((item) => {
//         if (item.rowId === id) {
//           return {
//             ...item,
//             file: response.data.file,
//             fileName: fileName,
//           };
//         }
//         return item;
//       });
//       setResponses(updatedResponses);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       fetchUploads();
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });

//         fetchUploads();
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   // Generate unique row IDs starting from 999997
//   const rowIdCounter = useRef(999997);

//   const getUniqueRowId = () => {
//     const newId = rowIdCounter.current;
//     rowIdCounter.current += 1;
//     return newId;
//   };

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', id);

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const updatedResponses = responses.map((item) => {
//         if (item.rowId === id) {
//           return {
//             ...item,
//             file: response.data.file,
//             fileName: fileName,
//           };
//         }
//         return item;
//       });
//       setResponses(updatedResponses);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       fetchUploads();
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });

//         fetchUploads();
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   // Generate unique row IDs starting from 999997
//   const rowIdCounter = useRef(999997);

//   const getUniqueRowId = () => {
//     const newId = rowIdCounter.current;
//     rowIdCounter.current += 1;
//     return newId;
//   };

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     const modifiedRowId = id + 99999999; // Adjust rowId

//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', modifiedRowId); // Use modified rowId

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const updatedResponses = responses.map((item) => {
//         if (item.rowId === id) {
//           return {
//             ...item,
//             file: response.data.file,
//             fileName: fileName,
//           };
//         }
//         return item;
//       });
//       setResponses(updatedResponses);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       fetchUploads();
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });

//         fetchUploads();
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   // Generate unique row IDs starting from 999997
//   const rowIdCounter = useRef(999997);

//   const getUniqueRowId = () => {
//     const newId = rowIdCounter.current;
//     rowIdCounter.current += 1;
//     return newId;
//   };

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <div className="Content-container">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Files</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr key={getUniqueRowId()}>
//                         <td>
//                           {responses
//                             .filter((response) => response.rowId === data.id)
//                             .map((response) => (
//                               <div key={response.id}>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${response.file}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {response.fileName || response.file}
//                                 </a>
//                                 <button onClick={() => handleFileDelete(data.id, response.id)}>
//                                   Delete
//                                 </button>
//                               </div>
//                             ))}
//                           <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                           {editingRow === data.id && (
//                             <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                               <input
//                                 type="text"
//                                 placeholder="Enter file name"
//                                 value={fileNames[data.id] || ''}
//                                 onChange={(e) => handleFileNameChange(e, data.id)}
//                                 ref={(el) => (fileInputRefs.current[data.id] = el)}
//                               />
//                               <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                             </form>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;

//fine code
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     const modifiedRowId = id + 99999999; // Adjust rowId

//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', modifiedRowId); // Use modified rowId

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const newResponse = {
//         id: response.data.id,
//         rowId: modifiedRowId,
//         file: response.data.file,
//         fileName: fileName,
//       };
//       setResponses((prevResponses) => [...prevResponses, newResponse]);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   // Generate unique row IDs starting from 999997
//   const rowIdCounter = useRef(999997);

//   const getUniqueRowId = () => {
//     const newId = rowIdCounter.current;
//     rowIdCounter.current += 1;
//     return newId;
//   };

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 {responses
//                   .filter((response) => response.rowId === data.id + 99999999) // Adjusted to match the modified rowId
//                   .map((response) => (
//                     <div key={response.id}>
//                       <a
//                         href={`http://localhost:5000/uploads/${response.file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {response.fileName || response.file}
//                       </a>
//                       <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
//                     </div>
//                   ))}
//                 <button onClick={() => handleAddMore(data.id)}>Add file</button>
//                 {editingRow === data.id && (
//                   <form onSubmit={(e) => handleFileUpload(e, data.id)}>
//                     <input
//                       type="text"
//                       placeholder="Enter file name"
//                       value={fileNames[data.id] || ''}
//                       onChange={(e) => handleFileNameChange(e, data.id)}
//                       ref={(el) => (fileInputRefs.current[data.id] = el)}
//                     />
//                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                   </form>
//                 )}
//               </td>
              
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './TableForm.css';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from './UserContext';

// // PasswordModal Component
// const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
//   if (!show) return null;

//   return (
//     <div className="password-modal">
//       <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
//       <input
//         type="password"
//         placeholder="Enter password"
//         value={password}
//         onChange={onPasswordChange}
//       />
//       <button onClick={onConfirm}>Confirm</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// // TableForm Component
// const TableForm = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [editingRow, setEditingRow] = useState(null);
//   const fileInputRefs = useRef({});
//   const { updateUser } = useUser();
//   const [passwordModal, setPasswordModal] = useState({ show: false, action: null, rowId: null, fileId: null });
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const [responsesData, userData] = await Promise.all([
//           axios.get('http://localhost:5000/api/responses', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }),
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//         localStorage.setItem('user', JSON.stringify(userData.data));
//         localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
//         updateUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleFileChange = (e, id) => {
//     const file = e.target.files[0];
//     const fileName = e.target.value;
//     const fileExtension = fileName.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf') {
//       setError('Please select a JPG, JPEG, or PDF file to upload.');
//       return;
//     }
//     const newFiles = { ...files, [id]: file };
//     setFiles(newFiles);
//     setError(null);
//   };

//   const handleFileNameChange = (e, id) => {
//     const newFileNames = { ...fileNames, [id]: e.target.value };
//     setFileNames(newFileNames);
//   };

//   const fetchUploads = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     try {
//       const responsesData = await axios.get('http://localhost:5000/api/responses', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setResponses(responsesData.data);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch data. Please try again later.');
//     }
//   };

//   const handleFileUpload = async (e, id, sectionModifier) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     const modifiedRowId = id + sectionModifier; // Adjust rowId based on section

//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }
//     if (password !== 'add') {
//       setError('Invalid password for upload.');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', fileName);
//     formData.append('rowId', modifiedRowId); // Use modified rowId

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const newResponse = {
//         id: response.data.id,
//         rowId: modifiedRowId,
//         file: response.data.file,
//         fileName: fileName,
//       };
//       setResponses((prevResponses) => [...prevResponses, newResponse]);
//       setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
//       setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//       setEditingRow(null);
//       if (fileInputRefs.current[id]) {
//         fileInputRefs.current[id].value = null;
//       }
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = (rowId, fileId) => {
//     setPasswordModal({ show: true, action: 'delete', rowId, fileId });
//   };

//   const confirmDelete = async () => {
//     const { rowId, fileId } = passwordModal;
//     const token = localStorage.getItem('token');
//     if (password !== 'remove') {
//       setError('Invalid password for delete.');
//       return;
//     }
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('File deleted successfully.');
//         const updatedResponses = responses.filter((response) => response.id !== fileId);
//         setResponses(updatedResponses);
//         setFiles((prevFiles) => {
//           const newFiles = { ...prevFiles };
//           delete newFiles[rowId];
//           return newFiles;
//         });
//         setFileNames((prevFileNames) => {
//           const newFileNames = { ...prevFileNames };
//           delete newFileNames[fileId];
//           return newFileNames;
//         });
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Failed to delete file. Please try again later.');
//     } finally {
//       setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     }
//   };

//   const handleAddMore = (id, sectionModifier) => {
//     setEditingRow(id);
//     setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null, sectionModifier });
//   };

//   const handlePasswordConfirm = async () => {
//     if (passwordModal.action === 'delete') {
//       await confirmDelete();
//     } else if (passwordModal.action === 'upload') {
//       const fakeEvent = { preventDefault: () => {} };
//       await handleFileUpload(fakeEvent, passwordModal.rowId, passwordModal.sectionModifier);
//     }
//     setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
//     setPassword('');
//   };

//   const generateRows = (startId, total) => {
//     return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
//   };

//   // Generate unique row IDs starting from 999997
//   const rowIdCounter = useRef(999997);

//   const getUniqueRowId = () => {
//     const newId = rowIdCounter.current;
//     rowIdCounter.current += 1;
//     return newId;
//   };

//   const [formData, setFormData] = useState({
//     productName: '',
//     weightLbs: '',
//     weightG: '',
//     hsnCode: '',
//     barcode: '',
//     skuCode: '',
//     productContains: '',
//     packingType: '',
//     packSize: '',
//     cost: '',
//     batchNo: '',
//     expiryDate: '',
//     frontLabelInUse: '',
//     backLabelInUse: '',
//     usedByDate: '',
//     frontLabel: { file: '', fileName: '' },
//     backLabel: { file: '', fileName: '' },
//     qrCode: { file: '', fileName: '' },
//   });

//   const [tableData, setTableData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [deletePassword, setDeletePassword] = useState('');
//   const [productFileNames, setProductFileNames] = useState({
//     labelFront: '',
//     labelBack: '',
//     qrCode: '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setTableData(response.data);

//       // Fetch user details
//       const userResponse = await axios.get(`http://localhost:5000/api/user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//         },
//       });
//       setUserName(userResponse.data.name);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

//       if (allowedTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: { file: reader.result, fileName: file.name },
//           }));
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeletePasswordChange = (e) => {
//     setDeletePassword(e.target.value);
//   };

//   const handleProductFileNameChange = (e) => {
//     const { name, value } = e.target;
//     setProductFileNames((prevFileNames) => ({
//       ...prevFileNames,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       if (password === 'update') {
//         try {
//           await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error updating product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     } else {
//       if (password === 'add') {
//         try {
//           await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//             },
//           });
//           fetchData();
//           resetForm();
//         } catch (error) {
//           console.error('Error adding product:', error);
//         }
//       } else {
//         alert('Invalid password. Please try again.');
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletePassword === 'remove') {
//       try {
//         await axios.delete(`http://localhost:5000/api/products/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
//           },
//         });
//         fetchData();
//         setDeletePassword('');
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     } else {
//       alert('Invalid password. Please try again.');
//     }
//   };

//   const handleEdit = (data) => {
//     setIsEditing(true);
//     setEditId(data.id);
//     setFormData({
//       productName: data.productName,
//       weightLbs: data.weightLbs,
//       weightG: data.weightG,
//       hsnCode: data.hsnCode,
//       barcode: data.barcode,
//       skuCode: data.skuCode,
//       productContains: data.productContains,
//       packingType: data.packingType,
//       packSize: data.packSize,
//       cost: data.cost,
//       batchNo: data.batchNo,
//       expiryDate: data.expiryDate,
//       frontLabelInUse: data.frontLabelInUse,
//       backLabelInUse: data.backLabelInUse,
//       usedByDate: data.usedByDate,
//       frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
//       backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
//       qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
//     });
//     setProductFileNames({
//       labelFront: data.frontLabel ? data.frontLabel.fileName : '',
//       labelBack: data.backLabel ? data.backLabel.fileName : '',
//       qrCode: data.qrCode ? data.qrCode.fileName : '',
//     });
//     setPassword('');
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       weightLbs: '',
//       weightG: '',
//       hsnCode: '',
//       barcode: '',
//       skuCode: '',
//       productContains: '',
//       packingType: '',
//       packSize: '',
//       cost: '',
//       batchNo: '',
//       expiryDate: '',
//       frontLabelInUse: '',
//       backLabelInUse: '',
//       usedByDate: '',
//       frontLabel: { file: '', fileName: '' },
//       backLabel: { file: '', fileName: '' },
//       qrCode: { file: '', fileName: '' },
//     });
//     setProductFileNames({
//       labelFront: '',
//       labelBack: '',
//       qrCode: '',
//     });
//     setPassword('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div>
//       <div>Welcome, {userName}!</div>
//       <form onSubmit={handleSubmit}>
//         <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
//         <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
//         <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
//         <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
//         <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
//         <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
//         <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
//         <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
//         <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
//         <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
//         <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
//         <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
//         <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
//         <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
//         <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Serial No.</th>
//             <th>Product Name</th>
//             <th>Weight in Lbs.</th>
//             <th>Weight in g</th>
//             <th>HSN code</th>
//             <th>Barcode</th>
//             <th>SKU Code</th>
//             <th>Product contains</th>
//             <th>Packing type</th>
//             <th>Pack size</th>
//             <th>Cost</th>
//             <th>Batch No.</th>
//             <th>Expiry date</th>
//             <th>Front label In Use</th>
//             <th>Back label in use</th>
//             <th>Used By date</th>
//             <th>Front Label</th>
//             <th>Back Label</th>
//             <th>QR Code</th>
//             <th>Edit</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((data, index) => (
//             <tr key={data.id}>
//               <td>{index + 1}</td>
//               <td>{data.productName}</td>
//               <td>{data.weightLbs}</td>
//               <td>{data.weightG}</td>
//               <td>{data.hsnCode}</td>
//               <td>{data.barcode}</td>
//               <td>{data.skuCode}</td>
//               <td>{data.productContains}</td>
//               <td>{data.packingType}</td>
//               <td>{data.packSize}</td>
//               <td>{data.cost}</td>
//               <td>{data.batchNo}</td>
//               <td>{data.expiryDate}</td>
//               <td>{data.frontLabelInUse}</td>
//               <td>{data.backLabelInUse}</td>
//               <td>{data.usedByDate}</td>
//               <td>
//                 {responses
//                   .filter((response) => response.rowId === data.id + 99999999) // Adjusted to match the modified rowId
//                   .map((response) => (
//                     <div key={response.id}>
//                       <a
//                         href={`http://localhost:5000/uploads/${response.file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {response.fileName || response.file}
//                       </a>
//                       <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
//                     </div>
//                   ))}
//                 <button onClick={() => handleAddMore(data.id, 99999999)}>Add file</button>
//                 {editingRow === data.id && (
//                   <form onSubmit={(e) => handleFileUpload(e, data.id, 99999999)}>
//                     <input
//                       type="text"
//                       placeholder="Enter file name"
//                       value={fileNames[data.id] || ''}
//                       onChange={(e) => handleFileNameChange(e, data.id)}
//                       ref={(el) => (fileInputRefs.current[data.id] = el)}
//                     />
//                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                   </form>
//                 )}
//               </td>

//               <td>
//                 {responses
//                   .filter((response) => response.rowId === data.id + 999999999) // Adjusted to match the modified rowId
//                   .map((response) => (
//                     <div key={response.id}>
//                       <a
//                         href={`http://localhost:5000/uploads/${response.file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {response.fileName || response.file}
//                       </a>
//                       <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
//                     </div>
//                   ))}
//                 <button onClick={() => handleAddMore(data.id, 999999999)}>Add file</button>
//                 {editingRow === data.id && (
//                   <form onSubmit={(e) => handleFileUpload(e, data.id, 999999999)}>
//                     <input
//                       type="text"
//                       placeholder="Enter file name"
//                       value={fileNames[data.id] || ''}
//                       onChange={(e) => handleFileNameChange(e, data.id)}
//                       ref={(el) => (fileInputRefs.current[data.id] = el)}
//                     />
//                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                   </form>
//                 )}
//               </td>

//               <td>
//                 {responses
//                   .filter((response) => response.rowId === data.id + 9999999999) // Adjusted to match the modified rowId
//                   .map((response) => (
//                     <div key={response.id}>
//                       <a
//                         href={`http://localhost:5000/uploads/${response.file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {response.fileName || response.file}
//                       </a>
//                       <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
//                     </div>
//                   ))}
//                 <button onClick={() => handleAddMore(data.id, 9999999999)}>Add file</button>
//                 {editingRow === data.id && (
//                   <form onSubmit={(e) => handleFileUpload(e, data.id, 9999999999)}>
//                     <input
//                       type="text"
//                       placeholder="Enter file name"
//                       value={fileNames[data.id] || ''}
//                       onChange={(e) => handleFileNameChange(e, data.id)}
//                       ref={(el) => (fileInputRefs.current[data.id] = el)}
//                     />
//                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
//                   </form>
//                 )}
//               </td>
              
//               <td>
//                 <button onClick={() => handleEdit(data)}>Edit</button>
//               </td>
//               <td>
//                 <input
//                   type="password"
//                   value={deletePassword}
//                   onChange={handleDeletePasswordChange}
//                   placeholder="Enter password to delete"
//                 />
//                 <button onClick={() => handleDelete(data.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <PasswordModal
//         show={passwordModal.show}
//         action={passwordModal.action}
//         password={password}
//         onConfirm={handlePasswordConfirm}
//         onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
//         onPasswordChange={(e) => setPassword(e.target.value)}
//       />
//     </div>
//   );
// };

// export default TableForm;



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TableForm.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
// import ExportUserID from './ExportUserID';

// PasswordModal Component
const PasswordModal = ({ show, action, onConfirm, onCancel, onPasswordChange, password }) => {
  if (!show) return null;

  return (
    <div className="password-modal">
      <h3>{action === 'delete' ? 'Enter Password to Delete' : 'Enter Password to Upload'}</h3>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={onPasswordChange}
      />
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

// TableForm Component
const TableForm = () => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
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

  const handleFileUpload = async (e, id, sectionModifier) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const file = files[id];
    const fileName = fileNames[id];
    const modifiedRowId = id + sectionModifier; // Adjust rowId based on section

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (password !== 'add') {
      setError('Invalid password for upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('rowId', modifiedRowId); // Use modified rowId

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const newResponse = {
        id: response.data.id,
        rowId: modifiedRowId,
        file: response.data.file,
        fileName: fileName,
      };
      setResponses((prevResponses) => [...prevResponses, newResponse]);
      setFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
      setFileNames((prevFileNames) => ({ ...prevFileNames, [id]: '' }));
      setError(null);
      setEditingRow(null);
      if (fileInputRefs.current[id]) {
        fileInputRefs.current[id].value = null;
      }
      setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
    } catch (error) {
      console.error(error);
      setError('Failed to upload file. Please try again later.');
    }
  };

  const handleFileDelete = (rowId, fileId) => {
    setPasswordModal({ show: true, action: 'delete', rowId, fileId });
  };

  const confirmDelete = async () => {
    const { rowId, fileId } = passwordModal;
    const token = localStorage.getItem('token');
    if (password !== 'remove') {
      setError('Invalid password for delete.');
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert('File deleted successfully.');
        const updatedResponses = responses.filter((response) => response.id !== fileId);
        setResponses(updatedResponses);
        setFiles((prevFiles) => {
          const newFiles = { ...prevFiles };
          delete newFiles[rowId];
          return newFiles;
        });
        setFileNames((prevFileNames) => {
          const newFileNames = { ...prevFileNames };
          delete newFileNames[fileId];
          return newFileNames;
        });
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

  const handleAddMore = (id, sectionModifier) => {
    setEditingRow(id);
    setPasswordModal({ show: true, action: 'upload', rowId: id, fileId: null, sectionModifier });
  };

  const handlePasswordConfirm = async () => {
    if (passwordModal.action === 'delete') {
      await confirmDelete();
    } else if (passwordModal.action === 'upload') {
      const fakeEvent = { preventDefault: () => {} };
      await handleFileUpload(fakeEvent, passwordModal.rowId, passwordModal.sectionModifier);
    }
    setPasswordModal({ show: false, action: null, rowId: null, fileId: null });
    setPassword('');
  };

  // const generateRows = (startId, total) => {
  //   return Array.from({ length: total }, (_, i) => ({ id: startId + i }));
  // };

  // // Generate unique row IDs starting from 999997
  // const rowIdCounter = useRef(999997);

  // const getUniqueRowId = () => {
  //   const newId = rowIdCounter.current;
  //   rowIdCounter.current += 1;
  //   return newId;
  // };

  const [formData, setFormData] = useState({
    productName: '',
    weightLbs: '',
    weightG: '',
    hsnCode: '',
    barcode: '',
    skuCode: '',
    productContains: '',
    packingType: '',
    packSize: '',
    cost: '',
    batchNo: '',
    expiryDate: '',
    frontLabelInUse: '',
    backLabelInUse: '',
    usedByDate: '',
    frontLabel: { file: '', fileName: '' },
    backLabel: { file: '', fileName: '' },
    qrCode: { file: '', fileName: '' },
  });

  const [tableData, setTableData] = useState([]);
  const [userName, setUserName] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [productFileNames, setProductFileNames] = useState({
    labelFront: '',
    labelBack: '',
    qrCode: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
        },
      });
      setTableData(response.data);

      // Fetch user details
      const userResponse = await axios.get(`http://localhost:5000/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
        },
      });
      setUserName(userResponse.data.name);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/jpg'];

      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: { file: reader.result, fileName: file.name },
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Invalid file type. Please upload PDF, ZIP, JPG, JPEG, or PNG files only.');
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDeletePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  const handleProductFileNameChange = (e) => {
    const { name, value } = e.target;
    setProductFileNames((prevFileNames) => ({
      ...prevFileNames,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      if (password === 'update') {
        try {
          await axios.put(`http://localhost:5000/api/products/${editId}`, { ...formData, userId }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
            },
          });
          fetchData();
          resetForm();
        } catch (error) {
          console.error('Error updating product:', error);
        }
      } else {
        alert('Invalid password. Please try again.');
      }
    } else {
      if (password === 'add') {
        try {
          await axios.post('http://localhost:5000/api/products', { ...formData, userId }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
            },
          });
          fetchData();
          resetForm();
        } catch (error) {
          console.error('Error adding product:', error);
        }
      } else {
        alert('Invalid password. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (deletePassword === 'remove') {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored
          },
        });
        fetchData();
        setDeletePassword('');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    } else {
      alert('Invalid password. Please try again.');
    }
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setEditId(data.id);
    setFormData({
      productName: data.productName,
      weightLbs: data.weightLbs,
      weightG: data.weightG,
      hsnCode: data.hsnCode,
      barcode: data.barcode,
      skuCode: data.skuCode,
      productContains: data.productContains,
      packingType: data.packingType,
      packSize: data.packSize,
      cost: data.cost,
      batchNo: data.batchNo,
      expiryDate: data.expiryDate,
      // frontLabelInUse: data.frontLabelInUse,
      // backLabelInUse: data.backLabelInUse,
      usedByDate: data.usedByDate,
      frontLabel: { file: '', fileName: data.frontLabel?.fileName || '' },
      backLabel: { file: '', fileName: data.backLabel?.fileName || '' },
      qrCode: { file: '', fileName: data.qrCode?.fileName || '' },
    });
    setProductFileNames({
      labelFront: data.frontLabel ? data.frontLabel.fileName : '',
      labelBack: data.backLabel ? data.backLabel.fileName : '',
      qrCode: data.qrCode ? data.qrCode.fileName : '',
    });
    setPassword('');
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      weightLbs: '',
      weightG: '',
      hsnCode: '',
      barcode: '',
      skuCode: '',
      productContains: '',
      packingType: '',
      packSize: '',
      cost: '',
      batchNo: '',
      expiryDate: '',
      // frontLabelInUse: '',
      // backLabelInUse: '',
      usedByDate: '',
      frontLabel: { file: '', fileName: '' },
      backLabel: { file: '', fileName: '' },
      qrCode: { file: '', fileName: '' },
    });
    setProductFileNames({
      labelFront: '',
      labelBack: '',
      qrCode: '',
    });
    setPassword('');
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className='tttable'>
      <div>
      {/* <ExportUserID /> */}
      </div>
      
      <div className='headname'>Welcome, {userName}!</div>
      <form onSubmit={handleSubmit}>
        <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
        <input name="weightLbs" value={formData.weightLbs} onChange={handleChange} placeholder="Weight in Lbs." />
        <input name="weightG" value={formData.weightG} onChange={handleChange} placeholder="Weight in g" />
        <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN code" />
        <input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Barcode" />
        <input name="skuCode" value={formData.skuCode} onChange={handleChange} placeholder="SKU Code" />
        <input name="productContains" value={formData.productContains} onChange={handleChange} placeholder="Product contains" />
        <input name="packingType" value={formData.packingType} onChange={handleChange} placeholder="Packing type" />
        <input name="packSize" value={formData.packSize} onChange={handleChange} placeholder="Pack size" />
        <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" />
        <input name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." />
        <input name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry date" />
        <input name="usedByDate" value={formData.usedByDate} onChange={handleChange} placeholder="Used By date" />
        
        <input type="password" value={password} onChange={handlePasswordChange} placeholder={`Enter password to ${isEditing ? 'update' : 'add'}`} />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
       
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Product Name</th>
            <th>Weight in Lbs.</th>
            <th>Weight in g</th>
            <th>HSN code</th>
            <th>Barcode</th>
            <th>SKU Code</th>
            <th>Product contains</th>
            <th>Packing type</th>
            <th>Pack size</th>
            <th>Cost</th>
            <th>Batch No.</th>
            <th>Expiry date</th>
            {/* <th>Front label In Use</th>
            <th>Back label in use</th> */}
            <th>Used By date</th>
            <th>Front Label</th>
            <th>Back Label</th>
            <th>QR Code</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={data.id}>
              <td>{index + 1}</td>
              <td>{data.productName}</td> 
              <td>{data.weightLbs}</td>
              <td>{data.weightG}</td>
              <td>{data.hsnCode}</td>
              <td>{data.barcode}</td>
              <td>{data.skuCode}</td>
              <td>{data.productContains}</td>
              <td>{data.packingType}</td>
              <td>{data.packSize}</td>
              <td>{data.cost}</td>
              <td>{data.batchNo}</td>
              <td>{data.expiryDate}</td>
              {/* <td>{data.frontLabelInUse}</td>
              <td>{data.backLabelInUse}</td> */}
              <td>{data.usedByDate}</td>
              <td>
                {responses
                  .filter((response) => response.rowId === data.id + 99999999)
                  .map((response) => (
                    <div key={response.id}>
                      <a
                        href={`http://localhost:5000/uploads/${response.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {response.fileName || response.file}
                      </a>
                      <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
                    </div>
                  ))}
                <button onClick={() => handleAddMore(data.id, 99999999)}>Add file</button>
                {editingRow === data.id && (
                  <form onSubmit={(e) => handleFileUpload(e, data.id, 99999999)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[data.id] || ''}
                      onChange={(e) => handleFileNameChange(e, data.id)}
                      ref={(el) => (fileInputRefs.current[data.id] = el)}
                    />
                    <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
                  </form>
                )}
              </td>
              <td>
                {responses
                  .filter((response) => response.rowId === data.id + 999999999)
                  .map((response) => (
                    <div key={response.id}>
                      <a
                        href={`http://localhost:5000/uploads/${response.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {response.fileName || response.file}
                      </a>
                      <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
                    </div>
                  ))}
                <button onClick={() => handleAddMore(data.id, 999999999)}>Add file</button>
                {editingRow === data.id && (
                  <form onSubmit={(e) => handleFileUpload(e, data.id, 999999999)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[data.id] || ''}
                      onChange={(e) => handleFileNameChange(e, data.id)}
                      ref={(el) => (fileInputRefs.current[data.id] = el)}
                    />
                    <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
                  </form>
                )}
              </td>
              <td>
                {responses
                  .filter((response) => response.rowId === data.id + 6999)
                  .map((response) => (
                    <div key={response.id}>
                      <a
                        href={`http://localhost:5000/uploads/${response.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {response.fileName || response.file}
                      </a>
                      <button onClick={() => handleFileDelete(data.id, response.id)}>Delete</button>
                    </div>
                  ))}
                <button onClick={() => handleAddMore(data.id, 6999)}>Add file</button>
                {editingRow === data.id && (
                  <form onSubmit={(e) => handleFileUpload(e, data.id, 6999)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[data.id] || ''}
                      onChange={(e) => handleFileNameChange(e, data.id)}
                      ref={(el) => (fileInputRefs.current[data.id] = el)}
                    />
                    <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, data.id)} />
                  </form>
                )}
              </td>
              <td>
              <button onClick={() => handleEdit(data)}>Edit</button>
              </td>
              <td>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={handleDeletePasswordChange}
                  placeholder="Enter password to delete"
                />
                <button onClick={() => handleDelete(data.id)}>Delete</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PasswordModal
        show={passwordModal.show}
        action={passwordModal.action}
        password={password}
        onConfirm={handlePasswordConfirm}
        onCancel={() => setPasswordModal({ show: false, action: null, rowId: null, fileId: null })}
        onPasswordChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
};

export default TableForm;
