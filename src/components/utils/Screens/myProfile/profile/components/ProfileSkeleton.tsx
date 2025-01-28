// ProfileSkeleton.tsx
import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background p-4">
      <div className="md:flex px-4 py-5 md:gap-10">
        <div className="md:w-2/3 w-full">
          {/* Skeleton for Profile Completion */}
          <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>

          {/* Skeleton for About Me */}
          <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>

          {/* Skeleton for Experience */}
          <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>

          {/* Add more skeleton blocks as needed */}
        </div>
        
        <div className="md:w-1/3 w-full">
          {/* Skeleton for Additional Details */}
          <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Add more skeleton blocks as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
