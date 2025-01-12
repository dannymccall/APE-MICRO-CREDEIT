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
      <button className="btn bg-violet-800 text-white w-28 h-3" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default QuickAccess;
