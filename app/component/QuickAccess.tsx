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
      <button className="btn btn-sm glass bg-violet-800 text-white" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default QuickAccess;
