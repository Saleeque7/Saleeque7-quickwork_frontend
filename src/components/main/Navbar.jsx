/* eslint-disable react/prop-types */
import Logo from "../uic/Logo.jsx";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  DesktopNav,
  MobileNav,
  DesktopNavClient,
} from "./HeaderComponents/HeaderComponents.jsx";
import { useSelector, useDispatch } from "react-redux";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../utils/Redux/userSlice.jsx";
import { logoutClient } from "../../utils/Redux/recruiterSlice.jsx";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useUserProfile } from "../../utils/context/ProfileContext";
import ProfileClient from "../uic/ProfileClient.jsx";
import { MdNotificationsNone } from "react-icons/md";

const Navbar = ({ userType, userInfo }) => {
  const { userProfile, setUserProfile } = useUserProfile();

  const [isHovered, setHovered] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (userInfo.job_role === "freelancer") {
      setUserProfile(!userProfile);
      await dispatch(logout());
    } else if (userInfo.job_role === "client") {
      await dispatch(logoutClient());
    }
    navigate("/", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login", { replace: true });
  };
  const handleSignup = () => {
    navigate("/pre", { replace: true });
  };
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.600", "white")}
      minH="50px"
      py={{ base: 1 }}
      px={{ base: 50 }}
      borderBottom={2}
      borderStyle="solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
      bgGradient={[
        "linear(to-br, teal.300, yellow.100)",
        "linear(to-b, blue.200, teal.500)",
        "linear(to-t, orange.100, teal.300)",
      ]}
      position="sticky" 
      top={0} 
      zIndex={1000} 
    >
      <Flex
        flex={{ base: 1, md: "auto" }}
        ml={{ base: -2 }}
        display={{ base: "flex", md: "none" }}
        justifyContent={{ base: "space-between" }}
        alignItems={{ base: "center" }}
      >
        <IconButton
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
          }
          variant="ghost"
          aria-label="Toggle Navigation"
        />
        <Box
          display={{ base: "flex", md: "none" }}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
          fontFamily="heading"
          color={useColorModeValue("gray.800", "white")}
          mt="-10px"
        >
          <Logo />
        </Box>
      </Flex>
      <Flex
        flex={{ base: 1 }}
        justify={{ base: "center", md: "center" }}
        align="center"
      >
        <Box
          display={{ base: "none", md: "flex" }}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
          fontFamily="heading"
          color={useColorModeValue("gray.800", "white")}
        >
          <Logo  userInfo={userInfo}/>
        </Box>
        
        {userInfo?.job_role === "client" && (
          <DesktopNavClient userInfo={userInfo} />
        )}


        <Flex display={{ base: "none", md: "flex" }} ml={10} pb={0}>
          {userInfo?.job_role === "freelancer" && (
            <DesktopNav userInfo={userInfo} />
          )}
        </Flex>



        <Stack flex={{ base: 1, md: 1 }} justify="flex-end" direction="row">
          {userInfo?.job_role === "client" && (
            <ProfileClient userInfo={userInfo} />
          )}
          {userInfo?.job_role === "freelancer" && (
            <MdNotificationsNone className=" flex items-center mt-5 mr-5 text-3xl cursor-pointer" onClick={()=>navigate('/user/notifications')}/>
          )}

          {userInfo ? (
            <>
              <Button
                mt={5}
                size="sm"
                as="a"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="teal.400"
                _hover={{ bg: "blue.700" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                as="a"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="teal.700"
                onClick={handleLogin}
                _hover={{ bg: "blue.700" }}
              >
                Login
              </Button>
              <Button
                size="sm"
                as="a"
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="teal.400"
                onClick={handleSignup}
                _hover={{ bg: "blue.700" }}
              >
                SignUp
              </Button>
            </>
          )}
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav
          handleLogout={handleLogout}
          user={userInfo}
          handleLogin={handleLogin}
        />
      </Collapse>
    </Box>
  );
};

export default Navbar;
