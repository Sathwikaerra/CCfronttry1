import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {useSelector} from 'react-redux'

const Ordering = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {currentUser}= useSelector((state) => state.user);
  // console.log(currentUser.newUser)
  const currentUserId = localStorage.getItem("UserId"); // Get the current user ID from localStorage

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBars, setSelectedBars] = useState([]); // Track selected bars
  const [otpSent, setOtpSent] = useState(false); // Flag to check if OTP is sent
  const [otp, setOtp] = useState(""); // Store OTP value
  const [otpValid, setOtpValid] = useState(false); // Validate OTP input

  // Fetch user details by ID
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/${userId}`);
      setUser(response.data.newuser);
      setError("");
    } catch (err) {
      setError('');
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection of a bar
  const toggleBarSelection = (index) => {
    setSelectedBars((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((id) => id !== index) // Deselect
        : [...prevSelected, index] // Select
    );
  };

  // Handle the submit of the selected bars count
  const handleSubmit = async () => {
    const selectedCount = selectedBars.length;
    try {
      // Sending OTP to the active user
      const response = await axios.post(`/user/send-otp/${userId}`, {
        email:user.email,
         // Sending the requesting user's ID
      });
      if (response.status === 200) {
        setOtpSent(true); // OTP sent successfully
        setError("");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`/user/verify-otp/${userId}`, {
        otp,
      });
      if (response.status === 200) {
        setOtpValid(true); // OTP verified successfully
        // Proceed with the service request if OTP is valid
        await axios.put(`/user/updatecount/${userId}`, {
          serviceCount: Math.max(0, user.serviceCount - selectedBars.length),
          count:selectedBars.length, // Ensure serviceCount doesn't go negative
          modifiedBy: currentUserId,
        });
        setError(""); // Clear error on successful update
        navigate(`/orders/${userId}`); // Redirect to the order page
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {user ? (
        <div>
          <p className="mb-2"><strong>Name:</strong> {user.name}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="mb-2"><strong>Current Service Count:</strong> {user.serviceCount}</p>

          <div className="mb-4">
            <label htmlFor="serviceCount" className="block mb-2 font-semibold">
              Select Service Count (0 to 5):
            </label>
            <div className="flex gap-2">
              {/* Render bars based on the service count */}
              {user.serviceCount > 0 &&
                [...Array(user.serviceCount)].map((_, index) => (
                  <div
                    key={index}
                    onClick={() => toggleBarSelection(index)}
                    className={`w-10 h-10 cursor-pointer rounded-md ${
                      selectedBars.includes(index) ? "bg-green-500" : "bg-blue-500"
                    }`}
                  ></div>
                ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full py-2 px-4 ${
              user.serviceCount === 0 ? "bg-red-600" : "bg-blue-600"
            } text-white rounded-lg hover:bg-blue-700`}
            disabled={user.serviceCount === 0}
          >
            {user.serviceCount === 0 ? "Limit Reached" : "Request Service"}
          </button>

          {/* OTP Verification */}
          {otpSent && !otpValid && (
            <div className="mt-4">
              <label htmlFor="otp" className="block mb-2 font-semibold">
                Enter OTP:
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-md"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>No user found.</div>
      )}
    </div>
  );
};

export default Ordering;
