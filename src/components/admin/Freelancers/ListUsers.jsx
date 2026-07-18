import { useState, useEffect } from "react";
import { adminAxiosInstance } from "../../../utils/api/privateAxios";
import { collectUserDataApi, blockUserApi, unblockUserApi } from "../../../utils/api/api";

export default function ListUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAxiosInstance.get(collectUserDataApi, {
        search: searchQuery,
      });

      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const BlockUser = async (userId) => {
    try {
      const response = await adminAxiosInstance.put(
        `${blockUserApi}?id=${userId}`
      );
      const updatedUser = response.data.user;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error blocking user", error);
    }
  };

  const UnblockUser = async (userId) => {
    try {
      const response = await adminAxiosInstance.put(
        `${unblockUserApi}?id=${userId}`
      );
      const updatedUser = response.data.user;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error unblockblocking user", error);
    }
  };

  return (
    <div className="p-6 text-left w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Freelancers</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <div className="mb-4 flex justify-end">
          <div>
            <input
              type="text"
              placeholder="Search...."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 rounded px-4 py-2 w-64 focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <div className="grid grid-cols-5 bg-gray-50 p-4 font-semibold text-gray-600 border-b border-gray-200">
            <div>Freelancer</div>
            <div>Email</div>
            <div>Professional Role</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {users.map((user) => (
            <div
              className="grid grid-cols-5 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center"
              key={user._id}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    user?.profile?.location || user?.profile
                      ? user?.profile?.location || user?.profile
                      : ""
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover bg-gray-100"
                />
                <p className="font-medium text-gray-800">
                  {user.name ? user.name : ""}
                </p>
              </div>
              <div className="text-gray-600 truncate pr-2">
                {user.email ? user.email : ""}
              </div>
              <div className="text-gray-600">
                {user.jobTitle ? user.jobTitle : "Freelancer"}
              </div>
              <div>
                {user.isBlock ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    InActive
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
              <div>
                {!user.isBlock ? (
                  <button
                    onClick={() => BlockUser(user._id)}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors cursor-pointer"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    onClick={() => UnblockUser(user._id)}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors cursor-pointer"
                  >
                    UnBlock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded text-sm transition-colors cursor-pointer ${
              currentPage === index + 1
                ? "bg-teal-600 text-white border-teal-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
