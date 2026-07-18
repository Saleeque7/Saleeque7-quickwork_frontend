import React, { useState, useEffect } from "react";
import Footer from "../../components/main/footer";
import UserProfileCards from "../../components/uic/userProfileCards";
import searchImage from "../../assets/search.webp";
import Navbar from "../../components/main/Navbar";
import { useSelector } from "react-redux";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { browseUsers } from "../../utils/api/api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ClientHome() {
  const client = useSelector((state) => state.persisted.client.client);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const usersPerPage = 3;

  const handleNextPage = () => {
    if ((currentPage + 1) * usersPerPage < users.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await clientAxiosInstance.get(browseUsers);
      if (res.data) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePost = () => {
    navigate("/client/postJob");
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen text-left">
        <Navbar />
        <div className="flex justify-center items-center p-5">
          <div className="w-full bg-gray-800 text-white rounded-xl shadow-md p-12 m-12 mt-0 min-h-[30vh]">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-400 mt-[-24px]">
              Hire a pro
            </p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Get started and connect with talent to get work done
              </h1>
              <div className="mt-4 flex-shrink-0">
                <button
                  onClick={handlePost}
                  title="post a job"
                  className="flex items-center gap-2 px-6 py-2.5 border border-white rounded font-semibold text-white hover:text-teal-400 hover:border-teal-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FaPlus className="text-sm" />
                  <span>Post a job</span>
                </button>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate("/client/UserList")}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-800 rounded font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>browse talent</span>
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6 md:p-24 bg-gray-100 mt-[-96px]">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-3 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl">
            <div className="bg-gradient-to-b from-purple-200 to-orange-200 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[50vh] rounded-xl p-6 flex flex-col justify-between text-left">
              <div>
                <h2 className="text-lg font-bold text-gray-700">Guide tour</h2>
                <p className="text-xl font-bold text-gray-800 mt-4 flex items-center gap-2">
                  <span>Check out top rated talent for your open job posts</span>
                  <FaArrowRight className="text-sm flex-shrink-0" />
                </p>
              </div>
              <div className="flex justify-center items-center mt-6">
                <img src={searchImage} className="w-[180px] h-[180px] object-contain" alt="Search Guide" />
              </div>
            </div>

            <UserProfileCards
              currentPage={currentPage}
              usersPerPage={usersPerPage}
              users={users}
            />
          </div>

          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * usersPerPage >= users.length}
            className="p-3 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
