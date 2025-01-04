import React, { useState } from "react";
import { getActiveUsers } from './ApI/Api';
import { useNavigate } from "react-router-dom";

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
        <ul className="space-y-2  mt-[30px]">
          {activeUsers.length > 0 ? (
            activeUsers.map((user) => (
              <li
              onClick={() => navigate(`/orders/${user._id}`)}
              key={user._id}
              className={`flex  justify-between items-center py-2.5 px-3 border-b border-gray-200 rounded-lg transition duration-300 ${
                user.active
                  ? 'bg-sky-700 text-white hover:from-green-500 hover:to-green-600' // Active user: Green gradient
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600' // Inactive user: Red gradient
              } shadow-lg hover:shadow-2xl`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-md">{user.name}</span>
                </div>
                <span className="text-red-500 text-lg flex gap-1">
                  {Array.from({ length: user.serviceCount }).map((_, index) => (
                    <div key={index} className="w-[20px] h-[15px] bg-green-950 p-1 rounded-lg"></div>
                  ))}
                </span>
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
