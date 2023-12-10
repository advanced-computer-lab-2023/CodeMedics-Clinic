import React from 'react';

const PrescriptionHistoryComponent = ({ prescriptions, sx }) => {
  return (
    <div style={sx}>
      <h2>Prescription History</h2>
      <ul>
        {prescriptions.map((prescription, index) => (
          <li key={index}>{prescription}</li>
          // Replace with the actual structure of your prescription data
        ))}
      </ul>
      {/* Add styling or any other components as needed */}
    </div>
  );
};

export default PrescriptionHistoryComponent;
