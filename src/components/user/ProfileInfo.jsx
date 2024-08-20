import { Box, Flex ,Text } from "@chakra-ui/react";
import Navbar from "../main/Navbar";
import { CheckCircleIcon ,StarIcon } from '@chakra-ui/icons';
export default function ProfileInfo() {
  return (
    <>
      <Box>
        <Navbar />
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          p={5}
        >
          <Box
            w={{ base: "100%", md: "100%" }}
            mb={{ base: 8, md: 0 }}
            alignItems="center"
            p={8}
            mt={8}
            borderRadius="md"
            textAlign="center"
           
          >
             <Text fontSize={"3xl"}  color={"teal.700"} fontWeight={"bold"} fontStyle={"oblique"}>Thank You For Your Valuable Information. Please Verify Your Details</Text>
             <CheckCircleIcon color={"teal"} boxSize={"100"}/>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
