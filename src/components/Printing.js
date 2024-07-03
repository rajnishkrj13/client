import React, { useEffect, useState, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'pdf' && fileExtension !== 'zip') {
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
    const passcode = prompt('Enter passcode to delete the file:');
    if (passcode !== 'Bhasma') {
      alert('Incorrect passcode.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) {
      return;
    }

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
      
    {
      "id": 100001,
      "eanCode": "8906070431008",
      "itemCode": "CR100",
      "hsnCode": "10063020",
      "productNameEn": "Basmati Rice",
      "productNameHi": "Basmati Chawal",
      "packingSize": "0.500",
      "mrp": "150.00",
      "shelfLife": "18",
      "usp": "0.3",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100002,
      "eanCode": "8906070431015",
      "itemCode": "CR101",
      "hsnCode": "10063020",
      "productNameEn": "Basmati Rice",
      "productNameHi": "Basmati Chawal",
      "packingSize": "1.000",
      "mrp": "295.00",
      "shelfLife": "18",
      "usp": "0.295",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100003,
      "eanCode": "8906070431039",
      "itemCode": "CR103",
      "hsnCode": "10063020",
      "productNameEn": "Brown Basmati Rice",
      "productNameHi": "Brown Basmati Chawal",
      "packingSize": "0.500",
      "mrp": "155.00",
      "shelfLife": "18",
      "usp": "0.31",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100004,
      "eanCode": "8906070431046",
      "itemCode": "CR104",
      "hsnCode": "10063020",
      "productNameEn": "Brown Basmati Rice",
      "productNameHi": "Brown Basmati Chawal",
      "packingSize": "1.000",
      "mrp": "310.00",
      "shelfLife": "18",
      "usp": "0.31",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100005,
      "eanCode": "8906070431060",
      "itemCode": "CR106",
      "hsnCode": "10063010",
      "productNameEn": "Sona Masoori Rice",
      "productNameHi": "Sona Masoori Chawal",
      "packingSize": "1.000",
      "mrp": "125.00",
      "shelfLife": "18",
      "usp": "0.125",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100006,
      "eanCode": "8906070431084",
      "itemCode": "CR108",
      "hsnCode": "10063010",
      "productNameEn": "Sona Masoori Rice",
      "productNameHi": "Sona Masoori Chawal",
      "packingSize": "5.000",
      "mrp": "595.00",
      "shelfLife": "18",
      "usp": "0.119",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100007,
      "eanCode": "8906070434696",
      "itemCode": "CR469",
      "hsnCode": "10063010",
      "productNameEn": "Brown Sonamasuri Rice",
      "productNameHi": "Brown Sonamasuri Chawal",
      "packingSize": "1.000",
      "mrp": "135.00",
      "shelfLife": "18",
      "usp": "0.135",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100008,
      "eanCode": "8906070431275",
      "itemCode": "CR127",
      "hsnCode": "10063010",
      "productNameEn": "Black Rice",
      "productNameHi": "Kala Chawal",
      "packingSize": "0.500",
      "mrp": "195.00",
      "shelfLife": "18",
      "usp": "0.39",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100009,
      "eanCode": "8906070431282",
      "itemCode": "CR128",
      "hsnCode": "10063010",
      "productNameEn": "Red Rice",
      "productNameHi": "Lal Chawal",
      "packingSize": "0.500",
      "mrp": "135.00",
      "shelfLife": "18",
      "usp": "0.27",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100010,
      "eanCode": "8906070431053",
      "itemCode": "CR105",
      "hsnCode": "19041020",
      "productNameEn": "Rice Poha",
      "productNameHi": "Poha",
      "packingSize": "0.500",
      "mrp": "80.00",
      "shelfLife": "12",
      "usp": "0.16",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100011,
      "eanCode": "8906070434481",
      "itemCode": "CR448",
      "hsnCode": "19041020",
      "productNameEn": "Puffed Rice",
      "productNameHi": "Murmure",
      "packingSize": "0.100",
      "mrp": "35.00",
      "shelfLife": "12",
      "usp": "0.35",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100012,
      "eanCode": "8906070434443",
      "itemCode": "CR444",
      "hsnCode": "19041020",
      "productNameEn": "Puffed Rice",
      "productNameHi": "Murmure",
      "packingSize": "0.200",
      "mrp": "55.00",
      "shelfLife": "12",
      "usp": "0.275",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100013,
      "eanCode": "8906070431367",
      "itemCode": "CR136",
      "hsnCode": "19041020",
      "productNameEn": "Red Rice Poha",
      "productNameHi": "Lal Poha",
      "packingSize": "0.500",
      "mrp": "105.00",
      "shelfLife": "12",
      "usp": "0.21",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100014,
      "eanCode": "8906070431206",
      "itemCode": "CN120",
      "hsnCode": "10081090",
      "productNameEn": "Amaranth",
      "productNameHi": "Amaranth (Chaulai)",
      "packingSize": "0.500",
      "mrp": "185.00",
      "shelfLife": "18",
      "usp": "0.37",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100015,
      "eanCode": "8906070431411",
      "itemCode": "CN141",
      "hsnCode": "10081090",
      "productNameEn": "Ragi Whole",
      "productNameHi": "Ragi",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "18",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100016,
      "eanCode": "8906070431480",
      "itemCode": "CN148",
      "hsnCode": "10081090",
      "productNameEn": "Foxtail Millet",
      "productNameHi": "Kangni Ke Chabal",
      "packingSize": "0.500",
      "mrp": "140.00",
      "shelfLife": "12",
      "usp": "0.28",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100017,
      "eanCode": "8906070431497",
      "itemCode": "CN149",
      "hsnCode": "10081090",
      "productNameEn": "Kodo Millet",
      "productNameHi": "Kodo Millet",
      "packingSize": "0.500",
      "mrp": "130.00",
      "shelfLife": "12",
      "usp": "0.26",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100018,
      "eanCode": "8906070431961",
      "itemCode": "CN196",
      "hsnCode": "10081090",
      "productNameEn": "Barnyard Millet",
      "productNameHi": "Samak Ke Chawal",
      "packingSize": "0.500",
      "mrp": "135.00",
      "shelfLife": "12",
      "usp": "0.27",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100019,
      "eanCode": "8906070431466",
      "itemCode": "CN146",
      "hsnCode": "11042300",
      "productNameEn": "Buckwheat (Hulled)",
      "productNameHi": "Kuttu Giri",
      "packingSize": "0.500",
      "mrp": "175.00",
      "shelfLife": "9",
      "usp": "0.35",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100020,
      "eanCode": "8906070437345",
      "itemCode": "CN734",
      "hsnCode": "10081090",
      "productNameEn": "Little Millet",
      "productNameHi": "Kutki",
      "packingSize": "0.500",
      "mrp": "140.00",
      "shelfLife": "12",
      "usp": "0.28",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100021,
      "eanCode": "8906070437338",
      "itemCode": "CN733",
      "hsnCode": "10081090",
      "productNameEn": "Proso Millet",
      "productNameHi": "Proso Millet",
      "packingSize": "0.500",
      "mrp": "140.00",
      "shelfLife": "12",
      "usp": "0.28",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100022,
      "eanCode": "8906070437321",
      "itemCode": "CN732",
      "hsnCode": "10081090",
      "productNameEn": "Brown Top Millet",
      "productNameHi": "Brown Top Millet",
      "packingSize": "0.500",
      "mrp": "255.00",
      "shelfLife": "12",
      "usp": "0.51",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100023,
      "eanCode": "8906070431978",
      "itemCode": "CN197",
      "hsnCode": "10081090",
      "productNameEn": "Quinoa White",
      "productNameHi": "Quinoa",
      "packingSize": "0.500",
      "mrp": "245.00",
      "shelfLife": "12",
      "usp": "0.49",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100024,
      "eanCode": "8906070431985",
      "itemCode": "CN198",
      "hsnCode": "10081090",
      "productNameEn": "Quinoa Red",
      "productNameHi": "Quinoa",
      "packingSize": "0.500",
      "mrp": "395.00",
      "shelfLife": "12",
      "usp": "0.79",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100025,
      "eanCode": "8906070435686",
      "itemCode": "CN568",
      "hsnCode": "10081090",
      "productNameEn": "Pearl Millet (Bajra) Whole",
      "productNameHi": "Bajra Sabut",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "12",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100026,
      "eanCode": "8906070435693",
      "itemCode": "CN569",
      "hsnCode": "10081090",
      "productNameEn": "Sorghum (Jowar) Whole",
      "productNameHi": "Jowar Sabut",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "12",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100027,
      "eanCode": "8906070431473",
      "itemCode": "CN147",
      "hsnCode": "10030090",
      "productNameEn": "Barley (Pearled)",
      "productNameHi": "Jau",
      "packingSize": "0.500",
      "mrp": "125.00",
      "shelfLife": "6",
      "usp": "0.25",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100028,
      "eanCode": "8906070431558",
      "itemCode": "CW155",
      "hsnCode": "11031120",
      "productNameEn": "Dalia Wheat",
      "productNameHi": "Gehun Dalia",
      "packingSize": "0.500",
      "mrp": "70.00",
      "shelfLife": "9",
      "usp": "0.14",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100029,
      "eanCode": "8906070434887",
      "itemCode": "CF488",
      "hsnCode": "11021000",
      "productNameEn": "Quinoa White Flour",
      "productNameHi": "Quinoa White Aata",
      "packingSize": "0.500",
      "mrp": "255.00",
      "shelfLife": "12",
      "usp": "0.51",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100030,
      "eanCode": "8906070436829",
      "itemCode": "CF682",
      "hsnCode": "11021000",
      "productNameEn": "Ragi Flour",
      "productNameHi": "Ragi Flour",
      "packingSize": "1.500",
      "mrp": "",
      "shelfLife": "9",
      "usp": "0",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100031,
      "eanCode": "8906070433712",
      "itemCode": "CF371",
      "hsnCode": "11021000",
      "productNameEn": "Gluten Free Chapati Flour",
      "productNameHi": "Gluten Free Chapati Flour",
      "packingSize": "1.500",
      "mrp": "335.00",
      "shelfLife": "12",
      "usp": "0.223333333",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100032,
      "eanCode": "8906070431343",
      "itemCode": "CF134",
      "hsnCode": "11010000",
      "productNameEn": "Whole Wheat Chakki Flour",
      "productNameHi": "Sampurn Gehun Chakki Aata",
      "packingSize": "5.000",
      "mrp": "390.00",
      "shelfLife": "6",
      "usp": "0.078",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100033,
      "eanCode": "8906070431862",
      "itemCode": "CF186",
      "hsnCode": "11010000",
      "productNameEn": "Whole Wheat Chakki Flour",
      "productNameHi": "Sampurn Gehun Chakki Aata",
      "packingSize": "1.000",
      "mrp": "85.00",
      "shelfLife": "6",
      "usp": "0.085",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100034,
      "eanCode": "8906070436317",
      "itemCode": "CF631",
      "hsnCode": "11029090",
      "productNameEn": "Millet Enriched Chapati Flour (Calcium & Iron Rich)",
      "productNameHi": "Millet Enriched Chapati Flour (Calcium & Iron Rich)",
      "packingSize": "1.500",
      "mrp": "190.00",
      "shelfLife": "6",
      "usp": "0.126666667",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100035,
      "eanCode": "8906070431404",
      "itemCode": "CF140",
      "hsnCode": "11021000",
      "productNameEn": "Ragi Flour",
      "productNameHi": "Ragi Flour",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "9",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100036,
      "eanCode": "8906070431350",
      "itemCode": "CF135",
      "hsnCode": "11029090",
      "productNameEn": "9 Grains Flour",
      "productNameHi": "Navratna Aata",
      "packingSize": "1.000",
      "mrp": "155.00",
      "shelfLife": "9",
      "usp": "0.155",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100037,
      "eanCode": "8906070432913",
      "itemCode": "CF291",
      "hsnCode": "11029090",
      "productNameEn": "6 Grains Flour",
      "productNameHi": "Navratna Aata",
      "packingSize": "5.000",
      "mrp": "465.00",
      "shelfLife": "9",
      "usp": "0.093",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100038,
      "eanCode": "8906070431817",
      "itemCode": "CF181",
      "hsnCode": "11021000",
      "productNameEn": "Rice Flour",
      "productNameHi": "Chawal Aata",
      "packingSize": "0.500",
      "mrp": "70.00",
      "shelfLife": "9",
      "usp": "0.14",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100039,
      "eanCode": "8906070436843",
      "itemCode": "CF684",
      "hsnCode": "11021000",
      "productNameEn": "Jowar Flour",
      "productNameHi": "Jowar Aata",
      "packingSize": "1.500",
      "mrp": "225.00",
      "shelfLife": "9",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100040,
      "eanCode": "8906070431305",
      "itemCode": "CF130",
      "hsnCode": "11062010",
      "productNameEn": "Chana Besan",
      "productNameHi": "Chana Besan",
      "packingSize": "0.500",
      "mrp": "120.00",
      "shelfLife": "9",
      "usp": "0.24",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100041,
      "eanCode": "8906070431237",
      "itemCode": "CF123",
      "hsnCode": "11021000",
      "productNameEn": "Amaranth Flour",
      "productNameHi": "Amaranth (Chaulai) Aata",
      "packingSize": "0.500",
      "mrp": "190.00",
      "shelfLife": "9",
      "usp": "0.38",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100042,
      "eanCode": "8906070431428",
      "itemCode": "CF142",
      "hsnCode": "11022000",
      "productNameEn": "Maize Flour",
      "productNameHi": "Makki Aata",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "6",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100043,
      "eanCode": "8906070433583",
      "itemCode": "CF358",
      "hsnCode": "11022000",
      "productNameEn": "Maize Flour",
      "productNameHi": "Makki Aata",
      "packingSize": "0.900",
      "mrp": "115.00",
      "shelfLife": "6",
      "usp": "0.127777778",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100044,
      "eanCode": "8906070431459",
      "itemCode": "CF145",
      "hsnCode": "11021000",
      "productNameEn": "Buckwheat Flour",
      "productNameHi": "Kuttu Aata",
      "packingSize": "0.500",
      "mrp": "165.00",
      "shelfLife": "6",
      "usp": "0.33",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100045,
      "eanCode": "8906070431268",
      "itemCode": "CF126",
      "hsnCode": "11021000",
      "productNameEn": "Jowar Flour",
      "productNameHi": "Jowar Aata",
      "packingSize": "0.500",
      "mrp": "80.00",
      "shelfLife": "9",
      "usp": "0.16",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100046,
      "eanCode": "8906070436881",
      "itemCode": "CF688",
      "hsnCode": "11021000",
      "productNameEn": "Jowar Flour",
      "productNameHi": "Jowar Aata",
      "packingSize": "0.900",
      "mrp": "135.00",
      "shelfLife": "9",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100047,
      "eanCode": "8906070431299",
      "itemCode": "CF129",
      "hsnCode": "11029000",
      "productNameEn": "Barley Flour",
      "productNameHi": "Jau Aata",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "9",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100048,
      "eanCode": "8906070436898",
      "itemCode": "CF689",
      "hsnCode": "11029000",
      "productNameEn": "Barley Flour",
      "productNameHi": "Jau Aata",
      "packingSize": "0.400",
      "mrp": "65.00",
      "shelfLife": "9",
      "usp": "0.1625",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100049,
      "eanCode": "8906070431879",
      "itemCode": "CF187",
      "hsnCode": "11021000",
      "productNameEn": "Bajra Flour",
      "productNameHi": "Bajra Aata",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "6",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100050,
      "eanCode": "8906070436904",
      "itemCode": "CF690",
      "hsnCode": "11021000",
      "productNameEn": "Bajra Flour",
      "productNameHi": "Bajra Aata",
      "packingSize": "1.500",
      "mrp": "",
      "shelfLife": "6",
      "usp": "0",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100051,
      "eanCode": "8906070432920",
      "itemCode": "CF292",
      "hsnCode": "11062010",
      "productNameEn": "Chana Flour",
      "productNameHi": "Chana Aata",
      "packingSize": "0.500",
      "mrp": "115.00",
      "shelfLife": "9",
      "usp": "0.23",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100052,
      "eanCode": "8906070431381",
      "itemCode": "CF138",
      "hsnCode": "11031120",
      "productNameEn": "Semolina (Suji)",
      "productNameHi": "Suji",
      "packingSize": "0.500",
      "mrp": "70.00",
      "shelfLife": "6",
      "usp": "0.14",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100053,
      "eanCode": "8906070439554",
      "itemCode": "CF955",
      "hsnCode": "11031120",
      "productNameEn": "Roasted Semolina (Suji)",
      "productNameHi": "Bhuni Suji",
      "packingSize": "0.500",
      "mrp": "75.00",
      "shelfLife": "9",
      "usp": "0.15",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100054,
      "eanCode": "8906070431398",
      "itemCode": "CF139",
      "hsnCode": "11010000",
      "productNameEn": "Refined Wheat Flour (Maida)",
      "productNameHi": "Maida",
      "packingSize": "0.500",
      "mrp": "65.00",
      "shelfLife": "6",
      "usp": "0.13",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100055,
      "eanCode": "8906070437963",
      "itemCode": "CF796",
      "hsnCode": "11062010",
      "productNameEn": "Jeera Sattu",
      "productNameHi": "Jeera Sattu",
      "packingSize": "0.500",
      "mrp": "135.00",
      "shelfLife": "9",
      "usp": "0.27",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100056,
      "eanCode": "8906070434672",
      "itemCode": "CF467",
      "hsnCode": "11062010",
      "productNameEn": "Chana Sattu",
      "productNameHi": "Chana Sattu",
      "packingSize": "0.500",
      "mrp": "125.00",
      "shelfLife": "9",
      "usp": "0.25",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100057,
      "eanCode": "8906070434429",
      "itemCode": "CN442",
      "hsnCode": "10031000",
      "productNameEn": "Barley Dalia",
      "productNameHi": "Jau Dalia",
      "packingSize": "0.500",
      "mrp": "90.00",
      "shelfLife": "9",
      "usp": "0.18",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100058,
      "eanCode": "8906070433828",
      "itemCode": "CF382",
      "hsnCode": "11021000",
      "productNameEn": "Barnyard Millet Flour",
      "productNameHi": "Samak Ke Chawal Aata",
      "packingSize": "0.500",
      "mrp": "140.00",
      "shelfLife": "9",
      "usp": "0.28",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100059,
      "eanCode": "8906070434412",
      "itemCode": "CF441",
      "hsnCode": "11021000",
      "productNameEn": "Foxtail Millet Flour",
      "productNameHi": "Kangni Ke Chabal Aata",
      "packingSize": "0.500",
      "mrp": "130.00",
      "shelfLife": "6",
      "usp": "0.26",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100060,
      "eanCode": "8906070434467",
      "itemCode": "CN446",
      "hsnCode": "11021000",
      "productNameEn": "Kodo Millet Flour",
      "productNameHi": "Kodo Millet Aata",
      "packingSize": "0.500",
      "mrp": "135.00",
      "shelfLife": "6",
      "usp": "0.27",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100061,
      "eanCode": "8906070434689",
      "itemCode": "CW468",
      "hsnCode": "23023000",
      "productNameEn": "Wheat Bran",
      "productNameHi": "Wheat Bran",
      "packingSize": "0.500",
      "mrp": "80.00",
      "shelfLife": "6",
      "usp": "0.16",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100062,
      "eanCode": "8906070437390",
      "itemCode": "CF739",
      "hsnCode": "21069099",
      "productNameEn": "Barley Sattu",
      "productNameHi": "Jau Sattu",
      "packingSize": "0.500",
      "mrp": "135.00",
      "shelfLife": "9",
      "usp": "0.27",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100063,
      "eanCode": "8906070435549",
      "itemCode": "CF554",
      "hsnCode": "11021000",
      "productNameEn": "Proso Millet Flour",
      "productNameHi": "Proso Millet Flour",
      "packingSize": "0.500",
      "mrp": "140.00",
      "shelfLife": "9",
      "usp": "0.28",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100064,
      "eanCode": "8906070435563",
      "itemCode": "CF556",
      "hsnCode": "11021000",
      "productNameEn": "Brown Top Millet Flour",
      "productNameHi": "Brown Top Millet Flour",
      "packingSize": "0.500",
      "mrp": "255.00",
      "shelfLife": "9",
      "usp": "0.51",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100065,
      "eanCode": "8906070431848",
      "itemCode": "CN184",
      "hsnCode": "11041200",
      "productNameEn": "Oats Flakes",
      "productNameHi": "Oats Flakes",
      "packingSize": "0.500",
      "mrp": "195.00",
      "shelfLife": "9",
      "usp": "0.39",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100066,
      "eanCode": "8906070437000",
      "itemCode": "CF700",
      "hsnCode": "12081000",
      "productNameEn": "Soyabean White Flour",
      "productNameHi": "Soyabean Aata",
      "packingSize": "0.500",
      "mrp": "130.00",
      "shelfLife": "",
      "usp": "0.26",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100067,
      "eanCode": "8906070431800",
      "itemCode": "CF180",
      "hsnCode": "11021000",
      "productNameEn": "Oats Flour",
      "productNameHi": "Oats Flour",
      "packingSize": "0.500",
      "mrp": "195.00",
      "shelfLife": "6",
      "usp": "0.39",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100068,
      "eanCode": "8906070436997",
      "itemCode": "CF699",
      "hsnCode": "11021000",
      "productNameEn": "Oats Flour",
      "productNameHi": "Oats Flour",
      "packingSize": "0.400",
      "mrp": "165.00",
      "shelfLife": "6",
      "usp": "0.4125",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100069,
      "eanCode": "8906070431107",
      "itemCode": "PP110",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Chitra (Joshimath)",
      "productNameHi": "Rajma Chitra (Joshimath)",
      "packingSize": "0.500",
      "mrp": "280.00",
      "shelfLife": "12",
      "usp": "0.56",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100070,
      "eanCode": "8906070431114",
      "itemCode": "PP111",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Chitra (Joshimath)",
      "productNameHi": "Rajma Chitra (Joshimath)",
      "packingSize": "1.000",
      "mrp": "550.00",
      "shelfLife": "12",
      "usp": "0.55",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100071,
      "eanCode": "8906070434634",
      "itemCode": "PP463",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Chitra White",
      "productNameHi": "Rajma Chitra (Safed)",
      "packingSize": "0.500",
      "mrp": "180.00",
      "shelfLife": "12",
      "usp": "0.36",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100072,
      "eanCode": "8906070432760",
      "itemCode": "PP276",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Chitra White",
      "productNameHi": "Rajma Chitra (Safed)",
      "packingSize": "1.000",
      "mrp": "355.00",
      "shelfLife": "12",
      "usp": "0.355",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100073,
      "eanCode": "8906070431121",
      "itemCode": "PP112",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Harshil",
      "productNameHi": "Rajma Harshil",
      "packingSize": "0.500",
      "mrp": "280.00",
      "shelfLife": "12",
      "usp": "0.56",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100074,
      "eanCode": "8906070431138",
      "itemCode": "PP113",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Harshil",
      "productNameHi": "Rajma Harshil",
      "packingSize": "1.000",
      "mrp": "550.00",
      "shelfLife": "12",
      "usp": "0.55",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },
  {
      "id": 100075,
      "eanCode": "8906070431145",
      "itemCode": "PP114",
      "hsnCode": "07133300",
      "productNameEn": "Rajma Red",
      "productNameHi": "Red Rajma",
      "packingSize": "0.500",
      "mrp": "160.00",
      "shelfLife": "12",
      "usp": "0.32",
      "pouchBack": "Image/file",
      "pouchFront": "Image/file",
      "label": "Image/file"
  },

  {
    "id": 100076,
    "eanCode": "8906070431152",
    "itemCode": "PP115",
    "hsnCode": "07133300",
    "productNameEn": "Rajma Red",
    "productNameHi": "Red Rajma",
    "packingSize": "1.000",
    "mrp": "355.00",
    "shelfLife": "12",
    "usp": "0.355",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100077,
    "eanCode": "8906070431176",
    "itemCode": "PP117",
    "hsnCode": "07133300",
    "productNameEn": "Rajma Jammu",
    "productNameHi": "Rajma Jammu",
    "packingSize": "0.500",
    "mrp": "165.00",
    "shelfLife": "12",
    "usp": "0.33",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100078,
    "eanCode": "8906070431183",
    "itemCode": "PP118",
    "hsnCode": "07133300",
    "productNameEn": "Rajma Jammu",
    "productNameHi": "Rajma Jammu",
    "packingSize": "1.000",
    "mrp": "315.00",
    "shelfLife": "12",
    "usp": "0.315",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100079,
    "eanCode": "8906070431527",
    "itemCode": "PP152",
    "hsnCode": "07132000",
    "productNameEn": "Chana Whole (Kala Chana)",
    "productNameHi": "Kala Chana",
    "packingSize": "0.500",
    "mrp": "115.00",
    "shelfLife": "12",
    "usp": "0.23",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100080,
    "eanCode": "8906070431534",
    "itemCode": "PP153",
    "hsnCode": "07132000",
    "productNameEn": "Chana Whole (Kala Chana)",
    "productNameHi": "Kala Chana",
    "packingSize": "1.000",
    "mrp": "225.00",
    "shelfLife": "12",
    "usp": "0.225",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100081,
    "eanCode": "8906070431329",
    "itemCode": "PP132",
    "hsnCode": "07139010",
    "productNameEn": "Chana Dal",
    "productNameHi": "Chana Dal",
    "packingSize": "0.500",
    "mrp": "115.00",
    "shelfLife": "12",
    "usp": "0.23",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100082,
    "eanCode": "8906070431336",
    "itemCode": "PP133",
    "hsnCode": "07139010",
    "productNameEn": "Chana Dal",
    "productNameHi": "Chana Dal",
    "packingSize": "1.000",
    "mrp": "225.00",
    "shelfLife": "12",
    "usp": "0.225",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100083,
    "eanCode": "8906070431503",
    "itemCode": "PP150",
    "hsnCode": "07132000",
    "productNameEn": "Chickpea Kabuli",
    "productNameHi": "Kabuli Chana",
    "packingSize": "0.500",
    "mrp": "190.00",
    "shelfLife": "12",
    "usp": "0.38",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100084,
    "eanCode": "8906070431510",
    "itemCode": "PP151",
    "hsnCode": "07132000",
    "productNameEn": "Chickpea Kabuli",
    "productNameHi": "Kabuli Chana",
    "packingSize": "1.000",
    "mrp": "375.00",
    "shelfLife": "12",
    "usp": "0.375",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100085,
    "eanCode": "8906070431626",
    "itemCode": "PP162",
    "hsnCode": "07139010",
    "productNameEn": "Tur Dal",
    "productNameHi": "Tur Dal",
    "packingSize": "0.500",
    "mrp": "180.00",
    "shelfLife": "12",
    "usp": "0.36",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100086,
    "eanCode": "8906070431633",
    "itemCode": "PP163",
    "hsnCode": "07139010",
    "productNameEn": "Tur Dal",
    "productNameHi": "Tur Dal",
    "packingSize": "1.000",
    "mrp": "355.00",
    "shelfLife": "12",
    "usp": "0.355",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100087,
    "eanCode": "8906070431565",
    "itemCode": "PP156",
    "hsnCode": "07133100",
    "productNameEn": "Urad Whole (Black Dal)",
    "productNameHi": "Urad  (Kali Dal)",
    "packingSize": "0.500",
    "mrp": "155.00",
    "shelfLife": "12",
    "usp": "0.31",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100088,
    "eanCode": "8906070431572",
    "itemCode": "PP157",
    "hsnCode": "07133100",
    "productNameEn": "Urad Whole (Black Dal)",
    "productNameHi": "Urad  (Kali Dal)",
    "packingSize": "1.000",
    "mrp": "305.00",
    "shelfLife": "12",
    "usp": "0.305",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100089,
    "eanCode": "8906070431763",
    "itemCode": "PP176",
    "hsnCode": "07139010",
    "productNameEn": "Urad Split Chhilka",
    "productNameHi": "Urad Chhilka",
    "packingSize": "0.500",
    "mrp": "155.00",
    "shelfLife": "12",
    "usp": "0.31",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100090,
    "eanCode": "8906070431770",
    "itemCode": "PP177",
    "hsnCode": "07139010",
    "productNameEn": "Urad Split Chhilka",
    "productNameHi": "Urad Chhilka",
    "packingSize": "1.000",
    "mrp": "305.00",
    "shelfLife": "12",
    "usp": "0.305",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100091,
    "eanCode": "8906070431602",
    "itemCode": "PP160",
    "hsnCode": "07133100",
    "productNameEn": "Urad Dal Dhuli",
    "productNameHi": "Urad Dhuli",
    "packingSize": "0.500",
    "mrp": "155.00",
    "shelfLife": "12",
    "usp": "0.31",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100092,
    "eanCode": "8906070431619",
    "itemCode": "PP161",
    "hsnCode": "07133100",
    "productNameEn": "Urad Dal Dhuli",
    "productNameHi": "Urad Dhuli",
    "packingSize": "1.000",
    "mrp": "290.00",
    "shelfLife": "12",
    "usp": "0.29",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100093,
    "eanCode": "8906070431589",
    "itemCode": "PP158",
    "hsnCode": "07134000",
    "productNameEn": "Masoor Whole",
    "productNameHi": "Kali Masoor",
    "packingSize": "0.500",
    "mrp": "130.00",
    "shelfLife": "12",
    "usp": "0.26",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100094,
    "eanCode": "8906070431596",
    "itemCode": "PP159",
    "hsnCode": "07134000",
    "productNameEn": "Masoor Whole",
    "productNameHi": "Kali Masoor",
    "packingSize": "1.000",
    "mrp": "255.00",
    "shelfLife": "12",
    "usp": "0.255",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100095,
    "eanCode": "8906070431701",
    "itemCode": "PP170",
    "hsnCode": "07134000",
    "productNameEn": "Masoor Malka Mogar",
    "productNameHi": "Masoor Malka Lal",
    "packingSize": "0.500",
    "mrp": "130.00",
    "shelfLife": "12",
    "usp": "0.26",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100096,
    "eanCode": "8906070431718",
    "itemCode": "PP171",
    "hsnCode": "07134000",
    "productNameEn": "Masoor Malka Mogar",
    "productNameHi": "Masoor Malka Lal",
    "packingSize": "1.000",
    "mrp": "255.00",
    "shelfLife": "12",
    "usp": "0.255",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100097,
    "eanCode": "8906070431749",
    "itemCode": "PP174",
    "hsnCode": "07139010",
    "productNameEn": "Masoor Malka Split",
    "productNameHi": "Masoor Malka Dal",
    "packingSize": "0.500",
    "mrp": "130.00",
    "shelfLife": "12",
    "usp": "0.26",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100098,
    "eanCode": "8906070431756",
    "itemCode": "PP175",
    "hsnCode": "07139010",
    "productNameEn": "Masoor Malka Split",
    "productNameHi": "Masoor Malka Dal",
    "packingSize": "1.000",
    "mrp": "255.00",
    "shelfLife": "12",
    "usp": "0.255",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100099,
    "eanCode": "8906070431664",
    "itemCode": "PP166",
    "hsnCode": "07133100",
    "productNameEn": "Moong Whole",
    "productNameHi": "Moong Sabut",
    "packingSize": "0.500",
    "mrp": "140.00",
    "shelfLife": "12",
    "usp": "0.28",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100100,
    "eanCode": "8906070431671",
    "itemCode": "PP167",
    "hsnCode": "07133100",
    "productNameEn": "Moong Whole",
    "productNameHi": "Moong Sabut",
    "packingSize": "1.000",
    "mrp": "275.00",
    "shelfLife": "12",
    "usp": "0.275",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100101,
    "eanCode": "8906070431725",
    "itemCode": "PP172",
    "hsnCode": "07133100",
    "productNameEn": "Moong Split Chhilka",
    "productNameHi": "Moong Chhilka",
    "packingSize": "0.500",
    "mrp": "140.00",
    "shelfLife": "12",
    "usp": "0.28",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100102,
    "eanCode": "8906070431732",
    "itemCode": "PP173",
    "hsnCode": "07133100",
    "productNameEn": "Moong Split Chhilka",
    "productNameHi": "Moong Chhilka",
    "packingSize": "1.000",
    "mrp": "275.00",
    "shelfLife": "12",
    "usp": "0.275",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100103,
    "eanCode": "8906070431640",
    "itemCode": "PP164",
    "hsnCode": "07133990",
    "productNameEn": "Moong Dal Mogar",
    "productNameHi": "Moong Dhuli Dal",
    "packingSize": "0.500",
    "mrp": "155.00",
    "shelfLife": "12",
    "usp": "0.31",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100104,
    "eanCode": "8906070431657",
    "itemCode": "PP165",
    "hsnCode": "07133990",
    "productNameEn": "Moong Dal Mogar",
    "productNameHi": "Moong Dhuli Dal",
    "packingSize": "1.000",
    "mrp": "305.00",
    "shelfLife": "12",
    "usp": "0.305",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100105,
    "eanCode": "8906070431688",
    "itemCode": "PP168",
    "hsnCode": "07133500",
    "productNameEn": "Cowpea White",
    "productNameHi": "Lobia Safed",
    "packingSize": "0.500",
    "mrp": "125.00",
    "shelfLife": "12",
    "usp": "0.25",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100106,
    "eanCode": "8906070431695",
    "itemCode": "PP169",
    "hsnCode": "07133500",
    "productNameEn": "Cowpea White",
    "productNameHi": "Lobia Safed",
    "packingSize": "1.000",
    "mrp": "245.00",
    "shelfLife": "12",
    "usp": "0.245",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100107,
    "eanCode": "8906070434627",
    "itemCode": "PP462",
    "hsnCode": "07133500",
    "productNameEn": "Cowpea Red Whole",
    "productNameHi": "Lobia Lal",
    "packingSize": "0.500",
    "mrp": "135.00",
    "shelfLife": "12",
    "usp": "0.27",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100108,
    "eanCode": "8906070434641",
    "itemCode": "PP464",
    "hsnCode": "07139010",
    "productNameEn": "Kulthi Dal",
    "productNameHi": "Kulthi Dal",
    "packingSize": "0.500",
    "mrp": "175.00",
    "shelfLife": "12",
    "usp": "0.35",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100109,
    "eanCode": "8906070434658",
    "itemCode": "PP465",
    "hsnCode": "07139010",
    "productNameEn": "Moth Whole",
    "productNameHi": "Moth Sabut",
    "packingSize": "0.500",
    "mrp": "145.00",
    "shelfLife": "12",
    "usp": "0.29",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100110,
    "eanCode": "8906070431909",
    "itemCode": "PP190",
    "hsnCode": "12010010",
    "productNameEn": "Soyabean White",
    "productNameHi": "Soyabean",
    "packingSize": "0.500",
    "mrp": "110.00",
    "shelfLife": "12",
    "usp": "0.22",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100111,
    "eanCode": "8906070431916",
    "itemCode": "PP191",
    "hsnCode": "12010010",
    "productNameEn": "Soyabean Black (Bhat Ki Dal)",
    "productNameHi": "Soyabean Kala (Bhat Ki Dal)",
    "packingSize": "0.500",
    "mrp": "135.00",
    "shelfLife": "12",
    "usp": "0.27",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100112,
    "eanCode": "8906070431930",
    "itemCode": "PP193",
    "hsnCode": "07139010",
    "productNameEn": "Navrangi Dal",
    "productNameHi": "Navrangi Dal",
    "packingSize": "0.500",
    "mrp": "185.00",
    "shelfLife": "12",
    "usp": "0.37",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100113,
    "eanCode": "8906070431947",
    "itemCode": "PP194",
    "hsnCode": "07139010",
    "productNameEn": "Mix Dal",
    "productNameHi": "Dal Panchrangi",
    "packingSize": "0.500",
    "mrp": "145.00",
    "shelfLife": "12",
    "usp": "0.29",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100114,
    "eanCode": "8906070431954",
    "itemCode": "PP195",
    "hsnCode": "07139010",
    "productNameEn": "Mix Dal",
    "productNameHi": "Dal Panchrangi",
    "packingSize": "1.000",
    "mrp": "280.00",
    "shelfLife": "12",
    "usp": "0.28",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100115,
    "eanCode": "8906070433705",
    "itemCode": "PP370",
    "hsnCode": "07139010",
    "productNameEn": "Urad Gota",
    "productNameHi": "Urad Gota",
    "packingSize": "0.500",
    "mrp": "155.00",
    "shelfLife": "12",
    "usp": "0.31",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100116,
    "eanCode": "8906070433019",
    "itemCode": "BT301",
    "hsnCode": "09023010",
    "productNameEn": "Black Tea (Full Leaves)",
    "productNameHi": "Black Tea (Full Leaves)",
    "packingSize": "0.050",
    "mrp": "225.00",
    "shelfLife": "24",
    "usp": "4.5",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100117,
    "eanCode": "8906070433002",
    "itemCode": "BT300",
    "hsnCode": "09021010",
    "productNameEn": "Green Tea (Full Leaves)",
    "productNameHi": "Green Tea (Full Leaves)",
    "packingSize": "0.050",
    "mrp": "225.00",
    "shelfLife": "24",
    "usp": "4.5",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100118,
    "eanCode": "8906070433316",
    "itemCode": "BT331",
    "hsnCode": "09021020",
    "productNameEn": "Tulsi-Green Tea TEA BAGS",
    "productNameHi": "Tulsi-Green Tea",
    "packingSize": "20.000",
    "mrp": "315.00",
    "shelfLife": "24",
    "usp": "0.01575",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100119,
    "eanCode": "8906070433330",
    "itemCode": "BT333",
    "hsnCode": "09021020",
    "productNameEn": "Lemon Green Tea TEA BAGS",
    "productNameHi": "Lemon Green Tea",
    "packingSize": "20.000",
    "mrp": "315.00",
    "shelfLife": "24",
    "usp": "0.01575",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100120,
    "eanCode": "8906070433354",
    "itemCode": "BT335",
    "hsnCode": "09021020",
    "productNameEn": "Ginger Tulsi Tea TEA BAGS",
    "productNameHi": "Ginger Tulsi Tea",
    "packingSize": "20.000",
    "mrp": "315.00",
    "shelfLife": "24",
    "usp": "0.01575",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},
{
    "id": 100121,
    "eanCode": "8906070433378",
    "itemCode": "BT337",
    "hsnCode": "09021020",
    "productNameEn": "Kashmiri Kahwa Tea TEA BAGS",
    "productNameHi": "Kashmiri Kahwa Tea",
    "packingSize": "20.000",
    "mrp": "315.00",
    "shelfLife": "24",
    "usp": "0.01575",
    "pouchBack": "Image/file",
    "pouchFront": "Image/file",
    "label": "Image/file"
},

{
  "id": 100122,
  "eanCode": "8906070433415",
  "itemCode": "BT341",
  "hsnCode": "09021020",
  "productNameEn": "Masala Tea TEA BAGS",
  "productNameHi": "Masala Tea",
  "packingSize": "20.000",
  "mrp": "315.00",
  "shelfLife": "24",
  "usp": "0.01575",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100123,
  "eanCode": "8906070433217",
  "itemCode": "BT321",
  "hsnCode": "09021020",
  "productNameEn": "Masala Tea",
  "productNameHi": "Masala Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100124,
  "eanCode": "8906070433118",
  "itemCode": "BT311",
  "hsnCode": "09021020",
  "productNameEn": "Tulsi-Green Tea",
  "productNameHi": "Tulsi-Green Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100125,
  "eanCode": "8906070433132",
  "itemCode": "BT313",
  "hsnCode": "09021020",
  "productNameEn": "Lemon Green Tea",
  "productNameHi": "Lemon Green Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100126,
  "eanCode": "8906070433156",
  "itemCode": "BT315",
  "hsnCode": "09021020",
  "productNameEn": "Ginger Tulsi Tea",
  "productNameHi": "Ginger Tulsi Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100127,
  "eanCode": "8906070433170",
  "itemCode": "BT317",
  "hsnCode": "09021020",
  "productNameEn": "Kashmiri Kahwa Tea",
  "productNameHi": "Kashmiri Kahwa Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100128,
  "eanCode": "8906070433446",
  "itemCode": "BT344",
  "hsnCode": "09021020",
  "productNameEn": "Morninga Tea",
  "productNameHi": "Morninga Tea",
  "packingSize": "0.075",
  "mrp": "245.00",
  "shelfLife": "24",
  "usp": "3.266666667",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100129,
  "eanCode": "8906070433613",
  "itemCode": "BC361",
  "hsnCode": "09011113",
  "productNameEn": "Green Coffee",
  "productNameHi": "Green Coffee",
  "packingSize": "0.250",
  "mrp": "395.00",
  "shelfLife": "24",
  "usp": "1.58",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100130,
  "eanCode": "8906070433620",
  "itemCode": "BC362",
  "hsnCode": "09012190",
  "productNameEn": "Filter Coffee",
  "productNameHi": "Filter Coffee",
  "packingSize": "0.100",
  "mrp": "265.00",
  "shelfLife": "24",
  "usp": "2.65",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100131,
  "eanCode": "8906070433651",
  "itemCode": "BC365",
  "hsnCode": "21011110",
  "productNameEn": "Instant Coffee",
  "productNameHi": "Instant Coffee",
  "packingSize": "0.100",
  "mrp": "495.00",
  "shelfLife": "24",
  "usp": "4.95",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100132,
  "eanCode": "8906070433026",
  "itemCode": "BT302",
  "hsnCode": "09021020",
  "productNameEn": "CTC Tea",
  "productNameHi": "CTC Tea",
  "packingSize": "0.200",
  "mrp": "225.00",
  "shelfLife": "18",
  "usp": "1.125",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100133,
  "eanCode": "8906070432098",
  "itemCode": "SW209",
  "hsnCode": "09109100",
  "productNameEn": "Green Cardamom",
  "productNameHi": "Green Cardamom",
  "packingSize": "0.050",
  "mrp": "395.00",
  "shelfLife": "24",
  "usp": "7.9",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100134,
  "eanCode": "8906070432104",
  "itemCode": "SW210",
  "hsnCode": "09109100",
  "productNameEn": "Clove Whole",
  "productNameHi": "Laung Sabut",
  "packingSize": "0.050",
  "mrp": "195.00",
  "shelfLife": "24",
  "usp": "3.9",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100135,
  "eanCode": "8906070432081",
  "itemCode": "SW208",
  "hsnCode": "09061110",
  "productNameEn": "True Cinnamon Flakes",
  "productNameHi": "Dalchini",
  "packingSize": "0.050",
  "mrp": "80.00",
  "shelfLife": "24",
  "usp": "1.6",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100136,
  "eanCode": "8906070432036",
  "itemCode": "SW203",
  "hsnCode": "09092110",
  "productNameEn": "Cumin (Jeera) Whole",
  "productNameHi": "Jeera Sabut",
  "packingSize": "0.100",
  "mrp": "165.00",
  "shelfLife": "24",
  "usp": "1.65",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100137,
  "eanCode": "8906070432128",
  "itemCode": "SW212",
  "hsnCode": "09109100",
  "productNameEn": "Nutmeg Whole",
  "productNameHi": "Jaiphal",
  "packingSize": "0.050",
  "mrp": "145.00",
  "shelfLife": "24",
  "usp": "2.9",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100138,
  "eanCode": "8906070432043",
  "itemCode": "SW204",
  "hsnCode": "09083110",
  "productNameEn": "Dry Ginger Powder",
  "productNameHi": "Adrak Powder",
  "packingSize": "0.100",
  "mrp": "95.00",
  "shelfLife": "24",
  "usp": "0.95",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100139,
  "eanCode": "8906070432012",
  "itemCode": "SW201",
  "hsnCode": "09093119",
  "productNameEn": "Organic Turmeric Powder",
  "productNameHi": "Haldi Powder",
  "packingSize": "0.100",
  "mrp": "85.00",
  "shelfLife": "12",
  "usp": "0.85",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100140,
  "eanCode": "8906070432029",
  "itemCode": "SW202",
  "hsnCode": "09042219",
  "productNameEn": "Red Chilli Powder",
  "productNameHi": "Laal Mirch Powder",
  "packingSize": "0.100",
  "mrp": "110.00",
  "shelfLife": "12",
  "usp": "1.1",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100141,
  "eanCode": "8906070432050",
  "itemCode": "SW205",
  "hsnCode": "09103030",
  "productNameEn": "Ajwain (Bishop's Weed) Whole",
  "productNameHi": "Ajwain Sabut",
  "packingSize": "0.100",
  "mrp": "85.00",
  "shelfLife": "12",
  "usp": "0.85",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100142,
  "eanCode": "8906070432074",
  "itemCode": "SW207",
  "hsnCode": "09061110",
  "productNameEn": "True Cinnamon Powder",
  "productNameHi": "Dalchini Powder",
  "packingSize": "0.050",
  "mrp": "55.00",
  "shelfLife": "12",
  "usp": "1.1",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100143,
  "eanCode": "8906070431991",
  "itemCode": "SW199",
  "hsnCode": "09093200",
  "productNameEn": "Organic White Pepper Whole",
  "productNameHi": "White Pepper",
  "packingSize": "0.050",
  "mrp": "195.00",
  "shelfLife": "12",
  "usp": "3.9",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100144,
  "eanCode": "8906070432004",
  "itemCode": "SW200",
  "hsnCode": "09041110",
  "productNameEn": "Organic Black Pepper Whole",
  "productNameHi": "Kali Mirch",
  "packingSize": "0.050",
  "mrp": "150.00",
  "shelfLife": "12",
  "usp": "3",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100145,
  "eanCode": "8906070432158",
  "itemCode": "SW215",
  "hsnCode": "09109919",
  "productNameEn": "Organic Fenugreek (Methi) Powder",
  "productNameHi": "Methi Powder",
  "packingSize": "0.050",
  "mrp": "45.00",
  "shelfLife": "24",
  "usp": "0.9",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100146,
  "eanCode": "8906070432141",
  "itemCode": "SW214",
  "hsnCode": "09109919",
  "productNameEn": "Organic Fenugreek (Methi) Whole",
  "productNameHi": "Methi Sabut",
  "packingSize": "0.050",
  "mrp": "35.00",
  "shelfLife": "24",
  "usp": "0.7",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100147,
  "eanCode": "8906070432111",
  "itemCode": "SW211",
  "hsnCode": "09109911",
  "productNameEn": "Mustard Yellow Whole",
  "productNameHi": "Pili Sarson",
  "packingSize": "0.050",
  "mrp": "35.00",
  "shelfLife": "24",
  "usp": "0.7",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100148,
  "eanCode": "8906070432134",
  "itemCode": "SW213",
  "hsnCode": "09109919",
  "productNameEn": "Mustard Brown Whole",
  "productNameHi": "Kali Sarson",
  "packingSize": "0.050",
  "mrp": "30.00",
  "shelfLife": "24",
  "usp": "0.6",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
  "id": 100149,
  "eanCode": "8906070433705",
  "itemCode": "SW370",
  "hsnCode": "09109100",
  "productNameEn": "Black Cardamom",
  "productNameHi": "Kali Elaichi",
  "packingSize": "0.050",
  "mrp": "225.00",
  "shelfLife": "24",
  "usp": "4.5",
  "pouchBack": "Image/file",
  "pouchFront": "Image/file",
  "label": "Image/file"
},
{
"id": 100150,
"eanCode": "8906070432401",
"itemCode": "SB240",
"hsnCode": "09103030",
"productNameEn": "Chole Masala",
"productNameHi": "Chole Masala",
"packingSize": "0.100",
"mrp": "175.00",
"shelfLife": "9",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100151,
"eanCode": "8906070432418",
"itemCode": "SB241",
"hsnCode": "09109100",
"productNameEn": "Chicken Curry Masala",
"productNameHi": "Chicken Curry Masala",
"packingSize": "0.100",
"mrp": "175.00",
"shelfLife": "9",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100152,
"eanCode": "8906070432425",
"itemCode": "SB242",
"hsnCode": "09109100",
"productNameEn": "Mutton Curry Masala",
"productNameHi": "Mutton Curry Masala",
"packingSize": "0.100",
"mrp": "175.00",
"shelfLife": "9",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100153,
"eanCode": "8906070432432",
"itemCode": "SB243",
"hsnCode": "09109100",
"productNameEn": "Biryani Masala",
"productNameHi": "Biryani Masala",
"packingSize": "0.100",
"mrp": "175.00",
"shelfLife": "9",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100154,
"eanCode": "8906070432456",
"itemCode": "SB245",
"hsnCode": "09103030",
"productNameEn": "Egg Curry Powder",
"productNameHi": "Egg Curry Powder",
"packingSize": "0.100",
"mrp": "175.00",
"shelfLife": "9",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100155,
"eanCode": "8906070432715",
"itemCode": "OL271",
"hsnCode": "15141110",
"productNameEn": "Mustard Oil",
"productNameHi": "Sarson Tel",
"packingSize": "1.000",
"mrp": "395.00",
"shelfLife": "9",
"usp": "0.395",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100156,
"eanCode": "8906070432722",
"itemCode": "OL272",
"hsnCode": "15121110",
"productNameEn": "Sunflower Oil",
"productNameHi": "Surajmukhi Tel",
"packingSize": "1.000",
"mrp": "435.00",
"shelfLife": "9",
"usp": "0.435",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100157,
"eanCode": "8906070432937",
"itemCode": "OL293",
"hsnCode": "15081000",
"productNameEn": "Groundnut Oil",
"productNameHi": "Mungfali Ka Tel",
"packingSize": "1.000",
"mrp": "445.00",
"shelfLife": "9",
"usp": "0.445",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100158,
"eanCode": "8906070432944",
"itemCode": "OL294",
"hsnCode": "15159099",
"productNameEn": "Sesame Oil White",
"productNameHi": "Til ka Tel",
"packingSize": "0.500",
"mrp": "345.00",
"shelfLife": "9",
"usp": "0.69",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100159,
"eanCode": "8906070434962",
"itemCode": "OL496",
"hsnCode": "15153010",
"productNameEn": "Castor Oil",
"productNameHi": "Castor Oil",
"packingSize": "0.250",
"mrp": "145.00",
"shelfLife": "9",
"usp": "0.58",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100160,
"eanCode": "8906070432739",
"itemCode": "OG273",
"hsnCode": "04059020",
"productNameEn": "Cow Desi Ghee",
"productNameHi": "Gay Ka Shudh Desi Ghee",
"packingSize": "0.500",
"mrp": "810.00",
"shelfLife": "9",
"usp": "1.62",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100161,
"eanCode": "8906070432746",
"itemCode": "OG274",
"hsnCode": "04059020",
"productNameEn": "Cow Desi Ghee",
"productNameHi": "Gay Ka Shudh Desi Ghee",
"packingSize": "1.000",
"mrp": "1580.00",
"shelfLife": "9",
"usp": "1.58",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100162,
"eanCode": "8906070432791",
"itemCode": "OG279",
"hsnCode": "04059020",
"productNameEn": "Cow Desi Ghee (A2)",
"productNameHi": "Desi Gay Ka Shudh Desi Ghee",
"packingSize": "0.200",
"mrp": "515.00",
"shelfLife": "9",
"usp": "2.575",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100163,
"eanCode": "8906070432777",
"itemCode": "OG277",
"hsnCode": "04059020",
"productNameEn": "Cow Desi Ghee (A2)",
"productNameHi": "Desi Gay Ka Shudh Desi Ghee",
"packingSize": "0.500",
"mrp": "1195.00",
"shelfLife": "9",
"usp": "2.39",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100164,
"eanCode": "8906070432753",
"itemCode": "OL275",
"hsnCode": "15131100",
"productNameEn": "Organic Extra Virgin Coconut Oil",
"productNameHi": "Nariyal Tel",
"packingSize": "0.350",
"mrp": "415.00",
"shelfLife": "12",
"usp": "1.185714286",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100165,
"eanCode": "8906070432500",
"itemCode": "SS250",
"hsnCode": "17011420",
"productNameEn": "Raw Sugar",
"productNameHi": "Deshi Khand",
"packingSize": "0.500",
"mrp": "95.00",
"shelfLife": "12",
"usp": "0.19",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100166,
"eanCode": "8906070432517",
"itemCode": "SS251",
"hsnCode": "17011420",
"productNameEn": "Raw Sugar",
"productNameHi": "Deshi Khand",
"packingSize": "1.000",
"mrp": "180.00",
"shelfLife": "12",
"usp": "0.18",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100167,
"eanCode": "8906070432524",
"itemCode": "SS252",
"hsnCode": "17011420",
"productNameEn": "Sugar Brown Raw",
"productNameHi": "Khand Brown",
"packingSize": "0.500",
"mrp": "95.00",
"shelfLife": "12",
"usp": "0.19",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100168,
"eanCode": "8906070432609",
"itemCode": "SS260",
"hsnCode": "17011420",
"productNameEn": "Sugar Brown Raw",
"productNameHi": "Khand Brown",
"packingSize": "1.000",
"mrp": "180.00",
"shelfLife": "12",
"usp": "0.18",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100169,
"eanCode": "8906070434955",
"itemCode": "SS495",
"hsnCode": "17011420",
"productNameEn": "Sugar Brown Raw(Crystal)",
"productNameHi": "Sugar Brown",
"packingSize": "0.500",
"mrp": "95.00",
"shelfLife": "12",
"usp": "0.19",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100170,
"eanCode": "8906070432548",
"itemCode": "SJ254",
"hsnCode": "17011410",
"productNameEn": "Jaggery Powder",
"productNameHi": "Shakkar",
"packingSize": "0.500",
"mrp": "105.00",
"shelfLife": "12",
"usp": "0.21",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100171,
"eanCode": "8906070433804",
"itemCode": "SJ380",
"hsnCode": "17011410",
"productNameEn": "Jaggery Powder",
"productNameHi": "Shakkar",
"packingSize": "0.500",
"mrp": "110.00",
"shelfLife": "12",
"usp": "0.22",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100172,
"eanCode": "8906070432555",
"itemCode": "SJ255",
"hsnCode": "17011410",
"productNameEn": "Jaggery (Gur)",
"productNameHi": "Gur",
"packingSize": "0.500",
"mrp": "95.00",
"shelfLife": "6",
"usp": "0.19",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100173,
"eanCode": "8906070432708",
"itemCode": "SJ270",
"hsnCode": "17011410",
"productNameEn": "Jaggery Pearls",
"productNameHi": "Jaggery Pearls",
"packingSize": "0.500",
"mrp": "130.00",
"shelfLife": "18",
"usp": "0.26",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100174,
"eanCode": "8906070432579",
"itemCode": "SS257",
"hsnCode": "17011420",
"productNameEn": "Bura Sugar",
"productNameHi": "Bura",
"packingSize": "0.500",
"mrp": "135.00",
"shelfLife": "12",
"usp": "0.27",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100175,
"eanCode": "8906070432562",
"itemCode": "SS256",
"hsnCode": "12111000",
"productNameEn": "Stevia Powder",
"productNameHi": "Stevia Powder",
"packingSize": "0.050",
"mrp": "75.00",
"shelfLife": "12",
"usp": "1.5",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100176,
"eanCode": "8906070432630",
"itemCode": "SH263",
"hsnCode": "04090000",
"productNameEn": "Honey - Raw Forest",
"productNameHi": "Honey - Raw Forest",
"packingSize": "0.250",
"mrp": "220.00",
"shelfLife": "24",
"usp": "0.88",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100177,
"eanCode": "8906070432647",
"itemCode": "SH264",
"hsnCode": "04090000",
"productNameEn": "Honey - Raw Forest",
"productNameHi": "Honey - Raw Forest",
"packingSize": "0.500",
"mrp": "430.00",
"shelfLife": "24",
"usp": "0.86",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100178,
"eanCode": "8906070434009",
"itemCode": "DF400",
"hsnCode": "08021200",
"productNameEn": "Almond",
"productNameHi": "Badam",
"packingSize": "0.250",
"mrp": "485.00",
"shelfLife": "9",
"usp": "1.94",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100179,
"eanCode": "8906070434030",
"itemCode": "DF403",
"hsnCode": "08021200",
"productNameEn": "Almond",
"productNameHi": "Badam",
"packingSize": "0.100",
"mrp": "195.00",
"shelfLife": "9",
"usp": "1.95",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100180,
"eanCode": "8906070434184",
"itemCode": "DF418",
"hsnCode": "08021200",
"productNameEn": "Almond",
"productNameHi": "Badam",
"packingSize": "0.200",
"mrp": "320.00",
"shelfLife": "9",
"usp": "1.6",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100181,
"eanCode": "8906070434016",
"itemCode": "DF401",
"hsnCode": "08062010",
"productNameEn": "Raisin",
"productNameHi": "Kshmish",
"packingSize": "0.250",
"mrp": "265.00",
"shelfLife": "9",
"usp": "1.06",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100182,
"eanCode": "8906070434047",
"itemCode": "DF404",
"hsnCode": "08062010",
"productNameEn": "Raisin",
"productNameHi": "Kshmish",
"packingSize": "0.100",
"mrp": "105.00",
"shelfLife": "9",
"usp": "1.05",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100183,
"eanCode": "8906070434207",
"itemCode": "DF420",
"hsnCode": "08062010",
"productNameEn": "Raisin",
"productNameHi": "Kshmish",
"packingSize": "0.200",
"mrp": "185.00",
"shelfLife": "9",
"usp": "0.925",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100184,
"eanCode": "8906070434023",
"itemCode": "DF402",
"hsnCode": "08013220",
"productNameEn": "Cashew",
"productNameHi": "Kaju",
"packingSize": "0.250",
"mrp": "615.00",
"shelfLife": "9",
"usp": "2.46",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100185,
"eanCode": "8906070434054",
"itemCode": "DF405",
"hsnCode": "08013220",
"productNameEn": "Cashew",
"productNameHi": "Kaju",
"packingSize": "0.100",
"mrp": "265.00",
"shelfLife": "9",
"usp": "2.65",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100186,
"eanCode": "8906070434191",
"itemCode": "DF419",
"hsnCode": "08013220",
"productNameEn": "Cashew",
"productNameHi": "Kaju",
"packingSize": "0.200",
"mrp": "370.00",
"shelfLife": "9",
"usp": "1.85",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100187,
"eanCode": "8906070437376",
"itemCode": "DS737",
"hsnCode": "12040090",
"productNameEn": "Flax Seeds",
"productNameHi": "Alsi",
"packingSize": "0.150",
"mrp": "75.00",
"shelfLife": "9",
"usp": "0.5",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100188,
"eanCode": "8906070431220",
"itemCode": "DS122",
"hsnCode": "12040090",
"productNameEn": "Flax Seeds",
"productNameHi": "Alsi",
"packingSize": "0.200",
"mrp": "90.00",
"shelfLife": "9",
"usp": "0.45",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100189,
"eanCode": "8906070437383",
"itemCode": "DS738",
"hsnCode": "12040090",
"productNameEn": "Flax Seeds",
"productNameHi": "Alsi",
"packingSize": "0.250",
"mrp": "115.00",
"shelfLife": "9",
"usp": "0.46",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100190,
"eanCode": "8906070433910",
"itemCode": "DS391",
"hsnCode": "12060090",
"productNameEn": "Sun Flower Seeds",
"productNameHi": "Surajmukhi Ke Beej",
"packingSize": "0.120",
"mrp": "135.00",
"shelfLife": "12",
"usp": "1.125",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100191,
"eanCode": "8906070433927",
"itemCode": "DS392",
"hsnCode": "12074090",
"productNameEn": "White Sesame Seeds",
"productNameHi": "Safed Til",
"packingSize": "0.120",
"mrp": "95.00",
"shelfLife": "12",
"usp": "0.791666667",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100192,
"eanCode": "8906070433989",
"itemCode": "DS398",
"hsnCode": "12072010",
"productNameEn": "Chia Seeds",
"productNameHi": "Chia Seeds",
"packingSize": "0.150",
"mrp": "240.00",
"shelfLife": "12",
"usp": "1.6",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100193,
"eanCode": "8906070433934",
"itemCode": "DS393",
"hsnCode": "20081920",
"productNameEn": "Pumpkin Seeds",
"productNameHi": "Pumpkin Seeds",
"packingSize": "0.120",
"mrp": "245.00",
"shelfLife": "12",
"usp": "2.041666667",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100194,
"eanCode": "8906070433941",
"itemCode": "DS394",
"hsnCode": "12072010",
"productNameEn": "Healthy Seeding (Mix Seeds)",
"productNameHi": "Healthy Seeding (Mix Seeds)",
"packingSize": "0.150",
"mrp": "210.00",
"shelfLife": "12",
"usp": "1.4",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100195,
"eanCode": "8906070433699",
"itemCode": "DS369",
"hsnCode": "12072010",
"productNameEn": "Healthy Seeding (Mix Seeds)",
"productNameHi": "Healthy Seeding (Mix Seeds)",
"packingSize": "0.250",
"mrp": "320.00",
"shelfLife": "12",
"usp": "1.28",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100196,
"eanCode": "8906070437406",
"itemCode": "DS740",
"hsnCode": "20081920",
"productNameEn": "Pumpkin Seeds",
"productNameHi": "Pumpkin Seeds",
"packingSize": "0.250",
"mrp": "395.00",
"shelfLife": "12",
"usp": "1.58",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100197,
"eanCode": "8906070437413",
"itemCode": "DS741",
"hsnCode": "12072010",
"productNameEn": "Chia Seeds",
"productNameHi": "Chia Seeds",
"packingSize": "0.250",
"mrp": "380.00",
"shelfLife": "12",
"usp": "1.52",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100198,
"eanCode": "8906070437420",
"itemCode": "DS742",
"hsnCode": "12060090",
"productNameEn": "Sun Flower Seeds",
"productNameHi": "Surajmukhi Ke Beej",
"packingSize": "0.250",
"mrp": "255.00",
"shelfLife": "12",
"usp": "1.02",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100199,
"eanCode": "8906070434399",
"itemCode": "SH439",
"hsnCode": "12119099",
"productNameEn": "Triphla",
"productNameHi": "Triphla",
"packingSize": "0.100",
"mrp": "195.00",
"shelfLife": "12",
"usp": "1.95",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100200,
"eanCode": "8906070434085",
"itemCode": "DF408",
"hsnCode": "12021011",
"productNameEn": "Peanut",
"productNameHi": "Moongfali",
"packingSize": "0.500",
"mrp": "175.00",
"shelfLife": "9",
"usp": "0.35",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100201,
"eanCode": "8906070434160",
"itemCode": "DFJ416",
"hsnCode": "20079100",
"productNameEn": "Organge Marmalade",
"productNameHi": "Organge Marmalade",
"packingSize": "0.240",
"mrp": "180.00",
"shelfLife": "18",
"usp": "0.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100202,
"eanCode": "8906070434177",
"itemCode": "DFJ417",
"hsnCode": "20019000",
"productNameEn": "Lemon Chutney",
"productNameHi": "Lemon Chutney",
"packingSize": "0.250",
"mrp": "180.00",
"shelfLife": "18",
"usp": "0.72",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100203,
"eanCode": "8906070434078",
"itemCode": "DFJ407",
"hsnCode": "20079930",
"productNameEn": "Apple Jam",
"productNameHi": "Apple Jam",
"packingSize": "0.240",
"mrp": "180.00",
"shelfLife": "18",
"usp": "0.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100204,
"eanCode": "8906070437901",
"itemCode": "BV790",
"hsnCode": "22090010",
"productNameEn": "Apple Cider Vinegar Mother",
"productNameHi": "Apple Cider Vinegar",
"packingSize": "0.500",
"mrp": "525.00",
"shelfLife": "18",
"usp": "1.05",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100205,
"eanCode": "8906070435006",
"itemCode": "PW500",
"hsnCode": "33030020",
"productNameEn": "Organic Rose Water",
"productNameHi": "Organic Gulab Jal",
"packingSize": "0.100",
"mrp": "255.00",
"shelfLife": "24",
"usp": "2.55",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100206,
"eanCode": "8906070435013",
"itemCode": "PO501",
"hsnCode": "15159099",
"productNameEn": "Organic Apricot Oil",
"productNameHi": "Organic Apricot Oil",
"packingSize": "0.100",
"mrp": "255.00",
"shelfLife": "18",
"usp": "2.55",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100207,
"eanCode": "8906070437604",
"itemCode": "GR760",
"hsnCode": "21039010",
"productNameEn": "Chef Serves Biryani Gravy",
"productNameHi": "Biryani Gravy",
"packingSize": "0.150",
"mrp": "125.00",
"shelfLife": "18",
"usp": "0.833333333",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100208,
"eanCode": "8906070437611",
"itemCode": "GR761",
"hsnCode": "21039010",
"productNameEn": "Chef Serves Masala Gravy",
"productNameHi": "Masala Gravy",
"packingSize": "0.200",
"mrp": "125.00",
"shelfLife": "18",
"usp": "0.625",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100209,
"eanCode": "8906070437628",
"itemCode": "GR762",
"hsnCode": "21039010",
"productNameEn": "Chef Serves Palak Gravy",
"productNameHi": "Palak Gravy",
"packingSize": "0.200",
"mrp": "125.00",
"shelfLife": "18",
"usp": "0.625",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100210,
"eanCode": "8906070437598",
"itemCode": "GR759",
"hsnCode": "21039010",
"productNameEn": "Chef Serves Butter Gravy",
"productNameHi": "Butter Gravy",
"packingSize": "0.200",
"mrp": "125.00",
"shelfLife": "18",
"usp": "0.625",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100211,
"eanCode": "8906070437314",
"itemCode": "CF731",
"hsnCode": "10089090",
"productNameEn": "Multimillet Melange (Dalia)",
"productNameHi": "Multimillet Melange (Dalia)",
"packingSize": "0.500",
"mrp": "135.00",
"shelfLife": "12",
"usp": "0.27",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100212,
"eanCode": "8906070433453",
"itemCode": "CN345",
"hsnCode": "11041900",
"productNameEn": "Multimillet Melange (Dalia)",
"productNameHi": "Multimillet Melange (Dalia)",
"packingSize": "0.200",
"mrp": "65.00",
"shelfLife": "12",
"usp": "0.325",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100213,
"eanCode": "8906070433484",
"itemCode": "CN348",
"hsnCode": "10089090",
"productNameEn": "Multi Millet Melange (Khichdi)",
"productNameHi": "Multimillet Melange (Khichdi)",
"packingSize": "0.500",
"mrp": "135.00",
"shelfLife": "12",
"usp": "0.27",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100214,
"eanCode": "8906070430933",
"itemCode": "RTC093",
"hsnCode": "11041900",
"productNameEn": "Ragi Idli Pre Mix",
"productNameHi": "Ragi Idli Mix",
"packingSize": "0.400",
"mrp": "155.00",
"shelfLife": "12",
"usp": "0.3875",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100215,
"eanCode": "8906070430964",
"itemCode": "RTC096",
"hsnCode": "11041900",
"productNameEn": "Ragi Dosa Pre Mix",
"productNameHi": "Ragi Dosa Mix",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100216,
"eanCode": "8906070430858",
"itemCode": "RTC094",
"hsnCode": "11041900",
"productNameEn": "Millet Dosa Pre mix",
"productNameHi": "Shree Anna Dosa mix",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100217,
"eanCode": "8906070430889",
"itemCode": "Pasta088",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Foxtail Millet Pasta",
"productNameHi": "Awe-RIGINS Foxtail Millet Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100218,
"eanCode": "8906070430896",
"itemCode": "Pasta089",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Chickpea Pasta",
"productNameHi": "Awe-RIGINS Chickpea Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100219,
"eanCode": "8906070430872",
"itemCode": "Pasta0872",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Durum Sorghum Pasta/ High Protein Millet Pasta",
"productNameHi": "Awe-RIGINS Durum Sorghum Pasta/ High Protein Millet Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100220,
"eanCode": "8906070430926",
"itemCode": "Pasta092",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Durum Millet Pasta",
"productNameHi": "Awe-RIGINS Durum Millet Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100221,
"eanCode": "8906070430919",
"itemCode": "Pasta091",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Brown Rice Pasta",
"productNameHi": "Awe-RIGINS Brown Rice Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100222,
"eanCode": "8906070430902",
"itemCode": "Pasta090",
"hsnCode": "19023010",
"productNameEn": "Awe-RIGINS Protein Rich Pasta",
"productNameHi": "Awe-RIGINS Protein Rich Pasta",
"packingSize": "0.400",
"mrp": "175.00",
"shelfLife": "12",
"usp": "0.4375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100223,
"eanCode": "8906070430117",
"itemCode": "RTC011",
"hsnCode": "21041010",
"productNameEn": "Millet Muesli",
"productNameHi": "Shree Anna Musli",
"packingSize": "0.400",
"mrp": "295.00",
"shelfLife": "9",
"usp": "0.7375",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100224,
"eanCode": "8906070435235",
"itemCode": "Thandai523",
"hsnCode": "19041090",
"productNameEn": "Millet Thandai",
"productNameHi": "Millet Thandai",
"packingSize": "0.040",
"mrp": "50.00",
"shelfLife": "3",
"usp": "1.25",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100225,
"eanCode": "8906070430995",
"itemCode": "RTC099",
"hsnCode": "21041010",
"productNameEn": "Millet Soup",
"productNameHi": "Bajra Soup",
"packingSize": "0.020",
"mrp": "35.00",
"shelfLife": "6",
"usp": "1.75",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100226,
"eanCode": "8906070437529",
"itemCode": "RTE752",
"hsnCode": "21069099",
"productNameEn": "Seven Ancient Grains",
"productNameHi": "Seven Ancient Grains",
"packingSize": "0.170",
"mrp": "149.00",
"shelfLife": "18",
"usp": "0.876470588",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100227,
"eanCode": "8906070437574",
"itemCode": "RTE757",
"hsnCode": "21069099",
"productNameEn": "Buckwheat Pillaf",
"productNameHi": "Buckwheat Pillaf",
"packingSize": "0.170",
"mrp": "249.00",
"shelfLife": "18",
"usp": "1.464705882",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100228,
"eanCode": "8906070437567",
"itemCode": "RTE756",
"hsnCode": "21069099",
"productNameEn": "Pearl millet Millange",
"productNameHi": "Pearl millet Millange",
"packingSize": "0.170",
"mrp": "249.00",
"shelfLife": "18",
"usp": "1.464705882",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100229,
"eanCode": "8906070430841",
"itemCode": "CF084",
"hsnCode": "11062010",
"productNameEn": "Millet Chana Sattu (Protein Premix)",
"productNameHi": "Millet Chana Sattu",
"packingSize": "0.400",
"mrp": "155.00",
"shelfLife": "12",
"usp": "0.3875",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100230,
"eanCode": "8906070430766",
"itemCode": "Cookies076",
"hsnCode": "19052000",
"productNameEn": "Awe-RIGINS Finger Millet Choco Cookies",
"productNameHi": "Awe-RIGINS Ragi Choco Cookies",
"packingSize": "0.200",
"mrp": "180.00",
"shelfLife": "9",
"usp": "0.9",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100231,
"eanCode": "8906070430834",
"itemCode": "Cookies083",
"hsnCode": "19052000",
"productNameEn": "awe-RIGINS Pearl Millet Cookies",
"productNameHi": "Awe-RIGINS Bajra Jaggery Cookies",
"packingSize": "0.200",
"mrp": "180.00",
"shelfLife": "9",
"usp": "0.9",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
},
{
"id": 100232,
"eanCode": "8906070430827",
"itemCode": "Cookies082",
"hsnCode": "19052000",
"productNameEn": "Awe-RIGINS Multimillet Cookies",
"productNameHi": "Awe-RIGINS Multimillet Cookies",
"packingSize": "0.200",
"mrp": "180.00",
"shelfLife": "9",
"usp": "0.9",
"pouchBack": "Image/file",
"pouchFront": "Image/file",
"label": "Image/file"
}

  
  
  
  ];

  // Filter rows based on the search term
  const filteredRows = rows.filter(row => 
    row.eanCode.includes(searchTerm) || 
    row.itemCode.includes(searchTerm) ||
    row.hsnCode.includes(searchTerm) ||
    row.productNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.productNameHi.includes(searchTerm) ||
    row.packingSize.includes(searchTerm) ||
    row.mrp.includes(searchTerm) ||
    row.shelfLife.includes(searchTerm) ||
    row.usp.includes(searchTerm)
  );

  return (
    <div className="Content-container">
      {user && <p>Welcome, {user.name}</p>}
      <button onClick={handleLogout}>Logout</button>
      
      <h1>Product Information</h1>
      {error && <p>{error}</p>}
      <button onClick={handleDownloadAll}>Download All Files</button>

      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} // Add search input
      />

      <table>
        <thead>
          <tr>
            <th>EAN Code / Bar Code</th>
            <th>Item Code</th>
            <th>HSN Code</th>
            <th>Product Name (English)</th>
            <th>Product Name (Hindi)</th>
            <th>Packing Size (Kg)</th>
            {/* <th>MRP (INR)</th> */}
            <th>Shelf Life (Month)</th>
            {/* <th>USP</th> */}
            <th>Pouch Back / Pouch Front / Label</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>{row.eanCode}</td>
              <td>{row.itemCode}</td>
              <td>{row.hsnCode}</td>
              <td>{row.productNameEn}</td>
              <td>{row.productNameHi}</td>
              <td>{row.packingSize}</td>
              {/* <td>{row.mrp}</td> */}
              <td>{row.shelfLife}</td>
              {/* <td>{row.usp}</td> */}
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
                    <input type="file" accept=".jpg, .jpeg, .pdf, .zip" onChange={(e) => handleFileChange(e, row.id)} />
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
