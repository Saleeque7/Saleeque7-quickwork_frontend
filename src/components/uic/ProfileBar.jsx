import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import profileImage from "../../assets/pf.png";

export default function ProfileBar({ user }) {
  const profile = user?.profile?.location || profileImage;

  return (
    <div className="w-[260px] rounded-2xl overflow-hidden shadow-xl mt-24">
      <div className="bg-teal-500 h-[100px] relative">
        <img
          src={profile}
          alt="Profile Image"
          className="w-[100px] h-[100px] rounded-full border-4 border-white absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </div>
      <div className="bg-white pt-[60px] pb-4">
        <div className="flex flex-col gap-2 items-center text-center">
          <div className="font-bold text-xl text-gray-700">
            {user && (
              <a
                href="/user/viewprofile"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                {user.name}
              </a>
            )}
          </div>
          <p className="text-gray-500 text-sm">{user && user.jobTitle}</p>
          <div className="flex justify-center gap-4 mt-2">
            {user?.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-teal-600 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Github"
              >
                <FaGithub className="text-xl" />
              </a>
            )}
            {user?.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-teal-600 hover:bg-black/5 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
