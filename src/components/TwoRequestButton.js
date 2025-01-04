import React, { useState } from 'react';
import { FaHamburger, FaConciergeBell } from 'react-icons/fa'; // Importing Font Awesome Icons
import UserRequest from './UserRequest'
import OtherRequest from './OtherRequest'


const TwoButtonComponent = () => {
  const [showFoodCart, setShowFoodCart] = useState(true); // Track visibility of Food Delivery
  const [showServicesCart, setShowServicesCart] = useState(false); // Track visibility of Other Services

  const handleToggle = (section) => {
    if (section === 'food') {
      setShowFoodCart(true);
      setShowServicesCart(false);
    } else {
      setShowFoodCart(false);
      setShowServicesCart(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-[50px] items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 font-sans">
      <h1 className="text-xl font-bold mb-6 text-center uppercase tracking-wide">
        Choose Your Service
      </h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        {/* Food Delivery Button */}
        <button
          className={`${
            showFoodCart ? 'bg-blue-600' : 'bg-blue-500'
          } text-white px-8 py-4 rounded-xl shadow-md transform transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg flex items-center justify-center text-lg sm:text-xl font-semibold`}
          onClick={() => handleToggle('food')}
        >
          <FaHamburger className="mr-3 text-xl sm:text-2xl" />
          Food Delivery
        </button>

        {/* Other Services Button */}
        <button
          className={`${
            showServicesCart ? 'bg-green-600' : 'bg-green-500'
          } text-white px-8 py-4 rounded-xl shadow-md transform transition duration-200 ease-in-out hover:bg-green-700 hover:shadow-lg flex items-center justify-center text-lg sm:text-xl font-semibold`}
          onClick={() => handleToggle('services')}
        >
          <FaConciergeBell className="mr-3 text-xl sm:text-2xl" />
          Other Services
        </button>
      </div>

      {/* Content Visibility based on selected section */}
      <div className="text-center mb-8">
        {showFoodCart && (
          <p className="text-lg font-semibold">
            You are viewing the <span className="text-blue-500">Food Delivery</span> section. Here you can set an Request Status for bringing all the food requests.
          </p>
        )}
        {showServicesCart && (
          <p className="text-lg font-semibold">
            You are viewing the <span className="text-green-500">Other Services</span> section. Here you can set an Request Status for bringing other services.
          </p>
        )}
      </div>

      {/* Conditional Components */}
      {showFoodCart && <UserRequest section="food" />}
      {showServicesCart && <OtherRequest section="services" />}
    </div>
  );
};

export default TwoButtonComponent;
