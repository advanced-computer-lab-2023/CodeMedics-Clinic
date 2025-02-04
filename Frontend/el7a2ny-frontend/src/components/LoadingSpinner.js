import React from 'react';

const LoadingSpinner = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', // Takes up the full height of its parent
  };

  const spinnerStyle = {
    border: '4px solid #f3f3f3', // Light gray
    borderTop: '4px solid #3498db', // Blue
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;