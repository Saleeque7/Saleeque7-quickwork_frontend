import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { clientdataApi,  } from "../../utils/api/api";
import Avatar from "react-avatar";

export default function Conversation({
  data,
  user,
  online,
  unreadCount
}) {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const userId = data.members.find((id) => id !== user);
        const res = await userAxiosInstance.get(
          `${clientdataApi}?id=${userId}`
        );
        setClientData(res.data);
      } catch (error) {
        console.error("Error fetching client info:", error);
      }
    };
    fetchClientData();
  }, []);




  return (
    <>
      <div className="relative rounded-lg px-10 py-3 bg-teal-100 hover:bg-teal-200 cursor-pointer flex  items-center gap-4">
        <div className="relative">
          <Avatar
            name={clientData?.name || "User"}
            src={clientData?.profileImage}
            size="50"
            round={true}
          />
          {online && (
            <div className="bg-[#ADFF2F] rounded-full w-4 h-4 absolute -top-1 -right-1"></div>
          )}
        </div>

        <div className="text-md flex flex-col">
          <span className="font-semibold">
            {clientData?.name || "User Name"}
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
