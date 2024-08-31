// src/pages/404/NotFoundPage.js
import React from 'react';
import './NotFoundPage.css'; // Import the CSS file for styling

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Page Not Found</p>
        <div className="loading-line"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
