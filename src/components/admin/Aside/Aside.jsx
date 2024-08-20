import "./aside.scss";
import { GrAppsRounded } from "react-icons/gr";
import { FaHome, FaMoneyBillAlt, FaUserTie, FaUserFriends, FaGavel, FaCog } from 'react-icons/fa'; 
import { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

export const Aside = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ currentElement, setCurrentElement ] = useState("Dashboard");

  useEffect(() => {
    const savedElement = localStorage.getItem('currentElement');
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
    localStorage.setItem('currentElement', name);
  };

  return (
    <div
      className={`aside-main ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aside-inner">
        {
          isExpanded ?
          <img className="two" src={logo} alt="logo" />
          :
          <img src={logo} alt="logo" />
        }

        <p>
          <GrAppsRounded />
        </p>
      </div>

      <div className="aside-second-row">
        {[
          { name: "Dashboard", icon: <FaHome size={20} color="teal" />, path: "/admin/dashboard" },
          { name: "Freelancers", icon: <FaUserTie size={20} color="teal" />, path: "/admin/freelancers" },
          { name: "Clients", icon: <FaUserFriends size={20} color="teal" />, path: "/admin/clients" },
          // { name: "Auction", icon: <FaGavel size={20} color="teal" />, path: "/admin/auction" },
          { name: "Billings", icon: <FaMoneyBillAlt size={20} color="teal" />, path: "/admin/billings" },
          { name: "Settings", icon: <FaCog size={20} color="teal" />, path: "/admin/settings" },
        ].map((item, index) => (
          <Link to={item.path} key={index} className={`aside-inner-2 ${currentElement === item.name ? "current" : ""}`} onClick={() => handleElementClick(item.name)}>
            <div className="img-con">
              <div className="icon">
                {item.icon}
              </div>
            </div>
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
