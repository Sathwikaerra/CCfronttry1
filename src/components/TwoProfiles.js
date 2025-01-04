import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHamburger, FaConciergeBell } from 'react-icons/fa';  // Importing Font Awesome Icons

const TwoButtonComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col pt-[50px] items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase tracking-wide">
        Choose Your Profile
      </h1>
      
      {/* Buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        {/* Food Services Button */}
        <button
          className="bg-blue-500 text-white px-8 py-4 rounded-xl shadow-md transform transition duration-200 ease-in-out hover:bg-blue-600 hover:shadow-lg flex items-center justify-center text-lg sm:text-xl font-semibold"
          onClick={() => navigate('/profile')}
        >
          <FaHamburger className="mr-3 text-xl sm:text-2xl" />
          Food services Profile
        </button>
        
        {/* Other Services Button */}
        <button
          className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-md transform transition duration-200 ease-in-out hover:bg-green-600 hover:shadow-lg flex items-center justify-center text-lg sm:text-xl font-semibold"
          onClick={() => navigate('/other-profile')}
        >
          <FaConciergeBell className="mr-3 text-xl sm:text-2xl" />
          Other Services Profile
        </button>
      </div>
    </div>
  );
};

export default TwoButtonComponent;
