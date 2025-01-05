import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import { useDispatch,useSelector } from "react-redux";
import { userActions } from "../store/reducers";

const Ordering = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("UserId");
  const {currentUser} =useSelector((state)=>state.user)


  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canRequest, setCanRequest] = useState(false); // Track if the button should be visible

  const generateRandomIdentifier = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Between 1000 and 9999
    return `random_${randomNumber}`;
  };

  // Fetch User Data
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/user/${userId}`);
      setUser(res.data.newuser);

      // Check if a request already exists
      const res2 = await axios.post(`/user/request/check/${userId}`, { currentUserId });

      // If the response status is 200 and no existing request is found
      if (res2.status === 200 && !res2.data.alreadyRequested) {
        setCanRequest(true); // Show the button if a request can be made
      } else {
        setCanRequest(false); // Hide the button if the request already exists
      }
    } catch (err) {
      setError("Failed to fetch user details.");
      toast.error("Error fetching user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm Service Request
  const handleConfirmRequest = async () => {
    try {
      setIsRequesting(true);
      const identifier = generateRandomIdentifier();

      // Send OTP
      await axios.post(`/user/other/send-otp/${userId}`, {
        email: user.email,
        id: currentUserId,
      });

      // Submit Request
      await axios.put(`/user/other/set-order-request/${userId}`, {
        requestedBy: currentUserId,
        status: "pending",
        identifier,
        otherLocation:user.otherLocation,
        phoneNumber:currentUser.phoneNumber
      });

      // Fetch Updated Cart
      const res = await axios.get(`/user/other/cart/${currentUserId}`);
      if (res.status === 200) {
        dispatch(userActions.setCart(res.data.newuser.OtherRequestedTo.length));
      }

      toast.success("Request sent! Confirmation will be emailed to you.", {
        style: { backgroundColor: "green", color: "white" },
        autoClose: 3000,
      });

      setPendingRequest(true);
      setTimeout(() => {
        navigate("/two-cart");
      }, 1000);
    } catch (err) {
      setError("Failed to send request.");
      toast.error("Error sending request. Please try again.");
    } finally {
      setIsRequesting(false);
      setShowModal(false);
    }
  };

  // Handle Modal Close with Escape Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) setShowModal(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center mt-8 items-center flex-col gap-2">
        <Loader />
        <p className="text-white font-serif">Loading...</p>
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-md mt-[50px] mx-auto mt-6 w-[300px] bg-yellow-50 text-gray-800 shadow-2xl rounded-xl p-5 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        User Details
      </h1>
      {user ? (
        <div>
          <p className="mb-2 text-sm font-bold">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="mb-2 text-sm font-bold">
            <strong>Email:</strong> {user.email}
          </p>
          {
            canRequest ? <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-5 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-md font-semibold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting..." : "Request Service"}
          </button>: 
           <button
          //  onClick={() => setShowModal(true)}
           className="w-full py-2 px-5 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-md font-semibold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
           disabled={isRequesting}
         >
           Already Requested please check the cart for status
         </button>

          }

          {pendingRequest && (
            <div className="mt-4 bg-yellow-200 text-yellow-800 p-4 rounded-md shadow-md text-center">
              <p className="text-sm font-bold">
                Your request is pending approval.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>No user found.</div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <h2 className="text-lg font-bold mb-3">Confirm Service Request</h2>
            <p className="mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-gray-300 text-black rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequest}
                className={`px-3 py-1.5 ${
                  isRequesting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                } rounded-lg`}
                disabled={isRequesting}
              >
                {isRequesting ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
      />
    </div>
  );
};

export default Ordering;
