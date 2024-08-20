import Navbar from "../../components/main/Navbar";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Image,
  Icon,
} from "@chakra-ui/react";
import {
  MdArrowForward,
  MdCheckCircle,
  MdStar,
  MdAttachMoney,
} from "react-icons/md";
import landingImage from "../../assets/111.jpg";
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { shakeKeyframes } from "../../components/uic/shakeAnimation";
import Footer from "../../components/main/footer";
import { Link } from "react-router-dom";
export default function Landingpage() {
  return (
    <>
      <Box>
        <Navbar />
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          bg="gray.100"
        >
          <Box
            w={{ base: "100%", md: "40%" }}
            mb={{ base: 8, md: 0 }}
            alignItems="center"
            p={8}
            borderRadius="md"
            textAlign="center"
          >
            <Heading as="h1" size="3xl" mb={4} textColor={"teal"}>
              HOW WORK <br />
              SHOULD WORK
            </Heading>
            <Text as="h5" fontSize="md" mb={8} fontWeight="bold">
              Forget the old rules. You can have the best people <br />
              right now Right here
            </Text>
            <Button
              colorScheme="teal"
              mt={4}
              rightIcon={<Icon as={MdArrowForward} />}
            >
              <Link to={"/login"}> Get Started</Link>
             
            </Button>
          </Box>

          <Image
            src={landingImage}
            alt="Landing Page Image"
            w={{ base: "100%", md: "60%" }}
            mb={{ base: 4, md: 0 }}
            maxH={"700px"}
          />
        </Flex>
      </Box>
      <Box>
        <Flex
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
          bg="gray.100"
        >
          <Box
            p={12}
            px={32}
            w={{ base: "100%", md: "50%" }}
            mb={{ base: 8, md: 0 }}
            borderRadius="md"
          >
            <Heading as="h1" size="xl" m={4} px={12} textColor={"teal"}>
              Why Business <br />
              Turn To Quick WORK
            </Heading>
            <Flex alignItems="center" m={4} px={12} mt={8}>
              <Flex align="center">
                <Box
                  justify="center"
                  align="center"
                  borderRadius="full"
                  bg="teal.400"
                  w={6}
                  h={6}
                  mr={2}
                >
                  <Icon as={MdStar} color="white" />
                </Box>
                <Box ml={1}>
                  <Heading fontSize="lg" fontWeight="bold" mr={2}>
                    Proof of Quality
                  </Heading>
                </Box>
              </Flex>
            </Flex>
            <Box px={24} mt={-4}>
              <Text as="h6" fontSize="xs" color={"gray"}>
                Check any pro’s work samples, client reviews, and identity{" "}
                <br />
                verification.
              </Text>
            </Box>
            <Flex alignItems="center" m={4} px={12} mt={8}>
              <Flex align="center">
                <Box
                  justify="center"
                  align="center"
                  borderRadius="full"
                  bg="teal.400"
                  w={6}
                  h={6}
                  mr={2}
                >
                  <Icon as={MdAttachMoney} color="white" />
                </Box>
                <Box ml={1}>
                  <Heading fontSize="lg" fontWeight="bold" mr={2}>
                    No Cost Until You Hire
                  </Heading>
                </Box>
              </Flex>
            </Flex>
            <Box px={24} mt={-4}>
              <Text as="h6" fontSize="xs" color={"gray"}>
                Interview potential fits for your job, negotiate rates, and only
                pay <br />
                for work you approve.
              </Text>
            </Box>
            <Flex alignItems="center" m={4} px={12} mt={8}>
              <Flex align="center">
                <Box
                  justify="center"
                  align="center"
                  borderRadius="full"
                  bg="teal.400"
                  w={6}
                  h={6}
                  mr={2}
                >
                  <Icon as={MdCheckCircle} color="white" />
                </Box>
                <Box ml={1}>
                  <Heading fontSize="lg" fontWeight="bold" mr={2}>
                    Safe and secure
                  </Heading>
                </Box>
              </Flex>
            </Flex>
            <Box px={24} mt={-4}>
              <Text as="h6" fontSize="xs" color={"gray"}>
                Focus on your work knowing we help protect your data and
                privacy. <br />
                We’re here with 24/7 support if you need it.
              </Text>
            </Box>
          </Box>
          <Box
            p={12}
            mt={10}
            w={{ base: "100%", md: "50%" }}
            mb={{ base: 8, md: 0 }}
            // backgroundSize="cover"
            borderRadius="md"
          >
            <Heading as="h1" size="2xl" textColor={"blue.800"}>
              We’re the world’s work Marketplace
            </Heading>
            <Flex justify="space-between">
              <Box
                p={6}
                w={{ base: "100%", md: "30%" }}
                borderRadius="md"
                bg="blue.800"
                mt={10}
                mr={{ base: 0, md: 2 }}
                _hover={{
                  animation: `${shakeKeyframes} 1s infinite`,
                }}
              >
                <Text textAlign="start" color="white" fontSize="xl">
                  <Link to={"/login"} >
                  Post a job <br />
                  and hire a pro <ArrowForwardIcon color="white" mr="5" />
                </Link>
                </Text>
              </Box>
              <Box
                p={6}
                w={{ base: "100%", md: "30%" }}
                borderRadius="md"
                bg="blue.800"
                mt={10}
                mr={{ base: 0, md: 2 }}
                _hover={{
                  animation: `${shakeKeyframes} 1s infinite`,
                }}
              >
                <Text textAlign="start" color="white" fontSize="xl">
                  <Link to={'/login'}>
                  Find Great <br />
                  Work <ArrowForwardIcon color="white" mr="5" />
                  </Link>
                </Text>
              </Box>
              <Box
                p={6}
                w={{ base: "100%", md: "30%" }}
                borderRadius="md"
                bg="blue.800"
                mt={10}
                mr={{ base: 0, md: 2 }}
                _hover={{
                  animation: `${shakeKeyframes} 1s infinite`,
                }}
              >
                <Text textAlign="start" color="white" fontSize="xl">
                  <Link to={'/login'}>
                  Browse and <br />
                  Buy Projects <ArrowForwardIcon color="white" mr="5" />
                  </Link>
                </Text>
              </Box>
            </Flex>
            <Flex mt={4}>
              <Box ml={4} mt={4}>
                <Flex align="center" mt={6} color={"teal"}>
                  <CheckIcon fontSize="2xl" mr={3} />
                  <Text fontSize={"2xl"}>
                    Get matched with expert freelancers in minutes
                  </Text>
                </Flex>
                <Flex align="center" mt={6} color={"teal"}>
                  <CheckIcon fontSize="2xl" mr={3} />
                  <Text fontSize={"2xl"}>
                    Dedicated 24/7 customer service team
                  </Text>
                </Flex>
                <Flex align="center" mt={6} color={"teal"}>
                  <CheckIcon fontSize="2xl" mr={3} />
                  <Text fontSize={"2xl"}>
                    Money back guarantee and anti-fraud protection
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Footer />
      </Box>
    </>
  );
}
