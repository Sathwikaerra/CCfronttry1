import React from 'react';
import { useDispatch } from 'react-redux';
import { adminActions } from '../store/reducers'; // Import adminActions for logout
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const logout = async() => {
    dispatch(adminActions.logout()); 
    navigate('/')// Dispatch logout action
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 shadow-md">
      <div className="mx-auto flex justify-end items-center">
        <button
          onClick={logout}
          className="text-white text-lg font-medium hover:text-blue-400 transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
