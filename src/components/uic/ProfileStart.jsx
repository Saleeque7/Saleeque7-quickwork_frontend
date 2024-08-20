import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  Icon,
  Button,
} from "@chakra-ui/react";
import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import welcome from "../../assets/start.png";
import { ArrowForwardIcon } from "@chakra-ui/icons";
export default function ProfileStart({ onProfileStart, user }) {
  const [bgPosition, setBgPosition] = useState("20% 20%");

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;
    const x = (offsetX / clientWidth) * 100;
    const y = (offsetY / clientHeight) * 100;

    const shakeX = x + (Math.random() - 0.5) * 10;
    const shakeY = y + (Math.random() - 0.5) * 10;
    setBgPosition(`${shakeX}% ${shakeY}%`);
  };

  return (
    <Box
      p={{ base: 0, md: 16 }}
      onMouseMove={handleMouseMove}
      bgGradient="linear(to-b, white, green.50, white)"
      backgroundPosition={bgPosition}
      backgroundSize="200% 200%"
      transition="background-position 0.1s ease"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box
          w={{ base: "100%", md: "40%" }}
          mb={{ base: 8, md: 0 }}
          alignItems="center"
          borderRadius="md"
          textAlign="start"
        >
          <Heading
          mt={-24}
            as="h1"
            size="xl"
            mb={4}
            fontWeight={"bold"}
            textColor={"teal.600"}
          >
            Welcome to QuickWork <br />
            {user ? user.name : ""}
          </Heading>
          <Text as="h5" fontSize="md" mb={8} fontWeight="bold">
            We need to get a sense of your profile, experience and skills. It’s
            quickest to import your information — you can edit it before your
            profile goes live.
          </Text>
          <Button
            colorScheme="teal"
            mt={4}
            rightIcon={<Icon as={MdArrowForward} />}
            onClick={onProfileStart }
          >
              Let's Get Started
          </Button>
        </Box>

        <Image
          src={welcome}
          alt="Landing Page Image"
          px={10}
          py={15}
          mr={55}
          w={{ base: "100%", md: "50%" }}
          mb={{ base: 4, md: 0 }}
          alignContent={"center"}
          maxH={"700px"}
        />
      </Flex>
    </Box>
  );
}

{
  /* <Container
        maxW="80%"
        py={{ base: "8", md: "20" }}
        px={{ base: "0", sm: "8" }}
        mt={-4}
      </Container> */
}
// >
