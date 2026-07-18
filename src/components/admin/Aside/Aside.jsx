import { GrAppsRounded } from "react-icons/gr";
import { FaHome, FaMoneyBillAlt, FaUserTie, FaUserFriends, FaCog } from "react-icons/fa";
import { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

export const Aside = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentElement, setCurrentElement] = useState("Dashboard");

  useEffect(() => {
    const savedElement = localStorage.getItem("currentElement");
    if (savedElement) {
      setCurrentElement(savedElement);
    }
  }, [setCurrentElement]);

  const handleHover = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleElementClick = (name) => {
    setCurrentElement(name);
    localStorage.setItem("currentElement", name);
  };

  return (
    <div
      className={`h-screen transition-all duration-300 bg-teal-950 text-white flex flex-col py-6 px-4 z-40 fixed left-0 top-0 text-left ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-4 mb-10 w-full px-1 overflow-hidden justify-between">
        <img
          className={`object-contain transition-all duration-300 ${isExpanded ? "w-24" : "w-10"}`}
          src={logo}
          alt="logo"
        />
        {isExpanded && (
          <p className="text-teal-400">
            <GrAppsRounded size={20} />
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {[
          {
            name: "Dashboard",
            icon: <FaHome size={20} className="text-teal-400" />,
            path: "/admin/dashboard",
          },
          {
            name: "Freelancers",
            icon: <FaUserTie size={20} className="text-teal-400" />,
            path: "/admin/freelancers",
          },
          {
            name: "Clients",
            icon: <FaUserFriends size={20} className="text-teal-400" />,
            path: "/admin/clients",
          },
          {
            name: "Billings",
            icon: <FaMoneyBillAlt size={20} className="text-teal-400" />,
            path: "/admin/billings",
          },
          {
            name: "Settings",
            icon: <FaCog size={20} className="text-teal-400" />,
            path: "/admin/settings",
          },
        ].map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer w-full hover:bg-teal-900/50 overflow-hidden ${
              currentElement === item.name ? "bg-teal-900 font-semibold border-l-4 border-teal-400" : ""
            }`}
            onClick={() => handleElementClick(item.name)}
          >
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 h-0 overflow-hidden"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
