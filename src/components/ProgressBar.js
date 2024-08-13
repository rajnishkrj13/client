import React from 'react';
import './ProgressBar.css';


const getUploadedRows = (uploadedFiles, stageRange) => {
  const [min, max] = stageRange;

  if (!Array.isArray(uploadedFiles)) {
    return [];
  }

  const filesInRange = uploadedFiles.filter(file => file.rowId >= min && file.rowId <= max);
  return [...new Set(filesInRange.map(file => file.rowId))];
};

const getMissingRows = (uploadedFiles, stageRange) => {
  const [min, max] = stageRange;
  const uploadedRows = getUploadedRows(uploadedFiles, stageRange);

  const allRows = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return allRows.filter(row => !uploadedRows.includes(row));
};

const ProgressBar = ({ uploadedFiles }) => {
  const stages = [
    { label: 'Stage 1', range: [1, 13] },
    { label: 'Stage 2', range: [14, 20] },
    { label: 'Stage 3', range: [21, 26] },
    { label: 'Stage 4', range: [27, 34] },
  ];
//7,13,26,34 invoice need 
  return (
    <div className="progress-bar-container">
      {stages.map(({ label, range }) => {
        const uploadedRows = getUploadedRows(uploadedFiles, range);
        const missingRows = getMissingRows(uploadedFiles, range);

        return (
         
            <div className="status-box">
              <p>{label}</p>
              <div className="response-box">
                <p>Completed Row:</p>
                <ul className="rectangle">
                  {uploadedRows.length > 0 ? (
                    uploadedRows.map(row => <li className="rowli" key={row}> {row}</li>)
                  ) : (
                    <li className="rowli">None</li>
                  )}
                </ul>
              </div>
              <div className="response-box">
                <p>Not Completed Row:</p>
                <ul className="rectangle">
                  {missingRows.length > 0 ? (
                    missingRows.map(row => <li className="nrowli" key={row}> {row}</li>)
                  ) : (
                    <li className="rowli">All Completed</li>
                  )}
                </ul>
              </div>
            </div>
          
        );
      })}
    </div>
  );
};

export default ProgressBar;
