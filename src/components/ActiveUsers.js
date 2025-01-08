import React, { useState } from "react";
import { getActiveUsers } from './ApI/Api';
import { useNavigate } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md';

const ActiveUsers = () => {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]); // Store the active users
  const [loading, setLoading] = useState(false); // Store loading state
  const [error, setError] = useState(""); // Store error message
  const [showActiveUsers, setShowActiveUsers] = useState(false); // Toggle visibility of active users list
  const currentUserId = localStorage.getItem("UserId"); // Get the current user ID from localStorage

  // Function to fetch active users from the backend
  const fetchActiveUsers = async () => { 
    setLoading(true);
    setError("");
    try {
      const res = await getActiveUsers(); 
      // Filter out the current user from the active users list
      const filteredUsers = res.users.filter((user) => user._id !== currentUserId);
      setActiveUsers(filteredUsers); // Update the state with the filtered list
    } catch (err) {
      setError("Failed to fetch active users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-transparent mt-[30px] w-[300px] mx-auto shadow-md rounded-lg">
      <h2 className="text-md m-4 font-semibold mb-2 text-white">Active Users</h2>

      {/* Toggle button to show/hide the active users list */}
      <button
        onClick={() => {
          fetchActiveUsers().then(() => setShowActiveUsers(!showActiveUsers));
        }}
        className="bg-emerald-400 text-white font-semibold m-3 py-2 px-4 rounded-lg mb-3 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-violet-900 hover:text-white"
      >
        {showActiveUsers ? "Hide Active Users" : "Show Active Users"}
      </button>

      {/* Error message */}
      {/* {error && <p className="text-red-500 text-xs">{error}</p>} */}

      {/* Conditionally render the list of active users */}
      {showActiveUsers && (
        <ul className="space-y-2 w-[200px] mx-auto  flex flex-col  justify-center items-center  mt-[30px]">
          {activeUsers.length > 0 ? (
            activeUsers.map((user) => (
              <li 
              onClick={() => navigate(`/orders/${user._id}`)}
              key={user._id}
              className={`flex flex-col justify-center w-[300px] p-2  items-center   border-b border-gray-200 rounded-lg transition duration-300 ${
                user.active
                  ? 'bg-sky-700 text-white hover:from-green-500 hover:to-green-600' // Active user: Green gradient
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600' // Inactive user: Red gradient
              } shadow-lg hover:shadow-2xl`}
              >
             <div className="flex flex-col p-2 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
  {/* Username and Bars Row */}
  <div className="flex items-center justify-between  mb-2">
    <span className="font-bold text-white text-xl">{user.name}</span>
    <div className="flex gap-1">
      {Array.from({ length: user.serviceCount }).map((_, index) => (
        <div
          key={index}
          className="w-[20px] h-[15px] bg-green-500 rounded-md"
        ></div>
      ))}
    </div>
  </div>

  {/* Location Row */}
  <div className="flex items-center gap-2 text-white">
    <MdLocationOn size={20} className="text-red-500" />
    <i className="text-sm">{user.location}</i>
  </div>
</div>


                

              </li>
            ))
          ) : (
            <p className="text-gray-500 text-xm">No Waiting users available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ActiveUsers;
