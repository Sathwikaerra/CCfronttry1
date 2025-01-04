import React, { useState } from "react";
import { getRequestUsers } from './ApI/Api';
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
      const res = await getRequestUsers();
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
    <div className="p-6 bg-gray-50 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Waiting Users</h2>

      {/* Toggle button to show/hide the active users list */}
      <button
        onClick={() => {
          fetchActiveUsers().then(() => setShowActiveUsers(!showActiveUsers));
        }}
        className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-6 rounded-full mb-4 hover:from-teal-400 hover:to-blue-500 transition duration-300"
      >
        {showActiveUsers ? "Hide Waiting Users" : "Show Waiting Users"}
      </button>

      {/* Error message */}
      {/* {error && <p className="text-red-500">{error}</p>} */}

      {/* Conditionally render the list of active users */}
      {showActiveUsers && (
        <ul className="space-y-4">
          {activeUsers.length > 0 ? (
            activeUsers.map((user) => (
              <li
                // onClick={() => navigate(`/orders/${user._id}`)}
                key={user._id}
                className={`flex justify-between items-center py-4 px-6 border-b border-gray-200 rounded-lg transition duration-300 ${
                  user.active
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600' // Active user: Green gradient
                    : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600' // Inactive user: Red gradient
                } shadow-lg hover:shadow-2xl`}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-lg">{user.name}</span>
                </div>
                {/* <span className="text-red-500 text-xl flex gap-2">
                  {Array.from({ length: user.serviceCount }).map((_, index) => (
                    <div key={index} className="w-[30px] bg-green-950 p-2 rounded-lg"></div>
                  ))}
                </span> */}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No waiting users available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ActiveUsers;
