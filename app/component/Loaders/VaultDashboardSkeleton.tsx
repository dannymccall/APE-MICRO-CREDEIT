import React from "react";

const VaultDashboardSkeleton: React.FC = () => {
  return (
    <section className="w-full p-4 md:p-8 animate-pulse">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 bg-gray-200 h-6 w-48 rounded text-center m-auto"></h2>
      <div className="bg-violet-100 rounded-2xl p-6 md:p-10 shadow-sm w-full max-w-4xl mx-auto flex flex-col gap-4 relative">
        {/* Vault title */}
        <div className="h-4 w-32 bg-violet-200 rounde m-auto" />

        {/* Balance */}
        <div className="h-5 w-52 bg-violet-200 rounded" />

        {/* Date and transactions */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-40 bg-violet-200 rounded" />
          <div className="h-4 w-32 bg-violet-200 rounded" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-violet-200 rounded-md" />
          ))}
        </div>

        {/* Shield icon */}
        <div className="absolute top-6 right-6 h-6 w-6 bg-violet-300 rounded-full" />
      </div>
    </section>
  );
};

export default VaultDashboardSkeleton;
