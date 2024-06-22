
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';

// const Stage4 = () => {
//   const [responses, setResponses] = useState([]);
//   const [files, setFiles] = useState({});
//   const [fileNames, setFileNames] = useState({});
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

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
//               Authorization: `Bearer ${token}`
//             }
//           }),
//           axios.get('http://localhost:5000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           })
//         ]);

//         setResponses(responsesData.data);
//         setUser(userData.data);
//       } catch (error) {
//         console.error(error);
//         setError('Failed to fetch data. Please try again later.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

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

//   const handleFileUpload = async (e, id) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const file = files[id];
//     const fileName = fileNames[id];
//     if (!file) {
//       setError('Please select a file to upload.');
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
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const updatedResponses = [...responses];
//       const foundResponseIndex = updatedResponses.findIndex(response => response.rowId === id);
//       if (foundResponseIndex !== -1) {
//         updatedResponses[foundResponseIndex].file = response.data.file;
//         updatedResponses[foundResponseIndex].fileName = fileName;
//         setResponses(updatedResponses);
//       }
//       setFiles(prevFiles => ({ ...prevFiles, [id]: null }));
//       setFileNames(prevFileNames => ({ ...prevFileNames, [id]: '' }));
//       setError(null);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to upload file. Please try again later.');
//     }
//   };

//   const handleFileDelete = async (id) => {
//     const token = localStorage.getItem('token');
  
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/delete/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         const updatedResponses = responses.filter((response) => response.id !== id);
//         setResponses(updatedResponses);
//         setFiles(prevFiles => ({ ...prevFiles, [id]: null }));
//         setFileNames(prevFileNames => ({ ...prevFileNames, [id]: '' }));
//       } else {
//         setError(response.data.message);
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error('Error response:', error.response.data);
//         console.error('Error status:', error.response.status);
//         console.error('Error headers:', error.response.headers);
//       } else if (error.request) {
//         console.error('Error request:', error.request);
//       } else {
//         console.error('Error message:', error.message);
//       }
//       setError('Failed to delete file. Please try again later.');
//     }
//   };

//   const handleAddMore = (id) => {
//     const newFiles = { ...files, [id]: null };
//     const newFileNames = { ...fileNames, [id]: '' };
//     setFiles(newFiles);
//     setFileNames(newFileNames);
//   };

//   const rows = [
//     { id:41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
//     { id:42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
//     { id:43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
//     { id:44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
//     { id:45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
//     { id:46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
//     { id:47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
//     { id:48, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '250000' },
//   ];

//   return (
//     <div className="Content-container">
//       {user && <p>Welcome, {user.name}</p>}
//       <button onClick={handleLogout}>Logout</button>
      
//       <h1>Stage Four</h1>
//       {error && <p>{error}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Timeline</th>
//             <th>Activity</th>
//             <th>Deliverables</th>
//             <th>Means of Verification</th>
//             <th>Budget</th>
//             <th>Upload Files</th>
//             <th>File and Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.id}>
//               <td>{row.timeline}</td>
//               <td>{row.activity}</td>
//               <td>{row.deliverables}</td>
//               <td>{row.means}</td>
//               <td>{row.budget}</td>
//               <td>
//                 {responses.find(response => response.rowId === row.id)?.file ? (
//                   <>
//                     <a href={`http://localhost:5000/uploads/${responses.find(response => response.rowId === row.id).file}`} target="_blank" rel="noopener noreferrer">
//                       {responses.find(response => response.rowId === row.id).fileName || responses.find(response => response.rowId === row.id).file}
//                     </a>
//                     <button onClick={() => handleFileDelete(row.id)}>  Delete</button>
//                     <button onClick={() => handleAddMore(row.id)}>  Add More</button>
//                   </>
//                 ) : (
//                   <form onSubmit={(e) => handleFileUpload(e, row.id)}>
//                     <input
//                       type="text"
//                       placeholder="Enter file name   "
//                       value={fileNames[row.id] || ''}
//                       onChange={(e) => handleFileNameChange(e, row.id)}
//                     />
//                     <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
//                     <button type="submit">Upload</button>
//                   </form>
//                 )}
//               </td>
//               <td>{new Date().toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Stage4;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Stage4 = () => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        setResponses(responsesData.data);
        setUser(userData.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  const handleFileUpload = async (e, id) => {
    e.preventDefault();
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
  
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      const updatedResponses = [...responses];
      const foundResponseIndex = updatedResponses.findIndex(response => response.rowId === id);
      if (foundResponseIndex !== -1) {
        updatedResponses[foundResponseIndex].file = response.data.file;
        updatedResponses[foundResponseIndex].fileName = fileName;
        setResponses(updatedResponses);
      }
      setFiles(prevFiles => ({ ...prevFiles, [id]: null }));
      setFileNames(prevFileNames => ({ ...prevFileNames, [id]: '' }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to upload file. Please try again later.');
    }
  };

  const handleFileDelete = async (id) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const updatedResponses = responses.filter((response) => response.id !== id);
        setResponses(updatedResponses);
        setFiles(prevFiles => ({ ...prevFiles, [id]: null }));
        setFileNames(prevFileNames => ({ ...prevFileNames, [id]: '' }));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setError('Failed to delete file. Please try again later.');
    }
  };

  const handleAddMore = (id) => {
    const newFiles = { ...files, [id]: null };
    const newFileNames = { ...fileNames, [id]: '' };
    setFiles(newFiles);
    setFileNames(newFileNames);
  };

  const handleDownloadAll = async () => {
    const token = localStorage.getItem('token');
    try {
      const fileUrls = responses
        .filter(response => response.file)
        .map(response => `http://localhost:5000/uploads/${response.file}`);
      
      for (const url of fileUrls) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to download files. Please try again later.');
    }
  };

  const rows = [
    { id: 41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
    { id: 42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
    { id: 43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
    { id: 44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
    { id: 45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
    { id: 46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id: 47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
    { id: 48, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '250000' },
  ];

  return (
    <div className="Content-container">
      {user && <p>Welcome, {user.name}</p>}
      <button onClick={handleLogout}>Logout</button>

      <h1>Stage Four</h1>
      {error && <p>{error}</p>}
      <button onClick={handleDownloadAll}>Download All Files</button>
      <table>
        <thead>
          <tr>
            <th>Timeline</th>
            <th>Activity</th>
            <th>Deliverables</th>
            <th>Means of Verification</th>
            <th>Budget</th>
            <th>Upload Files</th>
            <th>File and Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.timeline}</td>
              <td>{row.activity}</td>
              <td>{row.deliverables}</td>
              <td>{row.means}</td>
              <td>{row.budget}</td>
              <td>
                {responses.find(response => response.rowId === row.id)?.file ? (
                  <>
                    <a href={`http://localhost:5000/uploads/${responses.find(response => response.rowId === row.id).file}`} target="_blank" rel="noopener noreferrer">
                      {responses.find(response => response.rowId === row.id).fileName || responses.find(response => response.rowId === row.id).file}
                    </a>
                    <button onClick={() => handleFileDelete(row.id)}>Delete</button>
                    <button onClick={() => handleAddMore(row.id)}>Add More</button>
                  </>
                ) : (
                  <form onSubmit={(e) => handleFileUpload(e, row.id)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[row.id] || ''}
                      onChange={(e) => handleFileNameChange(e, row.id)}
                    />
                    <input type="file" accept=".jpg, .jpeg, .pdf" onChange={(e) => handleFileChange(e, row.id)} />
                    <button type="submit">Upload</button>
                  </form>
                )}
              </td>
              <td>{new Date().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stage4;
