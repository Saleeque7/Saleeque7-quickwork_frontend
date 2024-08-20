import { useState, useEffect } from "react";
import { adminAxiosInstance } from "../../../utils/api/privateAxios";
import { collectUserDataApi ,blockUserApi , unblockUserApi } from "../../../utils/api/api";
import  './listUsers.scss'

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
      const response = await adminAxiosInstance.get(collectUserDataApi,{
        search: searchQuery
      });

      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const BlockUser = async(userId)=>{
    try {
      const response = await adminAxiosInstance.put(`${blockUserApi}?id=${userId}`);
      const updatedUser = response.data.user; 
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

    } catch (error) {
      console.error("Error blocking user", error);
    }
  }

  const UnblockUser =async(userId)=>{
    try {
      const response = await adminAxiosInstance.put(`${unblockUserApi}?id=${userId}`);
      const updatedUser = response.data.user; 
 
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

    } catch (error) {
      console.error("Error unblockblocking user", error);
    }
  }
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="main-class">
      <div className="user-Head">
        <h1>Freelancers</h1>      
      </div>
    <div className="temp-list-main">
      <div className="search-inner">
        <div className="search-box">
          <input type="text" placeholder="Search...."      value={searchQuery}
              onChange={handleSearch} />
        </div>
      </div>

      <div className="table-main">
        <div className="inner-table">
          <div className="column">Freelancer</div>
          <div className="column">Email</div>
          <div className="column">Professional Role</div>
          <div className="column">Status</div>
          <div className="column">Action</div>
        </div>

        {users.map((user) => (
          <div className="loop-row" key={user._id}>
            <div className="column">
              <div className="img-2">
                <img src={user?.profile?.location || user?.profile  ? user?.profile?.location || user?.profile :"" } alt="" />
                <p>{user.name ?user.name :""}</p>
              </div>
            </div>
            <div className="column">{user.email ? user.email :""}</div>
            <div className="column"></div>
            <div className="column">
             { user.isBlock ?
              <span className="span_1" >InActive</span>
              :
              <span>Active</span>
            }
            </div>
            <div className="column">
             { !user.isBlock ?<button onClick={() => BlockUser(user._id)}>Block</button>
             :
              <button className="un-block" onClick={() => UnblockUser(user._id)}>UnBlock</button>}
            </div>
          </div>
         ))} 
      </div>
    </div>
    <div className="Pagination">
      {Array.from({ length: totalPages }, (_, index) => (
    <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
              // onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
    </div>
    </div>
  )
}
