import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { userChatsApi  , markasReadMessages , countUnreadMessages} from "../../utils/api/api";
import Conversation from "../../components/user/Conversation";
import ChatBox from "../../components/user/ChatBox";
import { config } from "../../config/config";
import { io } from "socket.io-client";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";


export default function Message() {
  const user = useSelector((state) => state.persisted.user.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setcurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendmessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);  

  const socket = useRef();
  const videoCallContainer = useRef(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        const res = await userAxiosInstance.get(userChatsApi);
        setChats(res.data);
        console.log(res.data,"in user side chat api");
        
        const counts = {};
        console.log(counts,"in user side chat api below count");
        
        await Promise.all(
          res.data.map(async (chat) => {
            const senderId = chat.members.find((id) => id !== user._id);
            const countRes = await userAxiosInstance.get(countUnreadMessages, {
              params: { senderId, chatId: chat._id },
            });
            console.log(countRes.data,'count');
            
            counts[chat._id] = countRes.data;
          })
        );
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchUserChats();
  }, [user._id]);



  useEffect(() => {
    socket.current = io(config.API);
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("receive-message", (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        setReceivedMessage(data);
      }
    });

    socket.current.on("typing", (data) => {
      console.log(`${data.userId} is typing`);
      setTypingUsers(prev => [...new Set([...prev, data.userId])]);
    });

    socket.current.on("stop-typing", (data) => {
      console.log(`${data.userId} stopped typing`);
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    });

    socket.current.on("incoming-call", (data) => {
      console.log("Incoming call data: ", data); 
      const { senderId, roomId, name } = data;
      if (!roomId) {
        console.error("No roomId received in incoming call");
        return;
      }
      setIncomingCall({ senderId, roomId, name });
    });
    
    

    return () => {
      socket.current.disconnect();
    };
  }, [user, currentChat]);


  
  useEffect(() => {
    if (sendmessage !== null) {  
      console.log("user message to socket ,",sendmessage);
      
      socket.current.emit("send-message", sendmessage);
    }
  }, [sendmessage]);


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



  // Get the message from socket server
  // useEffect(() => {
  //   socket.current.on("receive-message", (data) => {  
  //     setReceivedMessage(data);
  //   });

  //   return () => {
  //     socket.current.off("receive-message");
  //   };
  // }, []);




  useEffect(() => {
    const markAsRead = async () => {
        try {
            if (!currentChat || !currentChat.members) {
                console.warn("currentChat or currentChat.members is not available");
                return;
            }

            const chatMember = currentChat.members.find((member) => member !== user._id);
            if (!chatMember) {
                console.warn("No chat member found that is not the current user");
                return;
            }

            const res = await userAxiosInstance.put(markasReadMessages, {
              currentChat: currentChat._id, senderId: chatMember }
            );

            if (res.data) {
               
                setUnreadCounts({})
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

  const checkOnlineStatus = (chat) => {
    
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };


  


  useEffect(() => {
    const handleDisconnect = () => {
      setOnlineUsers([]);
    };
  
    socket.current.on('disconnect', handleDisconnect);
    return () => {
      socket.current.off('disconnect', handleDisconnect);
    };
  }, []);



  
  const handleJoinCall = async (roomId) => {
    setIsVideoCallActive(true)
    const appID = parseInt(config.VITE_ZEGO_APP_ID);
    const serverSecret = config.VITE_ZEGO_SERVER_SECRET;
  
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user._id,
      user.name
    );
  
    const zegoUIKitPrebuilt = ZegoUIKitPrebuilt.create(kitToken);
  
    zegoUIKitPrebuilt.joinRoom({
      container: videoCallContainer.current,
      sharedLinks: [
        {
          name: "Copy link",
          url: `${config.VITE_APP_URL}/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom: () => {
        setIsVideoCallActive(false);
        setIncomingCall(null);
        videoCallContainer.current.innerHTML = "";
      },
    });
  };
  


  const handleAcceptCall = (roomId) => {
    socket.current.emit("call-accepted", { senderId: incomingCall.senderId });
    handleJoinCall(roomId);
  };
  
  const handleRejectCall = () => {
    socket.current.emit("call-rejected", { senderId: incomingCall.senderId });
    setIncomingCall(null);
  };
  

  const endVideoCall = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    
    socket.current.emit("end-call", { roomId: currentRoomId });
  
    // Reset any relevant state
    setVideoStream(null);
    setCurrentRoomId(null);
  };
  

  return (
    <div className="py-10 px-2 bg-gray-100">
      <div className="relative grid grid-cols-[22%,auto] gap-4">
        <div className="flex flex-col p-5 bg-white gap-4 rounded-xl shadow-md ">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl  overflow-hidden w-full">
            <input
              aria-label="Search"
              placeholder="Search"
              type="search"
              className="px-4 py-2 outline-none w-full rounded-l-xl"
            />
            <FaSearch className="text-gray-500 mx-2" />
          </div>
          <h2 className="text-xl">Chats</h2>
          <div className="flex flex-col gap-2  overflow: scroll">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div key={chat._id} onClick={() => setcurrentChat(chat)}>
                  <Conversation
                    data={chat}
                    user={user._id}
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
        {/* overflow-scroll */}
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 h-auto min-h-[80vh] shadow-xl ">
          <div className="flex flex-col gap-4">
            <ChatBox
              chat={currentChat}
              user={user._id}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}  
              onlineUsers={onlineUsers}      
              handleTyping={handleTyping}
              handleStopTyping={handleStopTyping}
              typingUsers={typingUsers}
              incomingCall={incomingCall}
              handleAcceptCall={handleAcceptCall}
              handleRejectCall={handleRejectCall}
              videoCallContainer={videoCallContainer}
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
