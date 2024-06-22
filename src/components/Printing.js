import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Printing = ({ handleLogout }) => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
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

        if (userData.data.email !== 'treta@justorganik.com') {
          setError('Unauthorized access');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

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
      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>EAN Code / Bar Code</th>
            <th>Item Code</th>
            <th>HSN Code</th>
            <th>Product Name (English)</th>
            <th>Product Name (Hindi)</th>
            <th>Packing Size (Kg)</th>
            <th>MRP (INR)</th>
            <th>Shelf Life (Month)</th>
            <th>USP</th>
            <th>Pouch Back</th>
            <th>Pouch Front</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
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
                {responses.find((response) => response.rowId === row.id) ? (
                  <div>
                    <a href={responses.find((response) => response.rowId === row.id).file}>{responses.find((response) => response.rowId === row.id).fileName}</a>
                    <button onClick={() => handleFileDelete(row.id)}>Delete</button>
                    <button onClick={() => handleAddMore(row.id)}>Add More</button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleFileUpload(e, row.id)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[row.id] || ''}
                      onChange={(e) => handleFileNameChange(e, row.id)}
                    />
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, row.id)}
                    />
                    <button type="submit">Upload</button>
                  </form>
                )}
              </td>
              <td>
                {responses.find((response) => response.rowId === row.id) ? (
                  <div>
                    <a href={responses.find((response) => response.rowId === row.id).file}>{responses.find((response) => response.rowId === row.id).fileName}</a>
                    <button onClick={() => handleFileDelete(row.id)}>Delete</button>
                    <button onClick={() => handleAddMore(row.id)}>Add More</button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleFileUpload(e, row.id)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[row.id] || ''}
                      onChange={(e) => handleFileNameChange(e, row.id)}
                    />
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, row.id)}
                    />
                    <button type="submit">Upload</button>
                  </form>
                )}
              </td>
              <td>
                {responses.find((response) => response.rowId === row.id) ? (
                  <div>
                    <a href={responses.find((response) => response.rowId === row.id).file}>{responses.find((response) => response.rowId === row.id).fileName}</a>
                    <button onClick={() => handleFileDelete(row.id)}>Delete</button>
                    <button onClick={() => handleAddMore(row.id)}>Add More</button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleFileUpload(e, row.id)}>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={fileNames[row.id] || ''}
                      onChange={(e) => handleFileNameChange(e, row.id)}
                    />
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, row.id)}
                    />
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

export default Printing;

