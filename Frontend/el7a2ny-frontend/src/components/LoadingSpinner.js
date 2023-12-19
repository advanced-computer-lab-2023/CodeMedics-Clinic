import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {

    const styles = `
    .loading-spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3; /* Light gray */
      border-top: 4px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
    </div>
  );
};

export default LoadingSpinner;