import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaShoppingCart } from 'react-icons/fa';
import { userActions } from "../../store/reducers";
import { useDispatch } from "react-redux";

const OtherCart = () => {
  const dispatch=useDispatch();
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("UserId");
      if (!userId) {
        setError("UserId not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/user/${userId}`);
        setRequestedUsers(data.newuser?.OtherRequestedTo || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (index) => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      setError("UserId not found in localStorage");
      return;
    }

    try {
      const res=await axios.delete(`/user/other/${userId}/request/${index}`);
      if(res.status===200)
      {
        setRequestedUsers((prev) => prev.filter((_, i) => i !== index));
        const res2 = await axios.get(`/user/cart/${currentUserId}`);
        if (res2.status === 200) {
          dispatch(userActions.setCart(res2.data.newuser.OtherRequestedTo.length));
        }
      }

            
    } catch (err) {
      setError("Failed to delete the request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-4xl flex justify-center items-center gap-2 font-extrabold text-center text-green-700 mb-8 drop-shadow-lg">
      <FaShoppingCart /> Cart Details
    </h1>
    {requestedUsers.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {requestedUsers.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Request #{index + 1}
            </h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Name:</span>{" "}
                {item.userDetails?.name || "Not Available"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {item.userDetails?.email || "Not Available"}
              </p>
            
            </div>
            <div className="flex justify-center items-center mb-3">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full shadow-sm transition-all ${
                  item.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : item.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : item.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : ""
                }`}
              >
                {item.status === "approved" ? (
                  <span className="flex items-center">
                    <AiOutlineCheckCircle className="mr-2" size={18} />
                    Approved
                  </span>
                ) : item.status === "rejected" ? (
                  <span className="flex items-center">
                    <AiOutlineCloseCircle className="mr-2" size={18} />
                    Rejected
                  </span>
                ) : item.status === "pending" ? (
                  <span className="flex items-center">
                    <AiOutlineCheckCircle className="mr-2" size={18} />
                    Pending
                  </span>
                ) : null}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              <span className="font-semibold text-gray-800">Requested Time:</span>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
            {["approved", "rejected"].includes(item.status) && ( // Only show delete button for approved or rejected status
              <button
                onClick={() => handleDelete(index)}
                className="w-full px-4 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-600 transform hover:translate-y-1 transition-all duration-300"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500 text-lg">Cart is Empty</p>
    )}
  </div>
  );
};

export default OtherCart;
