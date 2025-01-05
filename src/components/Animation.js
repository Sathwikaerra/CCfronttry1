import React, { useState, useEffect } from 'react';
import './style.css';

const LandingPage3D = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // Show loader for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {loading ? (
        <div className="loader-container">
          <div className="loader">
            <div className="loader-inner"></div>
          </div>
          <h1 className="loader-text">Welcome to Campus Connect</h1>
        </div>
      ) : (
        <div className="content">
          <h1 className="main-title">Campus Connect</h1>
          <p className="subtitle">From the Student, By the Student, For the Student</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage3D;
