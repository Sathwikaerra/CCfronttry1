import React, { useState } from "react";
import axios from "axios";

const SuggestionPage = () => {
  const [suggestion, setSuggestion] = useState("");
  const [formStatus, setFormStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = localStorage.getItem("UserEmail");
  const userName=localStorage.getItem("UserName")

  const handleChange = (e) => {
    setSuggestion(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus(null);
  
    try {
      const response = await axios.post("/suggestions/send-email", {
        suggestion,
        userEmail,
        userName
      });
  
      if (response.status === 200) {
        setFormStatus("Suggestion sent successfully!");
        setSuggestion("");
      } else {
        setFormStatus(`Failed to send suggestion: ${response.data.error || "Unknown error"}`);
      }
    } catch (error) {
      setFormStatus(`Failed to send suggestion: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
  
      // Hide formStatus message after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000); // 3 seconds
    }
  };
  return (
    <div className="bg-transparent min-h-screen mt-[10px] text-gray-900">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Suggestions ||  Feedback 
        </h1>

        <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* <label
                htmlFor="suggestion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Suggestion
              </label> */}
              <textarea
                id="suggestion"
                value={suggestion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Write your suggestion here..."
                rows="4"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 bg-blue-600 text-white font-medium rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isLoading ? "Sending..." : "Submit"}
              </button>
            </div>

            {formStatus && (
              <div
                className={`mt-3 text-center text-sm ${
                  formStatus.startsWith("Suggestion sent")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <p>{formStatus}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuggestionPage;
