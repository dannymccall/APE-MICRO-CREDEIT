import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full mx-auto bg-white rounded-md shadow p-4 space-y-6 m-3">
      {/* Header */}
      <div className="h-48 w-full bg-gradient-to-r from-violet-500 to-violet-900 rounded-md animate-pulse" />

      {/* Profile Info */}
      <div className="flex items-center space-x-4 -mt-20 px-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="w-20 h-6 bg-green-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 px-4">
        <div className="h-4 bg-purple-300 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 w-24 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-40 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 w-24 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-64 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 w-24 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 w-24 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-36 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
