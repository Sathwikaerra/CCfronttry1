import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userId = localStorage.getItem("UserId");

  const togglePasswordVisibility = (field) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 5) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`/user/update-password/${userId}`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-200 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-3 text-center">Update Password</h2>

      {/* Current Password Input */}
      <div className="mb-3">
        <label
          htmlFor="currentPassword"
          className="block text-sm text-gray-400 mb-1"
        >
          Current Password
        </label>
        <div className="flex items-center">
          <input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 text-sm"
            aria-required="true"
          />
          <button
            onClick={() => togglePasswordVisibility("current")}
            className="text-black bg-orange-300 p-1 ml-2 rounded text-xs"
          >
            {showCurrentPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* New Password Input */}
      <div className="mb-3">
        <label htmlFor="newPassword" className="block text-sm text-gray-400 mb-1">
          New Password
        </label>
        <div className="flex items-center">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 text-sm"
            aria-required="true"
          />
          <button
            onClick={() => togglePasswordVisibility("new")}
            className="text-black bg-orange-300 p-1 ml-2 rounded text-xs"
          >
            {showNewPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="mb-3">
        <label
          htmlFor="confirmPassword"
          className="block text-sm text-gray-400 mb-1"
        >
          Confirm Password
        </label>
        <div className="flex items-center">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 text-sm"
            aria-required="true"
          />
          <button
            onClick={() => togglePasswordVisibility("confirm")}
            className="text-black bg-orange-300 p-1 ml-2 rounded text-xs"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdatePassword}
        disabled={isLoading}
        className={`bg-green-600 text-white px-3 py-2 rounded w-full text-sm ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
};

export default UpdatePassword;
