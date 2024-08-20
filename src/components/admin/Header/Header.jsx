import React, { useState } from "react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { logoutAdmin } from "../../../utils/Redux/adminSlice";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Header.scss";

export const Header = () => {
  const admin = useSelector((state)=>state.persisted.admin.admin)

  const dispatch = useDispatch ()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adminLogoutHandler=async()=>{
    localStorage.removeItem('currentElement');
     dispatch(logoutAdmin())
    navigate('/admin/login');
  }
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header-main">
      <div className="h-inner">
        <div className="icon-button">
          <FiBell size={24} />
        </div>
        <div className="profile-menu">
          <div className="menu-button" onClick={toggleMenu}>
            <img
              className="avatar"
              src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              alt="Admin"
            />
            <span className="admin-name">{admin ? admin.name : "admin"}</span>
            <FiChevronDown />
          </div>
          {isMenuOpen && (
            <div className="menu-list">
              <div className="menu-item">Profile</div>
              <div className="menu-item" onClick={adminLogoutHandler}>Sign out</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
