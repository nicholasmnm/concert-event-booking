import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase"; // Ensure you're using the correct auth instance

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null); // User state
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);

      if (authUser) {
        if (authUser.email?.trim().toLowerCase() === ADMIN_EMAIL?.trim().toLowerCase()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [ADMIN_EMAIL]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        console.error("FirebaseError:", error.code, error.message);
        switch (error.code) {
          case "auth/user-not-found":
            throw new Error("No user found with this email.");
          case "auth/wrong-password":
            throw new Error("Invalid password, please try again.");
          case "auth/invalid-email":
            throw new Error("The email address is badly formatted.");
          default:
            throw new Error("Invalid credentials. Please check your email and password.");
        }
      } else {
        console.error("General error:", error);
        throw new Error("An unknown error occurred during login.");
      }
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Handle user sign-up
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        console.error("Error signing up:", error.message); // Log signup errors
      } else if (error instanceof Error) {
        console.error("General error:", error.message); // Log other errors
      } else {
        console.error("An unknown error occurred during signup"); // Log unknown errors
      }
    }
  };

  const logout = () => {
    signOut(auth); // Handle user logout
  };

  return { user, isAdmin, login, signup, logout, loading };
}
