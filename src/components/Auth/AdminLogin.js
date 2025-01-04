import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminActions } from "../../store/reducers";
import { Draggable } from "react-draggable"; // Import Draggable

const AdminLogin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/admin/login", { email, password });

      if (response.status === 200) {
        toast.success("Login successful");

        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminId", response.data.adminId);
        localStorage.setItem("adminName", response.data.user.name);

        dispatch(adminActions.login());
        dispatch(adminActions.loginSuccess(response.data.user));

        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Custom toast container for draggable toasts
  const draggableToast = (message) => (
    <Draggable>
      <div>{message}</div>
    </Draggable>
  );

  return (
    <div className="flex justify-center mx-auto w-[300px] items-center mt-[50px] bg-gray-800">
      <div className="bg-gray-700 p-4 rounded-lg shadow-md text-gray-200 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute inset-y-0 right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"} {/* Button label */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-600 text-white px-4 py-2 rounded ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          
        </form>
        <button
          className="mt-4 text-red-500 underline hover:text-blue-600 text-sm"
          onClick={() => navigate('/forget-admin')}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
