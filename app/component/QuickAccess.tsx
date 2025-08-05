import React from "react";

const QuickAccess = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div>
      <button className="btn btn-sm rounded-md shadow-xl border border-slate-500 hover:bg-violet-500 transition-all duration-300 active:scale-105 bg-violet-800 text-white" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default QuickAccess;
