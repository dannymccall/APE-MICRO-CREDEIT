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
    <section className="toast toast-top toast-end rounded-none z-10">
      <section className="alert alert-success flex flex-col space-x-2 rounded-md bg-violet-800 p-3">
        <section className="flex flex-row gap-5">
          <Icon className="text-white text-xl" /> {/* Render passed icon */}
          <span className="text-white font-sans text-left text-sm">{message}</span>
        </section>
      </section>
    </section>
  );
};

export default Toast;
