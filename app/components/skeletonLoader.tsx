// components/SkeletonLoader.tsx

import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-900 to-black p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center animate-pulse">
        {/* Logo Skeleton */}
        <div className="h-8 w-32 bg-gray-700 rounded-lg"></div>
        
        <nav>
          <ul className="flex space-x-6">
            {/* Skeleton for the navigation items */}
            <li className="h-8 w-24 bg-gray-700 rounded-lg"></li>
            <li className="h-8 w-24 bg-gray-700 rounded-lg"></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SkeletonLoader;
