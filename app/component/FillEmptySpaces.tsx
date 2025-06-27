import React from "react";

const FillEmptySpaces = ({length}:{length: number}) => {
  return (
    <>
      {Array(length)
        .fill(null)
        .map((_, i) => (
          <td
            key={i}
            className="font-semibold font-sans text-sm text-gray-900 p-1"
          >
            {"-".repeat(i === 7 ? 10 : 15)}
          </td>
        ))}
    </>
  );
};

export default FillEmptySpaces;
