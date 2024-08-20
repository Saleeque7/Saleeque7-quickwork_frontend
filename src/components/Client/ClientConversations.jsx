import React, { useState, useEffect } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { userdataApi  } from "../../utils/api/api";
import Avatar from "react-avatar";

export default function ClientConversations({ data, client ,online , unreadCount }) {
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




  return (
    <>
      <div className="relative rounded-lg px-10 py-3 bg-teal-100 hover:bg-teal-200 cursor-pointer flex  items-center gap-4">
        <div className="relative">
          <Avatar
            name={userData?.name || "client"}
            src={userData?.profile?.location}
            size="50"
            round={true}
          />
          {online && <div className="bg-[#ADFF2F] rounded-full w-4 h-4 absolute -top-1 -right-1"></div>}
        </div>

        <div className="text-md flex flex-col">
          <span className="font-semibold">
            {userData?.name || "client Name"}
          </span>
          <span className={online ? "text-online" : "text-black"}>
            {online ? "Online" : "Offline"}
          </span>
        </div>
        {unreadCount > 0 && (
          <div className="absolute top-6 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </div>
        )}
      </div>
      <hr
        style={{ width: "85%", border: "0.1px solid #ececec" }}
        className="my-2"
      />
    </>
  );
}
