import React from 'react';

const NoRecords = ({message}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <p style={{ fontSize: '30px', font: 'message-box' }}>{message}</p>
    </div>
  );
};

export default NoRecords;