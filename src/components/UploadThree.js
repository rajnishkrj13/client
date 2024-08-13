

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useUser } from './UserContext';

const UploadThree = () => {
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

  const rows = generateRows(99999997, totalRows);

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

export default UploadThree;



