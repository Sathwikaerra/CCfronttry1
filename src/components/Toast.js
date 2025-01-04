import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close toast after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white font-semibold ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{ zIndex: 1000 }}
    >
      {message}
    </div>
  );
};

export default Toast;
