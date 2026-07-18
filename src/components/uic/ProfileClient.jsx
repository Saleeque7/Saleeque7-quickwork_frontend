// ProfileCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileClient = ({ userInfo }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    // navigate('/client/home')
  };

  return (
    <div className="flex items-center p-2 bg-transparent rounded-sm mr-4">
      <img
        name={userInfo?.name}
        src={userInfo?.profilePicture || "/default-avatar.png"}
        onClick={handleNavigate}
        className="w-10 h-10 rounded-full cursor-pointer object-cover"
        alt={userInfo?.name}
        onError={(e) => {
          e.target.src = "https://bit.ly/broken-link"; // fallback or placeholder
        }}
      />
    </div>
  );
};

export default ProfileClient;
