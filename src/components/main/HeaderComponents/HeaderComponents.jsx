import {
  Box,
  Text,
  Stack,
  Popover,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useUserProfile } from "../../../utils/context/ProfileContext";

const DesktopNav = ({ userInfo }) => {
  const {userProfile }  = useUserProfile()
  const isUserProfile = userInfo.isUserProfile;
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const navigate = useNavigate();

  const NAV_ITEMS =  [
        { label: "Find Work", href: "/user/findWork" },
        { label: "My Work", href: "/user/workList" },
        { label: "Message", href: "/user/messages" },
        // { label: "Auction", href: "/userWatchlist" },
      ]  
  return (
    isUserProfile  && (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Box
                as="button"
                p={2}
                onClick={() => navigate(navItem.href)}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  )
);
};
const DesktopNavClient = ({ userInfo }) => {
  const { clientProfile}  = useUserProfile()
 
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const navigate = useNavigate();

  const NAV_ITEMS =  [
        { label: "Find Talent", href: "/client/UserList" },
        { label: "My Jobs", href: "/client/joblisted" },
        { label: "Message", href: "/client/messages" },
        { label: "Bills", href: "/client/Bills" },
      ];
    
  return (
    clientProfile  && (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Box
                as="button"
                p={2}
                onClick={() => navigate(navItem.href)}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  )
);
};

const MobileNav = ({ handleLogout, user, handleLogin, userInfo }) => {
  const NAV_ITEMS = userInfo?.job_role === "freelancer"
    ? [
        { label: "Find Work", href: "/userAuctions" },
        { label: "My Work", href: "/userSellers" },
        { label: "Message", href: "/userAuctioning" },
        { label: "Auction", href: "/userWatchlist" },
      ]
    : [
        { label: "Find Talent", href: "/userAuctions" },
        { label: "My Jobs", href: "/userSellers" },
        { label: "Message", href: "/userAuctioning" },
        { label: "Create Auction", href: "/userWatchlist" },
      ];

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {userInfo &&
        NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      <Stack spacing={4}>
        {user ? (
          <Box
            py={2}
            as="button"
            onClick={handleLogout}
            justifyContent="space-between"
            alignItems="center"
            _hover={{ textDecoration: "none" }}
          >
            <Text fontWeight={600}>Logout</Text>
          </Box>
        ) : (
          <Box
            py={2}
            as="button"
            onClick={handleLogin}
            justifyContent="space-between"
            alignItems="center"
            _hover={{ textDecoration: "none" }}
          >
            <Text fontWeight={600}>Login</Text>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const MobileNavItem = ({ label, href }) => {
  const navigate = useNavigate();
  return (
    <Stack spacing={4}>
      <Box
        py={2}
        as="button"
        onClick={() => navigate(href)}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>
          {label}
        </Text>
      </Box>
    </Stack>
  );
};

export { DesktopNav, MobileNav ,DesktopNavClient};
