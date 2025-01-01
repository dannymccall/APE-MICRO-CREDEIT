import React from "react";
import { useEffect, useState } from "react";

const TextChange = ({ className }: { className?: string }) => {
  const [animation, setAnimation] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const changingText = [
    "Providing access to financial resources for individuals and small businesses to help build a brighter future.",
    "Even a small loan can make a huge difference in someone’s life. Let us help you grow.",
    "Every entrepreneur has a dream. With our microfinance programs, those dreams can become reality."
  ];

  useEffect(() => {
    const interVal = setInterval(() => {
      const lastIndex = currentIndex === changingText.length - 1;
      const newIndex = lastIndex ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, 8000);
    return () => {
      clearInterval(interVal);
    };
  });

  return (
    // <div className={`drop-shadow-md transition-[1s] duration-500 ease-in-out ${animation}`}>
    <>
      {/* {changingText[currentIndex]}  */}
      {changingText?.map((items, idx) => (
        <div
          className={`${className} opacity-0 text-white text-center font-semibold transition-opacity duration-[0.3s] ease-[ease] drop-shadow-md capitalize ${
            idx === currentIndex ? "!opacity-100" : ""
          }`}
          key={idx}
        >
          {items}
        </div>
      ))}
    </>
  );
};

export default TextChange;
