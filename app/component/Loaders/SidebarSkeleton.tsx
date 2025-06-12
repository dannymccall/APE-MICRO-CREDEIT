import React from "react";

const SidebarSkeleton: React.FC = () => {
  return (
    <aside className="w-64 bg-violet-800 min-h-screen flex flex-col items-center py-6 px-4 animate-pulse space-y-6 text-white">
      {/* App Name */}
      <div className="h-6 w-32 bg-violet-700 rounded"></div>

      {/* Avatar */}
      <div className="h-24 w-24 rounded-full bg-violet-700"></div>

      {/* Name */}
      <div className="h-4 w-40 bg-violet-700 rounded"></div>

      {/* Role */}
      <div className="h-3 w-24 bg-violet-600 rounded"></div>

      <div className="w-full flex flex-col gap-3 mt-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full bg-violet-700 rounded-md"
          />
        ))}
      </div>

      {/* Bottom circle (e.g., settings or profile icon) */}
      <div className="mt-auto mb-4">
        <div className="h-10 w-10 bg-violet-600 rounded-full"></div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
