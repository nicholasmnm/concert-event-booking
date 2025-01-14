// components/Loading.tsx
"use client";

import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Import a spinner from react-spinners

const Loading = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching delay (e.g., 3 seconds)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // Clean up on unmount
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <ClipLoader size={80} color={"#6B46C1"} cssOverride={{ borderWidth: "6px" }} />
            </div>
        );
    }

    return null; // If not loading, return nothing
};

export default Loading;
