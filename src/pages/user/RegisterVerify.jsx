import {
  Box,
  Flex,
  Container,
  Stack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  FormErrorMessage,
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import Logo from "../../components/uic/Logo";
import { Link } from "react-router-dom";
import { useState } from "react";
import emailLogo from "../../assets/emalVerify.png";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {  UserAxios } from "../../utils/api/baseUrl";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegisterVerify() {
  const location = useLocation();
  const {userInfo , responseOtp} = location.state || {}
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resotp, setResotp] = useState(responseOtp);
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setResotp(responseOtp);
  }, [responseOtp]);

  useEffect(() => {
    if (otpError) {
      const timer = setTimeout(() => {
        setOtpError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [otpError]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      setResotp("");
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleResend = async () => {
    try {
      const res = await UserAxios.post("/resend-otp", { email:userInfo.email });
      if (res.data.success) {
        setResotp(res.data.resendOtp);
        setOtp("");
        setTimer(40);
        setOtpExpired(false);
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        setOtpError("please enter a otp");
        return;
      }
      const res = await UserAxios.post("/verify-otp", {
        userData: userInfo,
        otp: resotp,
        enteredotp: otp,
      });
      if (res.data.success) {
        toast.success(res.data.message, {
          autoClose: 1000,
          closeButton: true,
        });
        setOtp("");
        setTimer("");
        setOtpExpired(false);
        navigate('/login',{replace:true})
      }else {
        setOtp("");
        setOtpError(res.data.message || 'Failed to verify OTP');

      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        setOtp("");
        setOtpError(error.response.data.message);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error("Network error. Please try again later.", {
          autoClose: 2000,
          closeButton: true,
        });
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("An unexpected error occurred. Please try again later.", {
          autoClose: 2000,
          closeButton: true,
        });
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
        <Link to={"/"}>
          <Logo />
        </Link>
      </Flex>
      <Container
        maxW="lg"
        py={{ base: "8", md: "20" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="7">
          <Stack spacing="5" mt={"-16"}>
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "xl" }} color={"teal.600"}>
                Verify your Mail
              </Heading>
              <Text color="grey">
                have an account?{" "}
                <Link
                  to={"/login"}
                  style={{ textDecoration: "none", color: "teal" }}
                >
                  Sign In
                </Link>
              </Text>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg="white"
            boxShadow="md"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
          >
            <Stack alignItems="center" mb={8}>
              <Image src={emailLogo} height={150} width={200} />

              {!otpExpired ? (
                <>
                  <Text mt={2} color="gray">
                    Enter the <strong>OTP</strong> sent to your email
                    <br />
                  </Text>
                  <Text mt={2} color={timer < 10 ? "red.500" : "gray"}>
                    <strong>0:{timer.toString().padStart(2, "0")}</strong>
                  </Text>
                </>
              ) : (
                <Text mt={2} color="gray">
                  OTP expired, please resend OTP
                </Text>
              )}
            </Stack>

            <Stack spacing="5">
              <FormControl isInvalid={otpError} isDisabled={otpExpired}>
              <FormLabel textAlign="center" pb={4} >Enter OTP</FormLabel>
                  <Flex justifyContent="center">
                    <HStack spacing={6} mb={4}>
                      <PinInput
                        value={otp}
                        onChange={setOtp}
                        isDisabled={otpExpired}
                        color
                      >
                        <PinInputField borderColor={otpError ? "red.300" : "gray.200"} />
                        <PinInputField borderColor={otpError ? "red.300" : "gray.200"}/>
                        <PinInputField borderColor={otpError ? "red.300" : "gray.200"}/>
                        <PinInputField borderColor={otpError ? "red.300" : "gray.200"}/>
                      </PinInput>
                    </HStack>
                  </Flex>
                  {otpError &&  <FormErrorMessage justifyContent="center">{otpError}</FormErrorMessage>}
              </FormControl>              
              <Stack spacing="6">
                <Button
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                  onClick={otpExpired ? handleResend : handleVerifyOtp}
                >
                  {otpExpired ? "Resend OTP" : "Verify OTP"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
