import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Stack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import profileImage from "../../assets/pf.png";

export default function ProfileBar({ user }) {
  const profile = user?.profile?.location || profileImage;

  return (
    <Box
      width="260px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="xl"
      mt={24}
    >
      <Box bg="teal.500" h="100px" position="relative">
        <Image
          src={profile}
          alt="Profile Image"
          boxSize="100px"
          borderRadius="full"
          border="5px solid white"
          position="absolute"
          top="100%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      </Box>
      <Box bg="white" pt="60px" pb={4}>
        <Stack spacing={2} align="center">
          <Text fontWeight="bold" fontSize="xl" color="gray.700">
            {user && (
              <Link href={'/user/viewprofile'} color="blue.500" sx={{ textDecoration: 'none', _hover: { textDecoration: 'none' } }}>
                {user.name}
              </Link>
            )}
          </Text>
          <Text color="gray.500">{user && user.jobTitle}</Text>
          <Flex justify="center" mt={2}>
            <Link href={user?.github} isExternal>
              <IconButton
                icon={<FaGithub />}
                variant="ghost"
                color="gray.700"
                fontSize="20px"
                _hover={{ color: "blue.500" }}
                aria-label="Github"
              />
            </Link>
            <Link href={user?.linkedin} isExternal>
              <IconButton
                icon={<FaLinkedin />}
                variant="ghost"
                color="gray.700"
                fontSize="20px"
                _hover={{ color: "blue.500" }}
                aria-label="LinkedIn"
              />
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
}
