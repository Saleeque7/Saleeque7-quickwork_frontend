import {
  SimpleGrid,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { GrFavorite } from "react-icons/gr";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { CiStar } from "react-icons/ci";
import { MdOutlineWorkOutline } from "react-icons/md";
import randomimage from  "../../assets/pf.png"
import { useNavigate } from "react-router-dom";


export default function UserProfileCards({currentPage , usersPerPage , users }) {

const navigate = useNavigate()

  const displayedUsers = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );


  return (
    <>
      {displayedUsers.map((user) => (
        <Card key={user._id}>
          <Flex align="center" p={4}>
            <Image
              src={user?.profile?.location || randomimage}
              alt="Profile Image"
              boxSize="60px"
              borderRadius="full"
              border="5px solid white"
            />
            <Box flex="1">
              <Heading
                size="md"
                color={"teal.700"}
                ml={2}
                fontFamily={"Georgia, serif"}
              >
                {user?.name || "User Name"}
              </Heading>
              <Text size="xs" color={"black"} ml={2}>
                {user?.State}
              </Text>
            </Box>
            {/* <Icon
              as={GrFavorite}
              style={{ color: "teal" }}
              mt={-4}
              boxSize={6}
            /> */}
          </Flex>
          <Flex justify={"flex-start"}>
            <Text p={5} fontSize={"xl"} font color="gray.600">
              {user?.jobTitle || "Freelancer"}
            </Text>
          </Flex>
          <Flex justify="space-between" p={5}>
            <Flex align="center">
              <Icon as={RiMoneyRupeeCircleLine} boxSize={6} />
              <Text ml={2}>{user?.hourlyRate}/hr</Text>
            </Flex>
            <Flex align="center">
              <Icon as={CiStar} boxSize={6} />
              <Text ml={2}>{user?.rating || "4.3"}</Text>
            </Flex>
            <Flex align="center">
              <Icon as={MdOutlineWorkOutline} boxSize={6} />
              <Text ml={2}>{user?.committedJobs || "1"}</Text>
            </Flex>
          </Flex>
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            mt={2}
            flexWrap="wrap"
            mb={4}
            p={4}
          >
            {user?.skills.map((skill, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                border="1px solid gray.400"
                boxShadow="sm"
                bg="gray.200"
                borderRadius="md"
                m={2}
                px={3}
                py={1}
                fontSize="xs"
              >
                {skill}
              </Box>
            ))}
          </Flex>
          <Flex justifyContent="center" alignItems="center" pb={4}>
            <Button
              mt={2}
              px={12}
              borderColor="teal.500"
              borderWidth={2}
              bg={"white"}
              _hover={{
                borderColor: "teal.700",
                backgroundColor: "teal.500",
              }}
              onClick={() => navigate(`/client/userProfile/${user._id}`)}
            >
              View Profile
            </Button>
          </Flex>
        </Card>
      ))}
    </>
  );
}

const Card = ({ children }) => (
  <Box
    bg="white"
    boxShadow="md"
    transition="all 0.3s ease-in-out"
    _hover={{ boxShadow: "2xl" }}
    w={{ base: "100%", md: "90%" }}
    minH={"50vh"}
    mt={5}
    justifyContent={"center"}
    textAlign={"start"}
    borderRadius="xl"
  >
    {children}
  </Box>
);
