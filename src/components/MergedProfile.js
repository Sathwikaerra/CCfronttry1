import React, { useEffect, useState } from "react";
import { getUser } from "./ApI/Api";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/reducers";
import Loader from "./Loader";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherloading, setOtherLoading] = useState(true);
  const [showOrdersList, setShowOrdersList] = useState(false); // State for Orders List
  const [showOtherOrdersList, setShowOtherOrdersList] = useState(false); // State for Other Orders List
  const [showPendingRequests, setShowPendingRequests] = useState(false); // State for Pending Requests
  const [showOtherPendingRequests, setShowOtherPendingRequests] = useState(false); // State for Other Pending Requests

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
        setOtherLoading(false);
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
      const response = await axios.post(`/user/approve-request/${userId}`, {
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
      const response = await axios.delete(`/user/remove-request/${userId}`, {
        data: { requestId, requestedTo, identifier },
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

  const handleDeleteAccess = async (index, count) => {
    try {
      const response = await axios.delete(`/user/remove-accessed-by/${userId}`, {
        data: { index, count },
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

  const handleOtherApproveRequest = async (requestId, requestedTo, identifier) => {
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

  const handleOtherRejectRequest = async (requestId, requestedTo, identifier) => {
    try {
      const response = await axios.delete(`/user/other/remove-request/${userId}`, {
        data: { requestId, requestedTo, identifier },
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

  const handleOtherDeleteAccess = async (index, count) => {
    try {
      const response = await axios.delete(`/user/other/remove-accessed-by/${userId}`, {
        data: { index, count },
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

  if (otherloading) {
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
        <div className="mt-[2px]  bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 w-full max-w-lg shadow-xl">
          <h1 className="text-xl font-semibold text-white text-center mb-6">
            User Profile
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

          {/* Orders List Toggle */}
          <button
            onClick={() => setShowOrdersList(!showOrdersList)}
            className="bg-teal-600 w-[250px] mt-[50px] text-white py-2 px-6 rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
          >
            {showOrdersList ? "Hide Food Orders" : "View Food Orders"}
          </button>

          {showOrdersList && (
            <div className="mt-6 mb-[30px]">
              <h3 className="font-semibold text-lg text-purple-400 mb-3">
                Accepted Food Orders
              </h3>
              {currentUser.accessedBy.length > 0 ? (
                currentUser.accessedBy.map((access, index) => (
                  <div
                    key={index}
                    className="bg-gray-700  p-4 flex justify-center items-center  flex-col rounded-lg mt-3 transform hover:scale-105"
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
                      <span className="font-semibold">Mobile:</span> {access.phoneNumber}
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
          )}

          {/* Other Orders List Toggle */}
          <button
            onClick={() => setShowOtherOrdersList(!showOtherOrdersList)}
            className="bg-teal-600 w-[250px] text-white py-2 px-6 rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
          >
            {showOtherOrdersList ? "Hide Delivery Orders" : "View Delivery Orders"}
          </button>

          {showOtherOrdersList && (
            <div className="mt-6 mb-[50px]">
              <h3 className="font-semibold text-lg text-purple-400 mb-3">
                Accepted Orders List
              </h3>
              {currentUser.OtherAccessedBy.length > 0 ? (
                currentUser.OtherAccessedBy.map((access, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 flex-col flex justify-center items-center rounded-lg mt-3 transform transition-all hover:scale-105"
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
                      <span className="font-semibold">Mobile:</span>{" "}
                      {access.user?.phoneNumber || "No Number"}
                    </p>

                    <button
                      onClick={() => handleOtherDeleteAccess(index)}
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
          )}

          {/* Pending Requests Toggle */}
          <button
            onClick={() => setShowPendingRequests(!showPendingRequests)}
            className="bg-teal-600 w-[250px] text-[15px] text-white py-2 px-6 rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
          >
            {showPendingRequests ? "Hide Food  Pending Requests" : "View Food Pending Requests"}
          </button>

          {showPendingRequests && (
            <div className="mt-6 mb-[50px]">
              <h3 className="font-semibold text-lg text-yellow-400 mb-3">
               Food Pending Requests
              </h3>
              {currentUser.orderRequest.length > 0 ? (
                currentUser.orderRequest.map((request, index) => {
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
                      <p className="text-gray-300">
                        <span className="font-semibold">Parcels:</span>{" "}
                        {request.serviceCount || "0"}
                      </p>
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
          )}

          {/* Other Pending Requests Toggle */}
          <button
            onClick={() => setShowOtherPendingRequests(!showOtherPendingRequests)}
            className="bg-teal-600 w-[250px] text-[13px] h-[50px]  text-white py-2 px-6 rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
          >
            {showOtherPendingRequests
              ? "Hide Delivery Pending Requests"
              : "View Delivery Pending Requests"}
          </button>

          {showOtherPendingRequests && (
            <div className="mt-6 mb-[50px]">
              <h3 className="font-semibold text-lg text-yellow-400 mb-3">
                Delivery Pending Requests
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
                            handleOtherApproveRequest(
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
                            handleOtherRejectRequest(
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
          )}
          <div className="flex justify-center items-center">
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-6 rounded-lg mt-6 hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
            </div>

         
        </div>
      ) : (
        <p className="text-white">No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
