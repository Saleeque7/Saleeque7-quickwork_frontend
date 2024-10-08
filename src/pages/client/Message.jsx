import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { clientChatsApi ,clientmarkasReadMessages ,clientcountUnreadMessages} from "../../utils/api/api";
import ClientConversations from "../../components/Client/ClientConversations";
import ClientChatBox from "../../components/Client/ClientChatBox";
import { config } from "../../config/config";
import { io } from "socket.io-client";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function Message() {
  const client = useSelector((state) => state.persisted.client.client);

  const [chats, setChats] = useState([]);
  const [currentChat, setcurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendmessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const socket = useRef();
  const videoCallContainer = useRef();



  useEffect(() => {
    const fetchClientChats = async () => {
      try {
        const res = await clientAxiosInstance.get(clientChatsApi);
        setChats(res.data);

        const counts = {};
        await Promise.all(
          res.data.map(async (chat) => {
            const senderId = chat.members.find((id) => id !== client._id);
            const countRes = await clientAxiosInstance.get(clientcountUnreadMessages, {
              params: { senderId, chatId: chat._id },
            });
            counts[chat._id] = countRes.data;
          })
        );
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchClientChats();
  }, [client._id]);


  useEffect(() => {
    console.log("Connecting socket...");
    console.log("API URL:", config.API);
    
    socket.current = io(config.API);

    socket.current.emit("new-user-add", client._id);
    console.log("Client ID:", client._id);

    socket.current.on("get-users", (clients) => {
      console.log("Online users:", clients);
      setOnlineUsers(clients);
    });

    socket.current.on("receive-message", (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        setReceivedMessage(data);
      }
    });

    socket.current.on('typing', (data) => {
      console.log(`${data.userId} is typing`);
      setTypingUsers(prev => [...new Set([...prev, data.userId])]);
    });

    socket.current.on('stop-typing', (data) => {
      console.log(`${data.userId} stopped typing`);
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Clean up on component unmount
    return () => {
      console.log("Disconnecting socket...");
      socket.current.disconnect();
    };
  }, [client,currentChat])

  useEffect(() => {
    if (sendmessage !== null) {
      console.log("Sending message to socket:", sendmessage);
      socket.current.emit("send-message", sendmessage);
    }
  }, [sendmessage])

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== client._id);
    const online = onlineUsers.find((client) => client.userId === chatMember);
    return online ? true : false
  }


  const handleTyping = (chat_id , user_id) => {
 
    if (chat_id) {
      socket.current.emit("typing", { chatId: chat_id, userId: user_id });
    }
  };

  const handleStopTyping = (chat_id , user_id) => {
    if (chat_id) {
      socket.current.emit("stop-typing", { chatId: chat_id, userId: user_id });
    }
  };


  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setOnlineUsers([]);
    };
  
    socket.current.on('disconnect', handleDisconnect);
    return () => {
      socket.current.off('disconnect', handleDisconnect);
    };
  }, []);

  
  useEffect(() => {
    const markAsRead = async () => {
        try {
            if (!currentChat || !currentChat.members) {
                console.warn("currentChat or currentChat.members is not available");
                return;
            }

            const chatMember = currentChat.members.find((member) => member !== client._id);
            if (!chatMember) {
                console.warn("No chat member found that is not the current user");
                return;
            }

            const res = await clientAxiosInstance.put(clientmarkasReadMessages, {
              currentChat: currentChat._id, senderId: chatMember }
            );

            if (res.data) {
              setUnreadCounts({});
            }
        } catch (error) {
            console.error(error, "error in markAsRead");
        }
    };

    if (currentChat !== null )markAsRead();
}, [currentChat]);

useEffect(() => {
  socket.current.on("receive-message", (data) => {
    if (data.chatId) {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [data.chatId]: (prevCounts[data.chatId] || 0) + 1,
      }));
    }
  });
}, [socket]);


const startVideoCall = async () => {

  const chatMember = currentChat.members.find((member) => member !== client._id);

  
  socket.current.emit("call-user", {
    senderId: client._id,
    receiverId: chatMember,
    name:client.name,
    roomId: currentChat._id,
  });


  setIsVideoCallActive(true);
  const appID = parseInt(config.VITE_ZEGO_APP_ID);
  const serverSecret = config.VITE_ZEGO_SERVER_SECRET;

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    currentChat._id,
    client._id,
    client.name
  );

  const zegoUIKitPrebuilt = ZegoUIKitPrebuilt.create(kitToken);

  
  // Emit the call invitation to the other user


  // Join the room using ZegoUIKitPrebuilt
  zegoUIKitPrebuilt.joinRoom({
    container: videoCallContainer.current,
    sharedLinks: [
      {
        name: "Copy link",
        url: `${config.VITE_APP_URL}/room/${currentChat._id}`,
      },
    ],
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall,
    },
    onLeaveRoom: () => {
      setIsVideoCallActive(false);
      videoCallContainer.current.innerHTML = "";
    },
  });
};


  return (
    <div className="py-10 px-2 bg-gray-100">
      <div className="relative grid grid-cols-[22%,auto] gap-4">
        <div className="flex flex-col p-5 bg-white gap-4 rounded-xl shadow-md ">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden w-full">
            <input
              aria-label="Search"
              placeholder="Search"
              type="search"
              className="px-4 py-2 outline-none w-full rounded-l-xl"
            />
            <FaSearch className="text-gray-500 mx-2" />
          </div>
          <h2 className="text-xl">Chats</h2>
          <div className="flex flex-col gap-2 overflow-scroll">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div key={chat._id} onClick={() => setcurrentChat(chat)}>
                  <ClientConversations 
                    data={chat} 
                    client={client._id}  
                    online={checkOnlineStatus(chat)}
                    unreadCount={unreadCounts[chat._id] || 0}
                   typingUsers={typingUsers}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-5">
                You don't have any conversations.
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 h-auto min-h-[80vh] shadow-xl">
          <div className="flex flex-col gap-4">
            <ClientChatBox
              chat={currentChat}
              client={client._id}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}
              onlineUsers={onlineUsers} 
              handleTyping={handleTyping}
              handleStopTyping={handleStopTyping}
              typingUsers={typingUsers}
              startVideoCall={startVideoCall}
            />
          </div>
        </div>
      {isVideoCallActive && (
      <div ref={videoCallContainer} className="video-call-container"></div>
    )}
      </div>
    </div>
  );
}
