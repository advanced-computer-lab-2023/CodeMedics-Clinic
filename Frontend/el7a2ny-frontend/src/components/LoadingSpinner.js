import React from 'react';

const LoadingSpinner = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 0', 
  };

  const spinnerStyle = {
    border: '3px solid #f3f3f3', 
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    width: '40px', 
    height: '40px',
    animation: 'spin 1s linear infinite',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;