import { useState } from "react";
import { GrFavorite } from "react-icons/gr";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { CiStar } from "react-icons/ci";
import { MdOutlineWorkOutline } from "react-icons/md";
import randomimage from "../../assets/pf.png";
import { useNavigate } from "react-router-dom";

export default function UserProfileCards({ currentPage, usersPerPage, users }) {
  const navigate = useNavigate();

  const displayedUsers = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <>
      {displayedUsers.map((user) => (
        <Card key={user._id}>
          <div>
            <div className="flex items-center p-4">
              <img
                src={user?.profile?.location || randomimage}
                alt="Profile Image"
                className="w-[60px] h-[60px] rounded-full border-4 border-white shadow-sm object-cover"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-bold text-teal-700 font-serif">
                  {user?.name || "User Name"}
                </h3>
                <p className="text-xs text-gray-500">{user?.State}</p>
              </div>
            </div>
            <div className="flex justify-start px-5 py-2">
              <p className="text-xl text-gray-600 font-semibold">
                {user?.jobTitle || "Freelancer"}
              </p>
            </div>
            <div className="flex justify-between items-center p-5 border-t border-b border-gray-100">
              <div className="flex items-center gap-2">
                <RiMoneyRupeeCircleLine className="text-2xl text-teal-600" />
                <span className="text-sm font-medium text-gray-700">{user?.hourlyRate}/hr</span>
              </div>
              <div className="flex items-center gap-2">
                <CiStar className="text-2xl text-yellow-500 font-bold" />
                <span className="text-sm font-medium text-gray-700">{user?.rating || "4.3"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineWorkOutline className="text-2xl text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.committedJobs || "1"}</span>
              </div>
            </div>
            <div className="flex justify-start items-center flex-wrap p-4 gap-2">
              {user?.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center border border-gray-300 shadow-sm bg-gray-100 rounded-md px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center pb-4 mt-auto">
            <button
              onClick={() => navigate(`/client/userProfile/${user._id}`)}
              className="mt-2 px-12 py-2 border-2 border-teal-500 text-teal-600 font-semibold rounded bg-white hover:bg-teal-500 hover:text-white transition-all cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </Card>
      ))}
    </>
  );
}

const Card = ({ children }) => (
  <div className="bg-white shadow-md hover:shadow-2xl transition-all duration-300 w-full md:w-[90%] min-h-[50vh] mt-5 flex flex-col justify-between text-left rounded-xl border border-gray-100 overflow-hidden">
    {children}
  </div>
);
