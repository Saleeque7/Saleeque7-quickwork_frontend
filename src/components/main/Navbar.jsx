/* eslint-disable react/prop-types */
import Logo from "../uic/Logo.jsx";
import {
  DesktopNav,
  MobileNav,
  DesktopNavClient,
} from "./HeaderComponents/HeaderComponents.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../utils/Redux/userSlice.jsx";
import { logoutClient } from "../../utils/Redux/recruiterSlice.jsx";
import { useUserProfile } from "../../utils/context/ProfileContext";
import ProfileClient from "../uic/ProfileClient.jsx";
import { MdNotificationsNone, MdMenu, MdClose } from "react-icons/md";

const Navbar = ({ userType, userInfo }) => {
  const { userProfile, setUserProfile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (userInfo.job_role === "freelancer") {
      setUserProfile(!userProfile);
      await dispatch(logout());
    } else if (userInfo.job_role === "client") {
      await dispatch(logoutClient());
    }
    navigate("/", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login", { replace: true });
  };
  
  const handleSignup = () => {
    navigate("/pre", { replace: true });
  };

  return (
    <div
      className="sticky top-0 z-50 bg-white border-b border-gray-200/80 shadow-sm py-2.5 px-6 md:px-12 transition-all duration-300"
    >
      <div className="flex justify-between items-center h-full max-w-[1440px] mx-auto gap-4">
        {/* Mobile Nav Button */}
        <div className="flex md:hidden items-center justify-between w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <MdClose className="text-2xl text-gray-700" /> : <MdMenu className="text-2xl text-gray-700" />}
          </button>
          
          <div className="flex md:hidden text-gray-800">
            <Logo />
          </div>
        </div>

        {/* Left Side: Logo + Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Logo userInfo={userInfo} />
          
          {/* Default Nav Links for Guests */}
          {!userInfo && (
            <div className="flex items-center gap-1.5 ml-4">
              <button
                onClick={() => navigate("/pre")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                Find Talent
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                Find Work
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                Why QuickWork
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                Pricing
              </button>
            </div>
          )}
        </div>

        {/* Client Logged In Navigation */}
        {userInfo?.job_role === "client" && (
          <div className="hidden md:block">
            <DesktopNavClient userInfo={userInfo} />
          </div>
        )}

        {/* Freelancer Logged In Navigation */}
        <div className="hidden md:flex items-center">
          {userInfo?.job_role === "freelancer" && (
            <DesktopNav userInfo={userInfo} />
          )}
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-4 justify-end flex-1 md:flex-initial">
          {/* Integrated Search Bar */}
          <div className="hidden lg:flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50 focus-within:bg-white focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600 transition-all max-w-[200px] xl:max-w-[250px]">
            <MdNotificationsNone className="text-gray-400 text-lg mr-1.5" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-xs text-gray-800 outline-none w-full placeholder-gray-400 font-medium"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/login?search=${encodeURIComponent(e.target.value)}`);
                }
              }}
            />
          </div>

          {userInfo?.job_role === "client" && (
            <ProfileClient userInfo={userInfo} />
          )}
          {userInfo?.job_role === "freelancer" && (
            <button 
              className="flex items-center p-2 hover:bg-green-50 rounded-full transition-colors relative"
              onClick={() => navigate('/user/notifications')}
              title="Notifications"
            >
              <MdNotificationsNone className="text-xl text-gray-600 cursor-pointer" />
            </button>
          )}

          {userInfo ? (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleLogin}
                className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={handleSignup}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 border-t border-gray-100 pt-2">
          <MobileNav
            handleLogout={handleLogout}
            user={userInfo}
            handleLogin={handleLogin}
            userInfo={userInfo}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
