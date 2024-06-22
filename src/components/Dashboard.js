import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState(null);
  const fileInputRefs = useRef({});

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
        console.log();
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
    { id :1, timeline: '0 To 5 Month', activity: 'Stage One : Project Inception, baseline Study, Mobilization of Farmers and registration of FPO', deliverables: '', means: '', budget: '' },
    { id :2, timeline: '0 - 1 Month', activity: 'Project planning, inception and staff placement', deliverables: 'Inception and Project Implementation Plan', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :3, timeline: '0 To 3 Month', activity: 'Baseline study: Crops, volumes, value, market access, centrality analysis', deliverables: 'Baseline and Diagnostic Report as per enclosed Checklist in Annexure-2(A)', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :4, timeline: '0 To 3 Month', activity: 'Identification of Product specific clusters / villages and Local Resource Persons (LRP)', deliverables: 'List of Product specific clusters identified and LRPs', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :5, timeline: '0 To 3 Month', activity: 'Feasibility Analysis —Agri Produce Marketable Surplus, Input Requirement and break even estimates', deliverables: 'Various interface tables prepared', means: 'Copy of the report submitted to NAFED', budget: '' },
    { id :6, timeline: '0 To 3 Month', activity: 'Village Awareness meetings to identity potential farmers, opinion leaders, BF/LF etc', deliverables: 'List of farmers identified members for FPO (At Least 50% of minimum requirement)', means: 'List of farmers updated on the NAFED MIS/App', budget: '' },
    { id :7, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '125000' },
    { id :8, timeline: '1 To 4 Month', activity: 'Farmers of FIGs and their handholding', deliverables: 'Farmers Organized into FIGs (At least 50% of minimum requirement)', means: 'List of FIGs updated on the MIS', budget: '' },
    { id :9, timeline: '1 To 4 Month', activity: 'FIGS meeting & orientation for FPO vision building exercise and equity share collection ', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
    { id :10, timeline: '1 To 4 Month', activity: 'Initiation of statutory process required for formation Of FPO like attainment of PAN, DIN for Directors', deliverables: 'FIGS shown some trends/ indicators for collective action and share contribution', means: 'Share amount collected by the FPO promoters', budget: '' },
    { id :11, timeline: '3 To 4 Month', activity: 'Framing of Bye-laws/MoA/AOA for incorporation of FPO', deliverables: 'Bye-laws/MoA/AoA prepared', means: 'Copy of Bye-laws', budget: '' },
    { id :12, timeline: '4 To 5 Month', activity: 'Application of Documents to ROC/Registration Authority of FPO', deliverables: 'FPOs registered under relevant act', means: 'Proof of applications made to Registration Authority', budget: '' },
    { id :13, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '125000' },

    { id:21, timeline: '5 To 8 Month', activity: 'Stage Two : Capacity building of FIG/FPO and Post Registration compliance', deliverables: '', means: '', budget: '' },
    { id:22, timeline: '', activity: 'PFulfilment of post registration compliances, appointment of CEO/Manager & Accountant', deliverables: '1st General Body Meeting conducted Opening of Bank Account, PAN, GST etc.', means: 'GBM Minutes, Bank Account Number, PAN number, GST Number', budget: '' },
    { id:23, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRP and FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
    { id:24, timeline: '', activity: 'Demonstrations for improved farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
    { id:25, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, Participant List submitted to NAFED', budget: '' },
    { id:25, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Balance 50 % of the minimum numbers achieved', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:26, timeline: '', activity: '', deliverables: '', means: '', budget: '' },

    { id:31, timeline: '9 To 12 Month', activity: 'Stage Three: Preparation of Business Plan for FPO, Application for Matching equity &Trade Licences', deliverables: '', means: '', budget: '' },
    { id:32, timeline: '', activity: 'Exposure Visit of Board Members to successful FPO business ventures ', deliverables: 'Board Members have understanding of FPO Business', means: 'Exposure visit report submitted to NAFED', budget: '' },
    { id:33, timeline: '', activity: 'Continue Membership drive for share collection', deliverables: 'Matching Equity collected', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:34, timeline: '', activity: 'Preparation of Business Plan', deliverables: 'Business plan prepared as per checklist Annex2(B)', means: 'Copy of Business Plan submitted to NAFED', budget: '' },
    { id:35, timeline: '', activity: 'Application for Trade Licences if any to deal in Agri produce, Agri inputs etc.', deliverables: 'Trade Licences applied', means: 'Copy of Trade Licences', budget: '' },
    { id:36, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '250000' },

    { id:41, timeline: '13 To 18 Month', activity: 'Stage Four; Capacity building of FIG/FPO and Initiation of FPO Business', deliverables: '', means: '', budget: '' },
    { id:42, timeline: '', activity: 'Stabilize Production System for specific Agri/Allied Commodity ', deliverables: 'Aggregations of Agri/AIIied Commodity through FPO', means: '', budget: '' },
    { id:43, timeline: '', activity: 'Identification of technology gaps and training needs for FPO Members & imparting training (TOT) to LRPand FPO Board members', deliverables: 'Technology gaps and Training needs identified and TOT conducted for LRP and FPO Board Members', means: 'Training Need Assessment report, Training Curriculum and TOT report submitted to NAFED', budget: '' },
    { id:44, timeline: '', activity: 'Demonstrations for improve d farming practices depending on crop / other products', deliverables: 'Minimum 5 crop demonstrations conducted per FPO', means: 'Crop demonstration report submitted to NAFED', budget: '' },
    { id:45, timeline: '', activity: 'Training of farmers for Productivity Increase and access to markets', deliverables: 'Training of FIG/FPO Members at village level twice in a year', means: 'Training report, participant List submitted to NAFED', budget: '' },
    { id:46, timeline: '', activity: 'Membership drive for FIG and FPO continues', deliverables: 'Increased Membership for the FPO', means: 'Share amount collected in FPO Bank account', budget: '' },
    { id:47, timeline: '', activity: 'Starting FPO Business activity as per FPO Business Plan', deliverables: 'FPO Business started', means: 'Profit and LOSS statements, balance sheet etc.', budget: '' },
    { id:48, timeline: '', activity: '', deliverables: '', means: 'Sub Total', budget: '250000' },
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
              <td>{new Date().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
