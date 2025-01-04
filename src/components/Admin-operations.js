import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOperations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name"); // Default search is by name
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/search`, {
        params: {
          searchBy,
          searchTerm,
        },
      });
      setResults(response.data.users);
    } catch (error) {
      toast.error("Search failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg w-full max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-xl font-semibold text-white text-center mb-4">
        Admin Operations
      </h2>

      <div className="flex gap-4 mb-4 w-full justify-center">
        <button
          onClick={() => setSearchBy("name")}
          className={`text-white py-1 px-4 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out transform ${
            searchBy === "name" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          Name
        </button>
        <button
          onClick={() => setSearchBy("phoneNumber")}
          className={`text-white py-1 px-4 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out transform ${
            searchBy === "phoneNumber" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          Mobile
        </button>
        <button
          onClick={() => setSearchBy("email")}
          className={`text-white py-1 px-4 rounded-full text-sm font-semibold transition-transform duration-300 ease-in-out transform ${
            searchBy === "email" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          Email
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Enter ${searchBy} to search`}
        className="w-full p-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-transform duration-300 ease-in-out transform"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mt-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Search
      </button>

      {loading && <p className="text-white mt-2 text-sm">Loading...</p>}

      {results.length > 0 && (
        <div className="mt-4 space-y-3 w-full">
          {results.map((user) => (
            <div
              key={user._id}
              className="bg-gray-700 p-3 rounded-md text-white shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
            >
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-300">Email: {user.email}</p>
              <p className="text-xs text-gray-300">Mobile: {user.phoneNumber}</p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <p className="text-gray-400 text-sm">No results found.</p>
      )}
    </div>
  );
};

export default AdminOperations;
