import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import Logo from "../../components/uic/Logo";
import { AuthButtonGroup } from "../../components/uic/AuthButtons";
import { PasswordField } from "../../components/uic/passwordShow";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserAxios, ClientAxios } from "../../utils/api/baseUrl";
import { useState } from "react";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp , setOtp] = useState()

  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType 

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    const userInfo = { name, email, phone, password, job_role: userType }; 
    try {
      let AxiosInstance;
      if (userType === "client") {
        AxiosInstance = ClientAxios;
      } else if (userType === "freelancer") {
        AxiosInstance = UserAxios;
      } else {
        navigate("/pre");
      }
      const res = await AxiosInstance.post("/register", userInfo);
      
     
      if (res.data.success) {
        toast.info(res.data.message,{
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        const responseOtp = res.data.otp
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        navigate('/verifyRegistration',{state:{ userInfo, responseOtp } })
      } 
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
          toast.error("Email already exists");
      } else {
          toast.error("An error occurred while processing your request");
      }
    }
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
      <Flex position="sticky" top="0" zIndex="sticky">
      <Link to={'/'}>
          <Logo />
        </Link>
      </Flex>
      <Container
        maxW="xl"
        py={{ base: "8", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="7">
          <Stack spacing="5" textAlign="center">
            <Heading size={{ base: "xs", md: "xl" }} color={"teal.600"}>
              {userType === "freelancer"
                ? "Sign up to find work you love"
                : "Sign up to hire talent"}
            </Heading>
            <GoogleOAuthProvider clientId="1011709679059-km4ncqucf9k86qroa03mlhjhlhuv256s.apps.googleusercontent.com">
                <AuthButtonGroup layout="Signup" userType={userType} />
                </GoogleOAuthProvider>
          </Stack>
        </Stack>
        <HStack mt={"12"}>
          <Divider />
          <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
            or continue with
          </Text>
          <Divider />
        </HStack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg="white"
          mt={"10"}
          boxShadow="md"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel>{userType === "freelancer" ?"Name" :"Company Name" }</FormLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
              </FormControl>
              <FormControl>
                <FormLabel>{userType === "freelancer" ?"Email" :"Company Email" }</FormLabel>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControl>
                <FormLabel>{userType === "freelancer" ?"Phone Number" :"Contact Number" }</FormLabel>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="Number"
                />
              </FormControl>
            </Stack>
            <Stack spacing="6">
              <Button
                bg={"blue.500"}
                color={"white"}
                _hover={{ bg: "blue.800" }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
          <Stack mt={"5"} alignItems={"center"}>
            <Text color="grey">
              Already have an account?{" "}
              <Link
                to={"/login"}
                style={{ textDecoration: "none", color: "teal" }}
              >
                Log In
              </Link>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp;
