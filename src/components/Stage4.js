import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useUser } from './UserContext';

const Stage4 = () => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState(null);
  const fileInputRefs = useRef({});
  const { updateUser } = useUser();

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
  }, [navigate, updateUser]);

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
    } catch (error) {
      console.error(error);
      setError('Failed to upload file. Please try again later.');
    }
  };

  const handleFileDelete = async (rowId, fileId, fileName) => {
    const confirmation = window.confirm(`Are you sure you want to delete the file "${fileName}"?`);
    if (!confirmation) {
      return;
    }

    const token = localStorage.getItem('token');

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
    setEditingRow(id);
  };

  const handleDownloadAll = async () => {
    const token = localStorage.getItem('token');
    try {
      const fileUrls = responses
        .filter((response) => response.file)
        .map((response) => ({
          url: `http://localhost:5000/uploads/${response.file}`,
          name: response.fileName || response.file,
        }));

      for (const { url, name } of fileUrls) {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await response.blob();
        const link = document.createElement('a');
        const urlObject = URL.createObjectURL(blob);
        link.href = urlObject;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlObject);
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

      <h1>FPO ALL STAGES</h1>
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
                {responses.filter((response) => response.rowId === row.id).map((response) => (
                  <div key={response.id}>
                    <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
                      {response.fileName || response.file}
                    </a>
                    <button onClick={() => handleFileDelete(row.id, response.id, response.fileName || response.file)}>Delete</button>
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
              <td>{new Date().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>





      </table>
    </div>
  );
};

export default Stage4;
