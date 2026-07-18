import React, { useState } from "react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { logoutAdmin } from "../../../utils/Redux/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const admin = useSelector((state) => state.persisted.admin.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adminLogoutHandler = async () => {
    localStorage.removeItem("currentElement");
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-end shadow-sm text-left">
      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600 transition-colors">
          <FiBell size={24} />
        </button>
        <div className="relative">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors" onClick={toggleMenu}>
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              alt="Admin"
            />
            <span className="text-sm font-semibold text-gray-700">{admin ? admin.name : "admin"}</span>
            <FiChevronDown className="text-gray-500" />
          </div>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors">Profile</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors" onClick={adminLogoutHandler}>Sign out</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
