import React, { useState, useEffect } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { userdataApi  } from "../../utils/api/api";
import Avatar from "react-avatar";

export default function ClientConversations({ data, client ,online , unreadCount ,typingUsers}) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchusersData = async () => {
      try {
        const userId = data.members.find((id) => id !== client);
        const res = await clientAxiosInstance.get(
          `${userdataApi}?id=${userId}`
        );
        console.log(res.data, "ClientConversations");
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching client info:", error);
      }
    };
    fetchusersData();
  }, []);


  const isTyping = typingUsers.includes(userData?._id);
  return (
    <>
       <div className="flex flex-col max-h-full overflow-hidden">
      <div className="relative rounded-lg px-4 py-2 bg-teal-100 hover:bg-teal-200 cursor-pointer flex items-center gap-3 sm:gap-4 md:px-6 md:py-3 lg:px-10 lg:py-4"
      >
        <div className="relative">
          <Avatar
            name={userData?.name || "client"}
            src={userData?.profile?.location}
            size="50"
            round={true}
          />
          {online && <div className="bg-[#ADFF2F] rounded-full w-3 h-3 absolute -top-1 -right-1 md:w-4 md:h-4 md:-top-1 md:-right-1"></div>}
        </div>

        <div className="text-sm sm:text-md flex flex-col">
          <span className="font-semibold">
            {userData?.name || "client Name"}
          </span>
          <span className={online ? "text-online" : "text-black"}>
            {online ? "Online" : "Offline"}
          </span>
          {isTyping && <span className="text-xs text-gray-500">Typing...</span>}
        </div>
        {unreadCount > 0 && (
          <div className="absolute top-2 right-2 md:top-6 md:right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs md:text-sm">
            {unreadCount}
          </div>
        )}
      </div>
      <hr
        style={{ width: "100%", border: "0.1px solid #ececec" }}
        className="my-2"
      />
      </div>
    </>
  );
}
