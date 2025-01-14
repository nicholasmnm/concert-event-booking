"use client";

import { useState } from "react";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import toast for notifications
import { db } from "@/lib/firebase"; // Import Firebase Firestore
import { doc, setDoc } from "firebase/firestore"; // Firestore methods

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for user's name
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state for success message
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // Prevent sign-up for the admin email
    if (email === ADMIN_EMAIL) {
      setError("Admin email cannot be used for sign-up.");
      toast.error("Admin email cannot be used for sign-up.");
      return;
    }

    // Validate email format
    if (!validateEmailFormat(email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email address format.");
      return;
    }

    try {
      // Create user with email and password (Firebase Auth)
      await signup(email, password);

      // Add user name to Firestore
      const userRef = doc(db, "users", email); // Reference to the user document in Firestore
      await setDoc(userRef, {
        name: name,
        email: email,
        createdAt: new Date(),
      });

      // Show success modal
      setShowSuccessModal(true);

      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/"); // Redirect to events page after sign-up
      }, 4000); // Delay for modal display
    } catch (error: any) {
      if (error.message.includes("already in use")) {
        setError("This email is already registered. Please use another email.");
        toast.error("This email is already registered.");
      } else {
        setError("An error occurred during sign-up. Please try again.");
        toast.error("An error occurred during sign-up.");
      }
      console.error("Error signing up:", error.message);
    }
  };

  // Email format validation using regex
  const validateEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-black flex items-center justify-center">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-4xl font-bold mb-4 text-white text-center">Sign Up</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Show error message if exists */}
        
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
          <input
            type="text"
            id="name"
            className="w-full p-3 border-2 border-transparent rounded-lg mb-4 text-white bg-gray-700 bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

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
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center text-white">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-xl w-80">
            <h2 className="text-xl font-bold mb-4">Sign-up Successful!</h2>
            <p className="mb-4">Your account has been created successfully. You will be redirected shortly.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
