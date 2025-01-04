import React, { useEffect, useState } from "react";
import { getUser } from "./ApI/Api";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/reducers';
import Loader from "./Loader";
import { FaUserCircle } from "react-icons/fa"; // Import the user icon

const OtherProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser(userId);
        setCurrentUser(res.newuser);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const showNotification = (message, type) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const logout = () => {
    dispatch(userActions.logout());
  };

  const handleApproveRequest = async (requestId, requestedTo, identifier) => {
    try {
      const response = await axios.post(`/user/other/approve-request/${userId}`, {
        requestId,
        requestedTo,
        identifier,
      });

      if (response.status === 200) {
        showNotification("Request approved successfully!", "success");
        const updatedUser = await getUser(userId);
        setCurrentUser(updatedUser.newuser);
      } else if (response.status === 400) {
        showNotification("Cannot approve, orders exceed limit.");
      }
    } catch (error) {
      console.error(error);
      showNotification("Server error", "error");
    }
  };

  const handleRejectRequest = async (requestId, requestedTo, identifier) => {
    try {
      const response = await axios.delete(`/user/other/remove-request/${userId}`, {
        data: {
          requestId,
          requestedTo,
          identifier,
        },
      });

      if (response.status === 200) {
        showNotification("Request rejected successfully!", "success");
        const updatedUser = await getUser(userId);
        setCurrentUser(updatedUser.newuser);
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to reject request.", "error");
    }
  };

  const handleDeleteAccess = async (index) => {
    try {
      const response = await axios.delete(`/user/other/remove-accessed-by/${userId}`, {
        data: { index },
      });

      if (response.status === 200) {
        showNotification("Access removed successfully!", "success");
        const updatedUser = await getUser(userId);
        setCurrentUser(updatedUser.newuser);
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to remove access.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-[30px] items-center flex-col gap-2">
        <Loader />
        <p className="text-white font-serif">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 p-6">
      {notification && (
        <div
          className={`fixed top-10 right-3 px-4 py-2 text-sm rounded shadow-md z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {currentUser ? (
        <div className="mt-[40px] bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 w-full max-w-lg shadow-xl">
          <h1 className="text-xl font-semibold text-white text-center mb-6">
            User Profile - (Food Services)
          </h1>
          <div className="flex justify-center items-center">
            <FaUserCircle size={60} className="text-yellow-400" />
          </div>

          <div className="text-sm flex flex-col items-center gap-6 mt-4">
            <p className="bg-gray-700 p-3 rounded-lg w-full text-white text-center">
              <span className="font-semibold">Name:</span> {currentUser.name}
            </p>
            <p className="bg-gray-700 p-3 rounded-lg w-full text-white text-center">
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
            <p className="bg-gray-700 p-3 rounded-lg w-full text-white text-center">
              <span className="font-semibold">ID:</span> {currentUser.id}
            </p>
            <p className="bg-gray-700 p-3 rounded-lg w-full text-white text-center">
              <span className="font-semibold">Available Services:</span>{" "}
              <span className="text-red-500 font-bold">{currentUser.serviceCount}</span>
            </p>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-purple-400 mb-3">
              Orders List
            </h3>
            {currentUser.accessedBy.length > 0 ? (
              currentUser.accessedBy.map((access, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg mt-3 transform hover:scale-105"
                >
                  <p className="text-gray-300">
                    <span className="font-semibold">Name:</span>{" "}
                    {access.user?.name || "Unknown"}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Email:</span>{" "}
                    {access.user?.email || "No Email"}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Count:</span> {access.count}
                  </p>
                  <button
                    onClick={() => handleDeleteAccess(index, access.count)}
                    className="mt-3 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 flex items-center transition duration-300"
                  >
                    <DeleteIcon className="mr-2" fontSize="small" />
                    Clear Order
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No Orders</p>
            )}
          </div>

          {/* Pending Requests */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-yellow-400 mb-3">
              Pending Requests
            </h3>
            {currentUser.OtherOrderRequest.length > 0 ? (
              currentUser.OtherOrderRequest.map((request, index) => {
                if (!request.requestedBy) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    className="bg-gray-700 flex flex-col items-center p-4 rounded-lg mt-3"
                  >
                    <p className="text-gray-300">
                      <span className="font-semibold">Requested By:</span>{" "}
                      {request.requestedBy?.name || "Unknown"}
                    </p>
                    {/* <p className="text-gray-300">
                      <span className="font-semibold">Parcels:</span>{" "}
                      {request.serviceCount || "0"}
                    </p> */}
                    <p className="text-gray-300">
                      <span className="font-semibold">Ordered At:</span>{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() =>
                          handleApproveRequest(
                            request._id,
                            request.requestedBy._id,
                            request.identifier
                          )
                        }
                        className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRejectRequest(
                            request._id,
                            request.requestedBy._id,
                            request.identifier
                          )
                        }
                        className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No pending requests</p>
            )}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Logout Section */}
      <div className="mt-6 flex flex-col justify-center items-center gap-4">
        <button
          onClick={() => navigate("/update-password")}
          className="bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition duration-300"
        >
          Update Password
        </button>
        <Link
          onClick={logout}
          to="/"
          className="bg-cyan-400 text-black font-medium text-lg py-2 px-6 rounded-md hover:text-blue-400 transform transition duration-300 ease-in-out hover:scale-105"
        >
          Logout
        </Link>
      </div>
    </div>

  );
};

export default OtherProfile;
