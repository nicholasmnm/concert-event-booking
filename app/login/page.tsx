"use client";

import { useState, useEffect } from "react";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import toast for notifications

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && isAdmin) {
      router.push("/admin");
    } else if (user && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
  
    try {
      await login(email, password); // Try to login
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login Error:", error.message); // Log full error message
      toast.error(error.message || "An error occurred. Please try again."); // Show the error message to the user
    }
  };  

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-black flex items-center justify-center">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-4xl font-bold mb-4 text-white text-center">Login</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border-2 border-transparent rounded-lg mb-4 text-white bg-gray-700 bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 border-2 border-transparent rounded-lg mb-4 text-white bg-gray-700 bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 transform -translate-y-1/2 text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
        >
          Login
        </button>

        <div className="mt-4 text-center text-white">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
