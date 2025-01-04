import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser } from './ApI/Api';
import Loader from "./Loader";
import Toast from "./Toast"; // Import the Toast component

const ToggleRequestStatus = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const userId = localStorage.getItem("UserId");

  // Fetch current user data when component mounts or userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(userId); // Assuming getUser is the API function to fetch user data
        setCurrentUser(res.newuser); // Set the fetched user data
        setIsActive(res.newuser.request); // Set the initial active status
      } catch (err) {
        setMessage(null);

      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Function to handle the toggle of active status
  const handleToggleStatus = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.put("/user/update-request", {
        id: userId,
        RequestStatus: !isActive,
      });

      if (response.status === 200) {
        setIsActive(!isActive); // Update the status on success
        showMessage("User status updated successfully!", "success");
      }
    } catch (err) {
      showMessage("Failed to update status. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show message with timeout
  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center mt-[30px] items-center flex-col gap-2">
        <Loader />
        <p className="text-white font-serif">Loading...</p>
      </div>
    ); // Show loading text while fetching user data
  }

  return (
    <div className="flex flex-col  justify-center items-center  gap-4 mx-auto items-center w-[300px] h-[300px] mt-6 p-4 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-lg shadow-lg">
      <h2 className="text-xl text-white font-bold mb-6 text-center uppercase tracking-wide">Join Waiting List</h2>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <p className={`text-md font-semibold font-medium ${isActive ? "text-green-500" : "text-red-500"}`}>
          {isActive ? "You are added to the waiting list." : "You are not listed."}
        </p>
        <button
          onClick={handleToggleStatus}
          className={`px-8 py-3 rounded-full text-white font-semibold transition duration-200 transform ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : isActive ? "Click here to quit waiting" : "Click here to join waiting"}
        </button>
      </div>

      {message && (
        <Toast message={message.text} type={message.type} onClose={() => setMessage(null)} />
      )}
    </div>
  );
};

export default ToggleRequestStatus;
