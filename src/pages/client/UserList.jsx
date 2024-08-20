import { useEffect, useState, useCallback } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { browseUsers, createChatsApi } from "../../utils/api/api";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import { Pagination } from "../../components/user/Pagination";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  
  const fetchUsers = useCallback(
    debounce(async (query, page=1, limit=3) => {
      try {
        console.log("Fetching user data with query:", query);
        const response = await clientAxiosInstance.get(browseUsers, {
          params: { searchQuery: query , page , limit },
        });
        console.log("API Response:", response.data);
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setTotalPages(response.data.page)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }, 500), 
    []
  );

  useEffect(() => {
    fetchUsers(searchQuery,currentPage);
  }, [searchQuery, currentPage, fetchUsers]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleStartConversation = async () => {
    console.log(`Starting conversation with ${selectedUser.name}`);
    try {
      const response = await clientAxiosInstance.post(createChatsApi, {
        userId: selectedUser._id
      });
      navigate('/client/messages');
      console.log('Chat created:', response.data);
    } catch (error) {
      console.error(error, "error in create chat");
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div className="p-10 min-h-[100vh]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center text-2xl px-8 font-semibold text-teal-800">
            Find Talents That Match You
          </div>

          <div className="flex items-center bg-white border mr-3 border-gray-300 rounded-xl overflow-hidden w-1/2">
            <input
              aria-label="Search"
              placeholder="Search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 outline-none w-full rounded-l-xl "
            />
            <FaSearch className="text-gray-500 mx-2 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-center items-start flex-col bg-gray-100 p-5 w-full">
          <div className="space-y-4 w-full">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user?.profile?.location || ""}
                        alt={user?.name || ""}
                        className="w-10 h-10 rounded-full"
                      />
                      <h2 className="font-semibold text-md cursor-pointer" onClick={() => navigate(`/client/userProfile/${user._id}`)}>
                        {user?.name || ""}
                      </h2>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <button
                        className="mr-3 border-2 rounded-md p-1 border-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none"
                        onClick={() => handleOpenModal(user)}
                      >
                        <span className="p-4">Message</span>
                      </button>
                    </div>
                  </div>
                  <h2 className="font-bold text-xl mt-5">{user.jobTitle}</h2>
                  <h3 className="text-sm text-gray-500 mb-5">{user.place}</h3>
                  <p className="mt-2 text-gray-600">
                    <span className="font-bold"></span>
                    {user.overview}
                  </p>
                  <div className="mt-2 flex items-center flex-wrap">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block rounded-full px-2 bg-teal-100 text-teal-800 mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center mt-20 min-h-[50vh]">
                <p className="text-start font-semibold text-xl text-orange-400">
                  No users found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Do you want to start a conversation with {selectedUser?.name}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleStartConversation}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
