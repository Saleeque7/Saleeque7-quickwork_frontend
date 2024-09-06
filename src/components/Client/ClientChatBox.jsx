import { useState, useEffect, useRef } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import {
  userdataApi,
  getClientMessageapi,
  addClientMessageapi,
  clientaddAudioFilemessageApi,
  clientaddImageFilemessageApi,
  clientaddVideoFilemessageApi,
  clientaddVoiceFilemessageApi,
} from "../../utils/api/api";
import Avatar from "react-avatar";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { MdAttachFile, MdOutlineClose } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineAudio } from "react-icons/ai";
import { MessageTimestamp } from "../uic/MessageTimeStamp";
import { FaMicrophone } from "react-icons/fa";
import { MdOutlineVideocam } from "react-icons/md";


export default function ClientChatBox({
  chat,
  client,
  setSendMessage,
  receivedMessage,
  onlineUsers,
  handleTyping,
  handleStopTyping,
  typingUsers,
  startVideoCall
}) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessages, setnewMessages] = useState("");
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const scroll = useRef();
  const imageRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();


  useEffect(() => {
    const fetchusersData = async () => {
      try {
        if (chat && chat.members) {
          const userId = chat.members.find((id) => id !== client);
          const res = await clientAxiosInstance.get(
            `${userdataApi}?id=${userId}`
          );
          setUserData(res.data);
        } else {
          console.warn("Chat or chat members are null/undefined");
        }
      } catch (error) {
        console.error("Error fetching client info:", error);
      }
    };
    fetchusersData();
  }, [chat, client]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await clientAxiosInstance.get(
          `${getClientMessageapi}?id=${chat._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching client info in Chatbox:", error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (newMessage) => {
    setnewMessages(newMessage);
    handleTyping(chat._id ,client)
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (
      !newmessages.trim() &&
      !selectedImage &&
      !selectedAudio &&
      !selectedVideo &&
      !recordedAudio
    ) {
      return;
    }

    if (selectedImage) {
      await handleFileUpload(selectedImage, "image");
      setSelectedImage(null);
      return;
    }
    if (selectedAudio) {
      await handleFileUpload(selectedAudio, "audio");
      setSelectedAudio(null);
      return;
    }
    if (selectedVideo) {
      await handleFileUpload(selectedVideo, "video");
      setSelectedVideo(null);
      return;
    }

    if (recordedAudio) {
      await handleFileUpload(recordedAudio, "voice");
      setRecordedAudio(null);
      return;
    }

    if (newmessages.trim()) {
      const message = {
        senderId: client,
        type: "text",
        message: newmessages,
        chatId: chat._id,
        read: false,
      };

      const receiverId = chat.members.find((id) => id !== client);
      setSendMessage({ ...message, receiverId });

      try {
        const res = await clientAxiosInstance.post(
          addClientMessageapi,
          message
        );
        setMessages([...messages, res.data]);
        setnewMessages("");
      } catch (error) {
        console.error(error, "error in chatbox");
      }
    }
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();

    formData.append("chatId", chat._id);
    formData.append("type", type);
    formData.append(type, file);
    formData.append("senderId", client);
    formData.append("read", false);

    for (let [key, value] of formData) {
      console.log(key, value, "jhjh");
    }

    try {
      let URI;

      if (type === "image") {
        URI = clientaddImageFilemessageApi;
      } else if (type === "audio") {
        URI = clientaddAudioFilemessageApi;
      } else if (type === "video") {
        URI = clientaddVideoFilemessageApi;
      } else if (type === "voice") {
        URI = clientaddVoiceFilemessageApi;
      }

      const res = await clientAxiosInstance.post(URI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const receiverId = chat.members.find((id) => id !== client);
      const newMessage = res.data;
      setSendMessage({ ...newMessage, receiverId });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error(error, "error in chatbox");
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleAudioChange = (e) => {
    setSelectedAudio(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setSelectedVideo(e.target.files[0]);
  };

  // Receive Message from parent component
  useEffect(() => {
    console.log("Message Arrived in client: ", receivedMessage);
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const options = { mimeType: "audio/webm" }; // Default MIME type
          if (MediaRecorder.isTypeSupported("audio/webm")) {
            options.mimeType = "audio/webm";
          } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
            options.mimeType = "audio/ogg";
          } else if (MediaRecorder.isTypeSupported("audio/wav")) {
            options.mimeType = "audio/wav";
          } else {
            console.error("No supported audio format found");
            return;
          }

          const recorder = new MediaRecorder(stream, options);
          setMediaRecorder(recorder);
          recorder.ondataavailable = (event) => {
            setRecordedAudio(event.data);
          };
          recorder.start();
          setIsRecording(true);
        })
        .catch((err) => console.error("Error accessing audio devices:", err));
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };



  const getUserStatus = (userId) => {
    if (typingUsers.includes(userId)) {
      return "Typing...";
    }
    if (onlineUsers.find((user) => user.userId === userId)) {
      return "Online";
    }
    return "";
  };

  const handleBlur = () => {
    handleStopTyping(chat._id ,client); 
  };

  const chatMember = chat?.members?.find((member) => member !== client);
  const status = chatMember ? getUserStatus(chatMember) : "";


  return (
    <>
      <div className="bg-white rounded-lg grid grid-rows-[14vh_60vh_13vh]">
        {chat ? (
          <>
            <div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar
                    name={userData?.name || "User"}
                    src={userData?.profile?.location}
                    size="50"
                    round={true}
                  />
                   <div>
                    
                    <span className="text-md">{userData?.name}</span>
                  
                    <div
                      className="text-online text-xs  " 
                      
                    >
                      {status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MdOutlineVideocam
                    className="text-gray-500 text-4xl cursor-pointer hover:text-teal-500"
                    onClick={startVideoCall} 
                  />
                </div>
              </div>
              <hr className="w-[95%] border-t-[0.1px] border-gray-300 mt-5" />
            </div>
            <div className="flex flex-col gap-2 p-6 overflow-y-scroll">
              {messages.map((message) => (
                <div
                  key={`${message._id}-${message.createdAt}`}
                  ref={scroll}
                  className={`flex flex-col gap-2  px-5  py-1 rounded-xl max-w-lg w-fit ${
                    message.senderId === client
                      ? "self-end  rounded-br-none bg-green-100"
                      : " rounded-bl-none text-teal-600 bg-gray-100"
                  }`}
                >
                  {message.type === "text" ? (
                    <span>{message?.message}</span>
                  ) : message.type === "image" ? (
                    <img
                      src={message?.file?.location}
                      alt="sent-image"
                      className="max-w-80 max-h-80 rounded mt-4"
                    />
                  ) : message.type === "audio" ? (
                    <audio controls src={message?.file?.location}>
                      Your browser does not support the audio tag.
                    </audio>
                  ) : message.type === "voice" ? (
                    <audio controls src={message?.file?.location}>
                      Your browser does not support the audio tag.
                    </audio>
                  ) : message.type === "video" ? (
                    <video
                      controls
                      src={message?.file?.location}
                      className="max-w-80 max-h-80 mt-4 rounded"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                  <div
                    className={`${
                      message?.senderId === client
                        ? "text-right text-gay-100"
                        : "text-left text-gray-500"
                    }`}
                  >
                    <MessageTimestamp createdAt={message.createdAt} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between h-14 p-3 bg-white rounded-lg relative">
              <div
                className="flex items-center justify-center bg-gray-200 rounded-md w-8 h-8 cursor-pointer relative"
                onClick={() => setShowFileOptions(!showFileOptions)}
              >
                <MdAttachFile className="text-gray-600" />
              </div>
              {isRecording ? (
                <div
                  className="flex items-center justify-center bg-red-500 text-white rounded-md mx-2 w-8 h-8 cursor-pointer"
                  onClick={handleStopRecording}
                >
                  <FaMicrophone className="text-white" />
                </div>
              ) : (
                <div
                  className="flex items-center justify-center bg-gray-200 mx-2 rounded-md w-8 h-8 cursor-pointer relative"
                  onClick={handleStartRecording}
                >
                  <FaMicrophone className="text-gray-600" />
                </div>
              )}
              <InputEmoji
                value={newmessages}
                onChange={handleChange}
                onBlur={handleBlur}
                className="flex-1"
              />
              {showFileOptions && (
                <div className="absolute bottom-16 left-2 bg-white shadow-lg rounded-md p-2 flex flex-col space-y-2">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => imageRef.current.click()}
                  >
                    <BiImageAdd className="text-gray-600  text-lg" />
                    <span>Image</span>
                  </div>
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => audioRef.current.click()}
                  >
                    <AiOutlineAudio className="text-gray-600  text-lg" />
                    <span>Audio</span>
                  </div>
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => videoRef.current.click()}
                  >
                    <IoVideocamOutline className="text-gray-600 text-lg" />
                    <span>Video</span>
                  </div>
                  {selectedImage && (
                    <div className="relative p-2 border border-gray-300 rounded-md mt-2 max-w-[350px] max-h-[350px] overflow-hidden">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <MdOutlineClose
                        onClick={() => setSelectedImage("")}
                        className="absolute top-4 right-4 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      />
                    </div>
                  )}
                  {selectedAudio && (
                    <div className="relative p-2 border border-gray-300 rounded-md mt-2 max-w-[350px] max-h-[350px] overflow-hidden">
                      <audio controls className="w-full">
                        <source
                          src={URL.createObjectURL(selectedAudio)}
                          type={selectedAudio.type}
                        />
                        Your browser does not support the audio element.
                      </audio>
                      <MdOutlineClose
                        onClick={() => setSelectedAudio(null)}
                        className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                      />
                    </div>
                  )}

                  {selectedVideo && (
                    <div className="relative p-2 border border-gray-300 rounded-md mt-2 max-w-[350px] max-h-[350px] overflow-hidden">
                      <video
                        src={URL.createObjectURL(selectedVideo)}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <MdOutlineClose
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-4 right-4 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="absolute bottom-16 left-2 bg-white shadow-lg rounded-md p-2 flex flex-col space-y-2">
                {recordedAudio && (
                  <div className="relative p-2 border border-gray-300 rounded-md mt-2 max-w-[350px] max-h-[350px] overflow-hidden">
                    <audio controls>
                      <source
                        src={URL.createObjectURL(recordedAudio)}
                        type={recordedAudio.type}
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <MdOutlineClose
                      onClick={() => setRecordedAudio(null)}
                      className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-center bg-blue-500 text-white rounded-md h-8 px-4 cursor-pointer"
                onClick={handleSend}
              >
                Send
              </div>
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <input
                type="file"
                accept="audio/*"
                ref={audioRef}
                className="hidden"
                onChange={handleAudioChange}
              />
              <input
                type="file"
                accept="video/*"
                ref={videoRef}
                className="hidden"
                onChange={handleVideoChange}
              />
            </div>
          </>
        ) : (
          <span className="text-center text-gray-500 mt-5">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    
    </>
  );
}
