import React from "react";

const Toast = ({
  message,
  Icon,
  title,
}: {
  message: any;
  Icon: React.ElementType;
  title: string;
}) => {
  return (
    <div className="toast toast-top toast-end rounded-none">
      <div className="alert alert-success flex flex-col items-center space-x-2 rounded-md bg-violet-800 p-3">
        <span className="text-white font-sans font-semibold underline">{title}</span>
        <div className="flex flex-row gap-5">
          <Icon className="text-white text-xl" /> {/* Render passed icon */}
          <span className="text-white font-sans">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
