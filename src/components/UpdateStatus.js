import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser, getRequestUsers } from "./ApI/Api";
import Loader from "./Loader";

const ToggleActiveStatus = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestUsers, setRequestUsers] = useState([]);
  const [isUsersVisible, setIsUsersVisible] = useState(false);
  const [emailSending, setEmailSending] = useState(null);
  const [notifiedUsers, setNotifiedUsers] = useState([]);
  const [message, setMessage] = useState(null);

  const userId = localStorage.getItem("UserId");
  const notificationTimeout = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const res = await getUser(userId);
        setCurrentUser(res.newuser);
        setIsActive(res.newuser.active);

        const requestRes = await getRequestUsers();
        const filteredUsers = requestRes.users.filter((user) => user._id !== userId);
        setRequestUsers(filteredUsers);
      } catch (err) {
        setError(null);
      }
    };

    const storedNotifiedUsers = JSON.parse(localStorage.getItem("notifiedUsers")) || [];
    setNotifiedUsers(storedNotifiedUsers);

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleToggleStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put("/user/update-status", {
        id: userId,
        activeStatus: !isActive,
      });

      if (response.status === 200) {
        setIsActive(!isActive);
        showMessage("User status updated successfully!", "success");
        if (isActive) {
          setIsUsersVisible(false); // Hide waiting users when deactivated
        }
      }
    } catch (err) {
      showMessage("Failed to update status. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUsers = () => {
    setIsUsersVisible(!isUsersVisible);
  };

  const handleSendEmail = async (user) => {
    setEmailSending(user._id);
    try {
      const response = await axios.post("/user/Alert/send-email", {
        email: user.email,
        subject: "Food Parcel Notification",
        message: `Hello ${user.name}, someone is trying to bring you a food parcel. Please check.`,
      });

      if (response.status === 200) {
        showMessage(`Email sent to ${user.name} successfully!`, "success");
        const updatedNotifiedUsers = [
          ...notifiedUsers,
          { userId: user._id, notifiedAt: Date.now() },
        ];
        setNotifiedUsers(updatedNotifiedUsers);
        localStorage.setItem("notifiedUsers", JSON.stringify(updatedNotifiedUsers));
      } else {
        showMessage(`Failed to send email to ${user.name}.`, "error");
      }
    } catch (err) {
      showMessage(`Failed to send email to ${user.name}.`, "error");
    } finally {
      setEmailSending(null);
    }
  };

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const canNotify = (userId) => {
    const notifiedUser = notifiedUsers.find((user) => user.userId === userId);
    if (notifiedUser) {
      const timeElapsed = Date.now() - notifiedUser.notifiedAt;
      return timeElapsed >= notificationTimeout;
    }
    return true;
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center mt-[30px] items-center flex-col gap-2">
        <Loader />
        <p className="text-white font-serif">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex mt-[50px] flex-col w-[300px] justify-center items-center gap-4 mt-4 px-4 py-4 bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-lg shadow-lg max-w-lg mx-auto">
      {message && (
        <div
          className={`fixed top-4 px-4 py-2 rounded ${message.type === "success" ? "bg-green-500" : "bg-red-500"} text-white shadow-lg`}
        >
          {message.text}
        </div>
      )}

      <h2 className="text-2xl text-yellow-100 font-serif mb-4 text-center">Deliver & Earn</h2>

      <div className="flex items-center justify-center flex-col gap-4 mb-4">
        <p className={`font-medium text-lg ${isActive ? "text-green-600" : "text-red-600"}`}>
          {isActive ? (
            <span className="text-[14px] font-bold ">You are Active Now.</span>
          ) : (
            <span className="text-[12px] font-bold ">You are Inactive Now.</span>
          )}
        </p>
        <button
          onClick={handleToggleStatus}
          className={`px-6 py-3 rounded-full text-white font-serif transition duration-200 transform ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? (
            "Updating..."
          ) : isActive ? (
            <span className="text-[12px]">Click here to Deactivate</span>
          ) : (
            <span className="text-[14px]">Click here to Activate</span>
          )}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}

      {isActive && (
        <button
          onClick={handleToggleUsers}
          className="mt-4 px-6 py-3 rounded-full text-white font-serif bg-blue-500 hover:bg-blue-600 text-sm"
        >
          {isUsersVisible ? "Hide Waiting Users" : "Show Waiting Users"}
        </button>
      )}

      {isUsersVisible && (
        <div className="mt-4 flex flex-col justify-center items-center gap-4">
          {requestUsers.length === 0 ? (
            <div className="text-white text-sm">No Waiting Users</div>
          ) : (
            requestUsers.map((user) => (
              <div
                key={user._id}
                className="flex w-[300px] items-center justify-between bg-yellow-100 p-3 rounded-lg  sm:w-[280px]"
              >
                <p className="text-sm  text-black font-semibold">{user.name}</p>
                <button
                  onClick={() => handleSendEmail(user)}
                  className={`${
                    !canNotify(user._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-lg text-sm`}
                  disabled={!canNotify(user._id) || emailSending === user._id}
                >
                  {emailSending === user._id
                    ? "Sending..."
                    : !canNotify(user._id)
                    ? "Notified"
                    : "Notify"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleActiveStatus;
