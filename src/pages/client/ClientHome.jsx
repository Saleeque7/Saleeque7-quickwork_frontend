import Footer from "../../components/main/footer";
import {
  Box,
  Flex,
  Tooltip,
  Button,
  Icon,
  Text,
  Stack,
  SimpleGrid,
  Heading,
  Image,
  IconButton,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowForwardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import UserProfileCards from "../../components/uic/userProfileCards";
import searchImage from "../../assets/search.webp";
import UserJobProposal from "../../components/uic/UserJobProposal";
import Navbar from "../../components/main/Navbar";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { browseUsers } from "../../utils/api/api";
import { useNavigate } from "react-router-dom";

export default function ClientHome() {
  const client = useSelector((state) => state.persisted.client.client);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
const navigate = useNavigate()
  const usersPerPage = 3

  const handleNextPage = () => {
    if ((currentPage + 1) * usersPerPage < users.length) {
      setCurrentPage(prev => prev + 1);
    }
  };
  

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await clientAxiosInstance.get(browseUsers);
      if (res.data) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePost = ()=>{
    navigate('/client/postJob')
  }
  return (
    <>
      <Box>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          bg="gray.100"
          p={5}
        >
          <Box
            w={{ base: "100%", md: "100%" }}
            alignItems="center"
            minH="30vh"
            p={12}
            m={12}
            mt={-0.1}
            borderRadius="xl"
            boxShadow="md"
            bg={"gray.700"}
          >
            <Text fontSize="md" color="white" mt={-6}>
              Hire a pro
            </Text>
            <Flex justifyContent="space-between" alignItems="center" mt={2}>
              <Text fontSize="4xl" mt={2} color="white">
                Get started and connect with talent to get work done
              </Text>
              <Box mt={4} position="relative">
                <Tooltip label="post a job">
                  <Button
                    variant="outline"
                    color="white"
                    onClick={handlePost}
                    _hover={{ color: "green.500", cursor: "pointer" }}
                  >
                    <Icon as={AddIcon} mr={2} />
                    Post a job
                  </Button>
                </Tooltip>
              </Box>
            </Flex>
            <Stack direction="row" spacing={4} mt={4}>
              <Button rightIcon={<ArrowForwardIcon />} onClick={()=>navigate('/client/UserList')}>browse talent</Button>
            </Stack>
          </Box>
        </Flex>

        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          bg="gray.100"
          p={24}
        >
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={handlePrevPage}
            isDisabled={currentPage === 0}
            mr={3}
            mt={-16}
          />

          <SimpleGrid columns={{ base: 1, md: 4 }} mt={-24}>
            <Box
              bgGradient="linear(to-b, purple.200, orange.200)"
              boxShadow="md"
              transition="all 0.3s ease-in-out"
              w={{ base: "100%", md: "90%" }}
              _hover={{ boxShadow: "2xl" }}
              minH={"50vh"}
              mt={5}
              alignItems={"center"}
              borderRadius="xl"
            >
              <Heading
                justifyContent={"flex-start"}
                color={"gray.700"}
                size={"xm"}
                m={6}
              >
                Guide tour
              </Heading>
              <Text
                justifyContent={"flex-start"}
                m={6}
                fontSize="xl"
                fontWeight="bold"
                color={"gray.700"}
              >
                Check out top rated talent for your open job posts{"  "}
                <ArrowForwardIcon />
              </Text>
              <Flex justifyContent="center" alignItems="center" h="120px">
                <Image src={searchImage} boxSize="200px" mt={3} maxW="200px" />
              </Flex>
            </Box>
            <UserProfileCards    currentPage={currentPage}
            usersPerPage={usersPerPage}
            users={users} />
          </SimpleGrid>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            mt={-16}
            isDisabled={(currentPage + 1) * usersPerPage >= users.length}
            ml={2}
          />
        </Flex>
{/* 
        <Flex
          justifyContent="flex-start"
          alignItems="start"
          flexDirection={{ base: "column", md: "coloumn" }}
          bg="gray.100"
          p={5}
        >
          <Box mt={-5}>
            <Text ml={12} fontWeight={"bold"} fontSize={"xl"}>
              Project Proposals
            </Text>
            <Box mt={5}>
              {/* {proposals.map((user, index) => ( */}
              {/* <UserJobProposal /> */}
              {/* ))} */}
            </Box>
          {/* </Box> */}
          
        {/* // </Flex> */}
      {/* </Box> */}
    </>
  );
}
