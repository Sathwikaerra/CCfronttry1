import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state) => state.admin);

  const [users, setUsers] = useState([]);
  const [isUsersVisible, setIsUsersVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/allusers");
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentAdmin]);

  const toggleUsersVisibility = () => {
    setIsUsersVisible(!isUsersVisible);
  };

  const deleteUserById = async (id) => {
    setDeleting(id);
    try {
      const res = await axios.delete(`/admin/delete/${id}`);
      if (res.status === 200) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("User not deleted");
      }
    } catch (error) {
      toast.error("Error in deleting user");
    } finally {
      setDeleting(null);
      setConfirmDelete(null); // Close the modal after deletion
    }
  };

  const handleDeleteConfirmation = (id) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const navigateToAnotherComponent = () => {
    navigate("/another-route"); // Replace "/another-route" with the desired route
  };

  return (
    <div className="flex mt-10 justify-center items-center gap-2 flex-col px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white">Campus Connect</h1>
      <img className="w-[50px] sm:w-[60px] mb-4" src="/CC2.jpg" alt="Campus Connect Logo" />

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">Admin Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2 text-sm">Name</label>
          <p className="text-lg text-gray-200 font-medium bg-gradient-to-r from-gray-700 to-gray-600 p-2 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            {currentAdmin.name}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2 text-sm">Email</label>
          <p className="text-lg text-gray-200 font-medium bg-gradient-to-r from-gray-700 to-gray-600 p-2 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
            {currentAdmin.email}
          </p>
        </div>

        <button
          onClick={toggleUsersVisibility}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full mb-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {isUsersVisible ? "Hide Users" : "View All Users"}
        </button>

        {isUsersVisible && (
          <div className="bg-gray-700 rounded-lg p-4 mt-4 space-y-4">
            <h3 className="text-xl text-gray-200 mb-4">Users List</h3>
            {loading ? (
              <div className="flex justify-center mt-[30px] items-center flex-col gap-2">
                <Loader />
                <p className="text-white font-serif">Loading...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No users found.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-600 p-4 sm:p-6 rounded-md hover:bg-gray-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-200 font-medium text-sm sm:text-base">Name:</p>
                    <span className="text-gray-400 text-sm sm:text-base">{user.name}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-200 font-medium text-sm sm:text-base">Email:</p>
                    <span className="text-gray-400 text-sm sm:text-base">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-200 font-medium text-sm sm:text-base">Mobile:</p>
                    <span className="text-gray-400 text-sm sm:text-base">{user.phoneNumber}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteConfirmation(user._id)}
                    disabled={deleting === user._id}
                    className={`bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full mt-4 transition duration-300 ease-in-out ${
                      deleting === user._id ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    }`}
                  >
                    {deleting === user._id ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg text-white font-semibold mb-4">Are you sure you want to delete this user?</h3>
              <div className="flex justify-between">
                <button
                  onClick={() => deleteUserById(confirmDelete)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Button for Navigation */}
        <button
          onClick={()=>navigate('/admin-operations')}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md w-full mt-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Another Component
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
