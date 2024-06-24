import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useUser } from './UserContext';

const Printing = () => {
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
        localStorage.setItem('user',JSON.stringify(userData.data));
        localStorage.setItem('isAdmin', userData.data.email === 'treta@justorganik.com');
        updateUser(userData.data);
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

  const fetchUploads = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const responsesData = await axios.get('http://localhost:5000/api/responses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          Authorization: `Bearer ${token}`
        }
      });
      const updatedResponses = responses.map(item => {
        if (item.rowId === id) {
          return {
            ...item,
            file: response.data.file,
            fileName: fileName
          };
        }
        return item;
      });
      setResponses(updatedResponses);
      setFiles(prevFiles => ({ ...prevFiles, [id]: null }));
      setFileNames(prevFileNames => ({ ...prevFileNames, [id]: '' }));
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

   const handleFileDelete = async (rowId, fileId) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const updatedResponses = responses.filter((response) => response.id !== fileId);
        setResponses(updatedResponses);
        setFiles(prevFiles => {
          const newFiles = { ...prevFiles };
          if (newFiles[rowId]) {
            newFiles[rowId] = newFiles[rowId].filter(file => file.id !== fileId);
          }
          return newFiles;
        });
        setFileNames(prevFileNames => {
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
        .filter(response => response.file)
        .map(response => ({
          url: `http://localhost:5000/uploads/${response.file}`,
          name: response.fileName || response.file
        }));
      
      for (const { url, name } of fileUrls) {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    { id: 100001, eanCode: '8906070431008', itemCode: 'CR100', hsnCode: '10063020', productNameEn: 'Basmati Rice', productNameHi: 'Basmati Chawal', packingSize: '0.500', mrp: '150.00', shelfLife: '18', usp: '0.3', pouchBack: 'Image/file', pouchFront: 'Image/file', label: 'Image/file' },
    { id: 200002, eanCode: '8906070431015', itemCode: 'CR101', hsnCode: '10063020', productNameEn: 'Basmati Rice', productNameHi: 'Basmati Chawal', packingSize: '1.000', mrp: '295.00', shelfLife: '18', usp: '0.295', pouchBack: 'Image/file', pouchFront: 'Image/file', label: 'Image/file' },
    { id: 300003, eanCode: '8906070431039', itemCode: 'CR103', hsnCode: '10063020', productNameEn: 'Brown Basmati Rice', productNameHi: 'Brown Basmati Chawal', packingSize: '0.500', mrp: '155.00', shelfLife: '18', usp: '0.31', pouchBack: 'Image/file', pouchFront: 'Image/file', label: 'Image/file' }
  ];

  return (
    <div className="Content-container">
      {user && <p>Welcome, {user.name}</p>}
      <button onClick={handleLogout}>Logout</button>
      
      <h1>Product Information</h1>
      {error && <p>{error}</p>}
      <button onClick={handleDownloadAll}>Download All Files</button>

      <table>
        <thead>
          <tr>
            {/* <th>Sr. No.</th> */}
            <th>EAN Code / Bar Code</th>
            <th>Item Code</th>
            <th>HSN Code</th>
            <th>Product Name (English)</th>
            <th>Product Name (Hindi)</th>
            <th>Packing Size (Kg)</th>
            <th>MRP (INR)</th>
            <th>Shelf Life (Month)</th>
            <th>USP</th>
            <th>Pouch Back / Pouch Front / Label</th>

          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {/* <td>{row.id}</td> */}
              <td>{row.eanCode}</td>
              <td>{row.itemCode}</td>
              <td>{row.hsnCode}</td>
              <td>{row.productNameEn}</td>
              <td>{row.productNameHi}</td>
              <td>{row.packingSize}</td>
              <td>{row.mrp}</td>
              <td>{row.shelfLife}</td>
              <td>{row.usp}</td>
              <td>
                {responses.filter(response => response.rowId === row.id).map(response => (
                  <div key={response.id}>
                    <a href={`http://localhost:5000/uploads/${response.file}`} target="_blank" rel="noopener noreferrer">
                      {response.fileName || response.file}
                    </a>
                    <button onClick={() => handleFileDelete(row.id, response.id)}>Delete</button>
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
              {/* <td>{new Date().toLocaleString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Printing;
