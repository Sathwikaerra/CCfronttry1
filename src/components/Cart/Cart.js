import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaShoppingCart } from 'react-icons/fa';
import { userActions } from "../../store/reducers";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
import { BiSolidEditLocation } from "react-icons/bi";
import { MdLocationOn } from 'react-icons/md';
import { toast } from "react-toastify";


const RequestedToList = () => {
  const dispatch = useDispatch();
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [otherRequestedUsers, setOtherRequestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherLoading, setOtherLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFoodCart, setShowFoodCart] = useState(false); // Toggle for food cart
  const [showServicesCart, setShowServicesCart] = useState(false);
  const [location,setLocation]=useState("")
  const [otherLocation,setOtherLocation]=useState("")
  const [mobile,setMobile]=useState("")
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
        setLocation(data.newuser?.location)
        setOtherLocation(data.newuser?.otherLocation)
        setMobile(data.newuser?.phoneNumber)

        setRequestedUsers(data.newuser?.requestedTo || []);
        setOtherRequestedUsers(data.newuser?.OtherRequestedTo || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
        setOtherLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOtherDelete = async (index) => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      setError("UserId not found in localStorage");
      return;
    }

    try {
     
      const res = await axios.delete(`/user/other/${userId}/request/${index}`);
      if (res.status === 200) {
        setOtherRequestedUsers((prev) => prev.filter((_, i) => i !== index));
        const res3 = await axios.get(`/user/cart/${currentUserId}`);
        if (res3.status === 200) {
          dispatch(userActions.setCart(res3.data.newuser.OtherRequestedTo.length));
        }
      }
    } catch (err) {
      setError("Failed to delete the request. Please try again.");
    }
  };

  const handleDelete = async (index) => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      setError("UserId not found in localStorage");
      return;
    }

    try {
      const res1 = await axios.delete(`/user/${userId}/request/${index}`);
      if (res1.status === 200) {
        toast.success('Successfully deleted')
        setRequestedUsers((prev) => prev.filter((_, i) => i !== index));
        const res2 = await axios.get(`/user/cart/${currentUserId}`);
        if (res2.status === 200) {
          dispatch(userActions.setCart(res2.data.newuser.requestedTo.length));
        }
      }
      
    } catch (err) {
      setError("Failed to delete the request. Please try again.");
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">No signal try refreshing..</div>
      </div>
    );
  }

  return (
    <div>
      {/* Toggle Buttons for Food Cart and Services Cart */}
      <div className="flex mt-[50px] mx-auto gap-8 w-[300px] justify-center flex-col gap-4 mb-6">
        <button
          onClick={() => setShowFoodCart(!showFoodCart)}
          className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          {showFoodCart ? "Hide Food Cart" : "View Food Cart"}
        </button>
        <button
          onClick={() => setShowServicesCart(!showServicesCart)}
          className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          {showServicesCart ? "Hide Services Cart" : "View Services Cart"}
        </button>
      </div>

      {/* Food Cart Section */}
      {showFoodCart && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl flex justify-center items-center gap-2 font-extrabold text-center text-green-700 mb-8 drop-shadow-lg">
            <FaShoppingCart /> Food Cart
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
                  <div className="mb-3 flex justify-center items-center flex-col gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Name:</span>{" "}
                      {item.userDetails?.name || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Email:</span>{" "}
                      {item.userDetails?.email || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Service Count:</span>{" "}
                      {item.serviceCount}
                    </p>
                    <p className="text-sm flex justify-center items-center text-gray-600">
                      <span className="font-semibold text-gray-800">location:</span>{" "}
                      <MdLocationOn/>{location}
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
                  {["approved", "rejected"].includes(item.status) && (
                     <div>

                     <button
                      onClick={() => handleDelete(index)}
                      className="w-full px-4 py-2 bg-red-500 p-1 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow-sm transform hover:translate-y-1 transition-all duration-300"
                    >
                      Delete
                    </button>
                     </div>
                    
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">Cart is Empty</p>
          )}
        </div>
      )}

      {/* Services Cart Section */}
      {showServicesCart && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl flex justify-center items-center gap-2 font-extrabold text-center text-green-700 mb-8 drop-shadow-lg">
            <FaShoppingCart /> Services Cart
          </h1>
          {otherRequestedUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {otherRequestedUsers.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Request #{index + 1}
                  </h3>
                  <div className="mb-3 flex flex-col justify-start items-center gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Name:</span>{" "}
                      {item.userDetails?.name || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Email:</span>{" "}
                      {item.userDetails?.email || "Not Available"}
                     </p>
                    <p className="text-sm flex justify-start items-center text-gray-600">
                      <span className="font-semibold flex  text-gray-800">location:</span>{" "}
                      <MdLocationOn/>{otherLocation}
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
                  {["approved", "rejected"].includes(item.status) && (<>  
                    <button
                      onClick={() => handleOtherDelete(index)}
                      className="w-full px-4 py-1 bg-red-500 p-1 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg shadow-sm  transform hover:translate-y-1 transition-all duration-300"
                    >
                      Delete
                    </button>
                    <p className="text-black font-semibold ">delete the request to make a new request</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">Cart is Empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestedToList;
