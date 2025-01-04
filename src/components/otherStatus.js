import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUser, getOtherRequestUsers } from "./ApI/Api";
import Loader from "./Loader";

const ToggleOtherStatus = () => {
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
  const notificationTimeout = 3 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser(userId);
        setCurrentUser(res.newuser);
        setIsActive(res.newuser.otherServices);
        const requestRes = await getOtherRequestUsers();
        const filteredUsers = requestRes.users.filter((user) => user._id !== userId);
        setRequestUsers(filteredUsers);
      } catch (err) {
        setError();
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
      const response = await axios.put("/user/other-status", {
        id: userId,
        activeStatus: !isActive,
      });

      if (response.status === 200) {
        setIsActive(!isActive);
        showMessage("User status updated successfully!", "success");
        if (isActive) {
          setIsUsersVisible(false);
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
        subject: "Delivery Service Notification",
        message: `Hello ${user.name}, someone is trying to help you from off-campus. Please check. ${`https://campus-connect-3d916.web.app/`}`,
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
    <div className="flex w-[300px] mt-[50px] flex-col justify-center items-center gap-6 mt-6 px-4 py-4 bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-lg shadow-lg max-w-lg mx-auto">
      {message && (
        <div
          className={`fixed top-4 px-4 py-2 rounded ${message.type === "success" ? "bg-green-500" : "bg-red-500"} text-white shadow-lg`}
        >
          {message.text}
        </div>
      )}

      <h2 className="text-xl  text-yellow-100 font-semibold mb-4">Enable Other Services & Earn</h2>

      <div className="flex justify-center flex-col items-center gap-4">
        <p className={`font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>
          {isActive ? (
            <span className="text-[14px] font-bold">You are Active Now.</span>
          ) : (
            <span className="text-[14px] font-bold">You are Inactive Now.</span>
          )}
        </p>
        <button
          onClick={handleToggleStatus}
          className={`px-6 py-2 rounded-full text-white font-semibold ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          disabled={loading}
        >
          {loading ? (
            "Updating..."
          ) : isActive ? (
            <span className="text-[13px]">Click here to Deactivate</span>
          ) : (
            <span className="text-[16px]">Click here to Activate</span>
          )}
        </button>
      </div>

      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}

      {isActive && (
        <button
          onClick={handleToggleUsers}
          className="mt-4 px-6 py-2 rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600"
        >
          {isUsersVisible ? "Hide Waiting Users" : "Show Waiting Users"}
        </button>
      )}

      {isUsersVisible && (
        <div className="mt-4">
          {requestUsers.length === 0 ? (
            <div className="text-white ">No Waiting Users</div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-4">
              {requestUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-yellow-100 p-3 rounded-lg w-[300px]"
                >
                  <p className="text-black font-semibold">{user.name}</p>
                  <button
                    onClick={() => handleSendEmail(user)}
                    className={`${
                      !canNotify(user._id) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-4 py-2 rounded-lg`}
                    disabled={!canNotify(user._id) || emailSending === user._id}
                  >
                    {emailSending === user._id
                      ? "Sending..."
                      : !canNotify(user._id)
                      ? "Notified"
                      : "Notify"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleOtherStatus;
