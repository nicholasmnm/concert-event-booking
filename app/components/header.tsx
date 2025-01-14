"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/useAuth";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const { user, logout, isAdmin, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && !isAdmin) {
        console.log("Fetching Firestore data for:", user.email); // Debug
        const userRef = doc(db, "users", user.email || "");
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          console.log("User data:", userSnap.data()); // Debug
          setUsername(userSnap.data().name);
        } else {
          console.log("User data not found");
        }
      } else if (isAdmin) {
        setUsername("Admin");
      }
    };
  
    fetchUserData();
  }, [user, isAdmin]);  

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful!");
    router.push("/");
  };

  if (loading) {
    // Optionally return a loader or empty fragment while loading
    return null; 
  }

  return (
    <header className="bg-gradient-to-r from-purple-900 to-black p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-4xl font-bold italic">
          SpinoSphere
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {user ? (
              <li className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="pr-10 flex items-center space-x-2 text-white hover:text-gray-300 transition duration-300 ease-in-out"
                >
                  <FaUserCircle size={32} />
                  <span className="text-white font-semibold">{username || "Username"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 ease-out opacity-90 md:left-auto md:right-0 md:translate-x-0">
                    <ul className="space-y-3">
                      {!isAdmin && (
                        <>
                          <li>
                            <Link
                              href="/profile"
                              className="block text-white text-center hover:bg-purple-700 p-2 rounded-lg transition duration-300 ease-in-out"
                            >
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/my-tickets"
                              className="block text-white text-center hover:bg-purple-700 p-2 rounded-lg transition duration-300 ease-in-out"
                            >
                              My Tickets
                            </Link>
                          </li>
                        </>
                      )}
                      {isAdmin && (
                        <li>
                          <Link
                            href="/admin"
                            className="block text-white text-center hover:bg-purple-700 p-2 rounded-lg transition duration-300 ease-in-out"
                          >
                            Admin Page
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-white text-center hover:bg-purple-700 p-2 rounded-lg transition duration-300 ease-in-out"
                        >
                          <FaSignOutAlt size={18} className="inline-block mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-white font-bold hover:text-gray-300 transition duration-300 ease-in-out"
                  >
                    LOGIN
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-white font-bold hover:text-gray-300 transition duration-300 ease-in-out"
                  >
                    SIGN UP
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
