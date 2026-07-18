import { MdArrowForward } from "react-icons/md";
import { useState } from "react";
import welcome from "../../assets/start.png";

export default function ProfileStart({ onProfileStart, user }) {
  const [bgPosition, setBgPosition] = useState("20% 20%");

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;
    const x = (offsetX / clientWidth) * 100;
    const y = (offsetY / clientHeight) * 100;

    const shakeX = x + (Math.random() - 0.5) * 10;
    const shakeY = y + (Math.random() - 0.5) * 10;
    setBgPosition(`${shakeX}% ${shakeY}%`);
  };

  return (
    <div
      className="p-0 md:p-16 transition-[background-position] duration-100 ease-out bg-gradient-to-b from-white via-green-50 to-white"
      onMouseMove={handleMouseMove}
      style={{
        backgroundPosition: bgPosition,
        backgroundSize: "200% 200%",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-[40%] mb-8 md:mb-0 flex flex-col items-start text-left">
          <h1 className="mt-0 md:-mt-24 text-3xl md:text-4xl font-bold mb-4 text-teal-600">
            Welcome to QuickWork <br />
            {user ? user.name : ""}
          </h1>
          <h5 className="text-md mb-8 font-bold text-gray-700">
            We need to get a sense of your profile, experience and skills. It’s
            quickest to import your information — you can edit it before your
            profile goes live.
          </h5>
          <button
            type="button"
            onClick={onProfileStart}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition-colors cursor-pointer"
          >
            <span>Let's Get Started</span>
            <MdArrowForward className="text-lg" />
          </button>
        </div>

        <img
          src={welcome}
          alt="Landing Page Image"
          className="w-full md:w-1/2 mb-4 md:mb-0 px-10 py-[15px] mr-0 md:mr-[55px] max-h-[700px] object-contain"
        />
      </div>
    </div>
  );
}
