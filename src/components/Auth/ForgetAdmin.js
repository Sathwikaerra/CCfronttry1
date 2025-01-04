import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState(null); // For showing notifications
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/admins/forgot-password', { email });
      if (response.status === 200) {
        setResetToken(response.data.resetToken);
        // Send OTP
        const sendOtp = await axios.post('/send-otp', { email });
        if (sendOtp.status === 200) {
          setIsOtp(true);
          showNotification('Enter the OTP and verify', 'success');
        }
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Network error, please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/admins/reset-password', {
        resetToken,
        email,
        newPassword,
      });

      if (response.status === 200) {
        showNotification('Password has been reset successfully!', 'success');
        setTimeout(() => {
            navigate('/admin-login');

            
        }, 1000);
       
      } else if (response.status === 403) {
        showNotification('Password must have at least 6 characters', 'error');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post('/verify-otp', { email, otp });
      if (res.status === 200) {
        setIsOtp(false);
        setIsReset(true);
        showNotification('OTP verified successfully!', 'success');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Wrong OTP.', 'error');
    }
  };

  // Custom notification function
  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000); // Dismiss after 5 seconds
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800">
      <form
        onSubmit={isReset ? handleResetPassword : handleForgotPassword}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg rounded-lg p-8 w-80"
      >
        <h2 className="text-2xl text-white font-bold mb-6">
          {isReset ? 'Reset Password' : 'Forgot Password'}
        </h2>

        {/* Email input (only shown in Forgot Password) */}
        {!isReset && (
          <div className="mb-4">
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        )}

        {/* OTP input (only shown after forgot password is submitted) */}
        {isOtp && (
          <div className="mb-4">
            <label className="block text-white w-[200px] mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* New Password input (only shown in Reset Password) */}
        {isReset && (
          <div className="mb-4">
            <label className="block text-white mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500   p-2 text-black rounded-lg"lg   >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!isOtp && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            {loading ? (isReset ? 'Resetting...' : 'Sending...') : isReset ? 'Reset Password' : 'Send Reset Link'}
          </button>
        )}
      </form>

      {/* Custom Notifications */}
      {notification?.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
