import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Signup
                </h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Signup
                    </button>
                </form>
                {error && (
                    <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}
                <div className="mt-4">
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="h-5 w-5 mr-2"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.04 0 5.33 1.29 6.56 2.37l4.84-4.85C32.91 4.43 28.73 3 24 3 14.65 3 7 10.65 7 20s7.65 17 17 17c7.93 0 14.46-5.43 16.4-12.72H24v-6.78h22c.37 1.9.6 3.87.6 6 0 9.39-6.12 17.39-14.6 19.58-1.82.48-3.82.72-5.9.72C10.75 40.58 3 32.42 3 20S10.75 3.42 24 3.42z"
                            />
                            <path fill="#34A853" d="M7.68 15.57l4.9 3.6C14.29 13.77 18.9 11.7 24 11.7c3.66 0 6.43 1.62 7.93 2.9L36.27 9C31.27 4.35 23.5 4 16.63 8.4c-4.46 2.88-7.92 8.17-9.01 14.15l4.98-3.55z" />
                            <path fill="#FBBC05" d="M24 44c-6.45 0-11.9-2.85-15.52-7.33l-4.9 3.6c2.91 4.44 8.31 7.69 14.82 7.69C33.31 48 41 40.32 41 31c0-.99-.09-1.94-.24-2.86h-16.6v6.78h9.23c-1.54 3.72-5.58 7.08-10.48 7.08z" />
                            <path fill="#4285F4" d="M41 20.14V20h-2.5v-6H24v6h13.52l.09.14z" />
                        </svg>
                        Signup with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
