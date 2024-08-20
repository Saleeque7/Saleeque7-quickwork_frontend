import { useEffect, useState } from "react";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { NotificationsApi , NotificationMarkasReadApi } from "../../utils/api/api";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notification, setNotification] = useState("");
  const navigate = useNavigate()
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userAxiosInstance.get(NotificationsApi);
        console.log(response.data, "ag");
        if (response.status === 200) {
          setNotification(response.data);
        }
      } catch (error) {
        console.error("error in fetching notification");
      }
    };
    fetchNotifications();
  }, []);

  const contract = {
    id: 1,
    contractTitle: "Front-End Developer Needed",
    description:
      "We need an experienced front-end developer to build a responsive website.",
    budget: "1500 USD",
    deadline: "2024-07-31",
    postedTime: "2 hours ago",
  };

  const markNotificationAsRead = async (id) => {
    setNotification((prevNotifications) =>
      prevNotifications.map((n) =>
        n._id === id ? { ...n, status: 'read' } : n
      )
    );
    handleContractView(id);
  };

  const handleNotificationClick = async (notification) => {
    if (notification.status !== 'unread') {
        return;
      }
    try {
      const response = await userAxiosInstance.patch(`${NotificationMarkasReadApi}?id=${notification._id}`);
      if (response.status === 200) {
        await markNotificationAsRead(notification._id);
      } else {
        throw new Error('Failed to update notification status');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const handlecontractView = (id) => {
    navigate(`/user/contract/${id}`)
  };

  return (
    <>
    <div className="p-5 min-h-[100vh]">
      <div className="flex justify-start items-center">
        <div className="mt-4 pt-10 pl-28">
          <span className="text-teal-700 text-3xl">Notifications</span>
        </div>
      </div>
      <div className="flex justify-center mt-3">
        <hr className="w-full mx-16 bg-gray-200" style={{ height: "1px" }} />
      </div>
      <div className="p-10">
        {notification.length > 0 ? (
          <section className="px-10">
            <div className="flex justify-start  pb-5">
              <h1 className="text-3xl text-gray-700 font-bold">
                All notifications
              </h1>
            </div>
            <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
              <input
                aria-label="Search"
                placeholder="Search"
                type="search"
                className="px-4 py-2 outline-none w-full rounded-l-xl"
              />
              <FaSearch className="text-gray-500 mx-2" />
            </div>
            <div className="w-full mx-auto py-8">
              {notification.map((notification) => (
                 <div
                 key={notification._id}
                 className={`flex justify-between items-center p-4 mb-4 border rounded-lg shadow-md ${
                   notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                 }`}
                 onClick={() => handleNotificationClick(notification)}
               >
                
                  <div
                    className="cursor-pointer"
                  >
                    <h2 className="text-md">
                    
                      <span className="font-semibold mx-2">
                        {notification?.message|| ""}
                      </span>
                 
                    </h2>
                  </div>
                  <div className="flex items-center px-5 pl-10 space-x-4">
                  
                    <div className="flex items-center mr-5 space-x-2">
                      {notification?.proposalId?.status ===
                      "accepted" ? (
                        <>
                          <FaCheckCircle className="text-md text-green-500" />
                          <span className="text-green-500">accepted</span>
                        </>
                      ) : contract?.userSide?.status === "terminated" ? (
                        <>
                          <FaTimesCircle className="text-md text-red-500" />
                          <span className="text-red-500">terminated</span>
                        </>
                      ) : (
                        <span className="text-gray-700">pending</span>
                      )}
                    </div>

                    <button className="text-blue-500 hover:text-teal-600 focus:outline-none ml-2 flex items-center" 
                    onClick={() => handlecontractView(notification?.contractId?._id)}
                    >
                      <FaEye className="mr-1" />
                      view
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="flex justify-center">
            You don't have any notifications yet
          </div>
        )}
      </div>
      </div>
    </>
  );
}
