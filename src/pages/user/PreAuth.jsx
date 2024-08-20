import { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Radio,
  Stack,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Logo from "../../components/uic/Logo";
import { MdBusiness, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function PreAuth() {
  const [selectedBox, setSelectedBox] = useState();
  const navigate = useNavigate()
  const handleBoxClick = (boxName) => {
    setSelectedBox(boxName);
  };

  const handlepreAUth = () => {
    const job_role = selectedBox === 'boxA' ? 'client' : 'freelancer';
    if(job_role){
      navigate('/register', { state: { userType: job_role } })
    }
    return job_role;
  };

  return (
    <Box
      minH="100vh"
      bgGradient={[
        "linear(to-tr, teal.300, yellow.400)",
        "linear(to-t, blue.200, teal.500)",
        "linear(to-b, orange.100, teal.300)",
      ]}
    >
      <Flex position="sticky" top="0" mb={"-12"} zIndex="sticky">
        <Link to={"/"}>
          <Logo />
        </Link>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Container
          maxW="xl"
          pt={"-20"}
          py={{ base: "8", md: "24" }}
          px={{ base: "0", sm: "8" }}
        >
          <Stack spacing="6">
            <Stack spacing="4" textAlign="center">
              <Heading size={{ base: "xs", md: "xl" }} color={"teal.600"}>
                Join as a client or freelancer
              </Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg="red.50"
            mt={"10"}
            minH={"md"}
            boxShadow="xl"
            borderRadius="3xl"
            border="1px solid"
            borderColor="gray.200"
            alignContent={"center"}
          >
            <Stack spacing="6">
              <Stack direction="row" spacing="5">
                <Box
                  bg="transparent"
                  w="48%"
                  p={5}
                  alignItems="center"
                  position="relative"
                  borderWidth={selectedBox === "boxA" ? "2px" : "1px"}
                  borderColor={
                    selectedBox === "boxA" ? "green.600" : "gray.200"
                  }
                  onClick={() => handleBoxClick("boxA")}
                  cursor="pointer"
                >
                  <Flex>
                    <MdBusiness size={24} color="teal" />
                    <Text ml={1} color="teal.800">
                      I’m a client,
                      <br />
                      hiring for a project
                    </Text>
                  </Flex>
                  {selectedBox === "boxA" && (
                    <Radio
                      position="absolute"
                      top={2}
                      right={2}
                      onChange={() => setSelectedBox("boxA")}
                      isChecked
                    />
                  )}
                </Box>
                <Box
                  bg="transparent"
                  w="48%"
                  p={5}
                  alignItems="center"
                  position="relative"
                  borderWidth={selectedBox === "boxB" ? "2px" : "1px"}
                  borderColor={
                    selectedBox === "boxB" ? "green.600" : "gray.200"
                  }
                  onClick={() => handleBoxClick("boxB")}
                  cursor="pointer"
                >
                  <Flex>
                    <MdPerson size={24} color="teal" />
                    <Text ml={1} color="teal.800">
                      I’m a Freelancer,
                      <br />
                      looking for work
                    </Text>
                  </Flex>
                  {selectedBox === "boxB" && (
                    <Radio
                      position="absolute"
                      top={2}
                      right={2}
                      onChange={() => setSelectedBox("boxB")}
                      isChecked
                    />
                  )}
                </Box>
              </Stack>
              <Button
                bg={"blue.500"}
                color={"white"}
                _hover={{ bg: "blue.800" }}
                onClick={selectedBox ? handlepreAUth : undefined}
                disabled={!selectedBox} 
                opacity={!selectedBox ? 0.5 : 1}
              >
                {selectedBox === "boxB"
                  ? "Apply as a freelancer"
                  : selectedBox === "boxA"
                  ? "Join as a client"
                  : "Register"}
              </Button>
            </Stack>
            <Stack mt={"5"} alignItems={"center"}>
              <Text color="gray">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "teal.500" }}
                >
                  <Text as="span" color="teal.500">
                    Log In
                  </Text>
                </Link>
              </Text>
            </Stack>
          </Box>
        </Container>
      </Flex>
    </Box>
  );
}

export default PreAuth;
