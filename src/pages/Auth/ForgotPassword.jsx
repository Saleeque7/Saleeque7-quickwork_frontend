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
import emailLogo from "../../assets/email.webp";
import { PasswordField } from "../../components/uic/passwordShow";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AuthAxios } from "../../utils/api/baseUrl";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState();
  const [timer, setTimer] = useState(30);
  const [resotp, setResotp] = useState();
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailError || otpError || passwordError) {
      const timer = setTimeout(() => {
        setError("");
        setOtpError("");
        setPasswordError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailError, otpError, passwordError]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      setOtp("");
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSendEmail = async () => {
    try {
      if (!email) {
        setError("Email address is required.");
        return;
      }
      const res = await AuthAxios.post("/forgot-password", { email });
      if (res.status === 200) {
        if (res.data.success) {
          setShowOtpInput(true);
          setResotp(res.data.otp);
        }
      } else {
        toast.error(res.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setTimer("");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        setError(error.response.data.message);
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
  const handleResend = async () => {
    try {
      const res = await AuthAxios.post("/resend-otp", { email });
      if (res.data.success) {
        setResotp(res.data.resendOtp);
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
      const res = await AuthAxios.post("/verifyPassword-otp", {
        otp: otp,
        enteredotp: resotp,
      });
      if (res.data.success) {
        toast.success(res.data.message, {
          autoClose: 1000,
          closeButton: true,
        });
        setOtp("");
        setTimer("");
        setOtpExpired(false);
        setShowOtpInput(false);
        setShowNewPasswordInput(true);
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

  const handleResetPassword = async () => {
    try {
      if (!password) {
        setPasswordError("Please enter a new password");
        return;
      }
      const res = await AuthAxios.post("/reset-password", { email, password });
      if (res.status === 200) {
        if (res.data.success) {
          toast.success(res.data.message, {
            autoClose: 800,
            closeButton: true,
            draggable: true,
          });
          setOtp(res.data.otp);
          setEmail("");
          setPassword("");
          setShowNewPasswordInput(false);
          navigate("/login", { replace: true });
        }
      } else {
        toast.error(res.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        toast.error(error.response.data.message, {
          autoClose: 2000,
          closeButton: true,
        });
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error("Network error. Please try again later.", {
          autoClose: 2000,
          closeButton: true,
        });
      } else {
        console.error("Error setting up the request:", error.message);
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
                Update your password
              </Heading>
              <Text color="grey">
                Don't have an account?{" "}
                <Link
                  to={"/pre"}
                  style={{ textDecoration: "none", color: "teal" }}
                >
                  Sign up
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
              <Image src={emailLogo} boxSize="100px" />
              {!showNewPasswordInput && !showOtpInput && (
                <Text mt={2} color={"gray"}>
                  Enter your <strong>EMAIL ADDRESS</strong> and select Send
                  Email{" "}
                </Text>
              )}

              {showOtpInput &&
                !showNewPasswordInput &&
                (!otpExpired ? (
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
                ))}

              {showNewPasswordInput && (
                <Text mt={2} color={"gray"}>
                  Enter your <strong>NEW PASSWORD</strong> and Submit{" "}
                </Text>
              )}
            </Stack>

            <Stack spacing="6">
              <Stack spacing="5">
                {!showOtpInput && (
                  <FormControl isInvalid={emailError}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      borderColor={emailError ? "red.500" : undefined}
                      focusBorderColor={emailError ? "red.500" : undefined}
                      onChange={(e) => setEmail(e.target.value)}
                      isDisabled={showNewPasswordInput}
                    />
                    {emailError && (
                      <FormErrorMessage>{emailError}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {showNewPasswordInput && (
                  <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    passwordError={passwordError}
                  />
                )}
              </Stack>

              {showOtpInput && !showNewPasswordInput && (
                <Stack spacing="5">
                  <FormControl isInvalid={otpError} isDisabled={otpExpired}>
                    <FormLabel textAlign="center" pb={4}>
                      {otpExpired ? "" : "Enter OTP"}
                    </FormLabel>
                    <Flex justifyContent="center">
                      <HStack spacing={6} mb={4}>
                        <PinInput
                          value={otp}
                          onChange={setOtp}
                          isDisabled={otpExpired}
                          color
                        >
                          <PinInputField
                            borderColor={otpError ? "red.300" : "gray.200"}
                          />
                          <PinInputField
                            borderColor={otpError ? "red.300" : "gray.200"}
                          />
                          <PinInputField
                            borderColor={otpError ? "red.300" : "gray.200"}
                          />
                          <PinInputField
                            borderColor={otpError ? "red.300" : "gray.200"}
                          />
                        </PinInput>
                      </HStack>
                    </Flex>
                    {otpError && (
                      <FormErrorMessage justifyContent="center">
                        {otpError}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              )}

              <Stack spacing="6">
                {!showOtpInput && !showNewPasswordInput && (
                  <Button
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: "blue.800" }}
                    onClick={handleSendEmail}
                  >
                    Send Email
                  </Button>
                )}

                {showOtpInput && !showNewPasswordInput && (
                  <Button
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: "blue.800" }}
                    onClick={otpExpired ? handleResend : handleVerifyOtp}
                  >
                    {otpExpired ? "Resend OTP" : "Verify OTP"}
                  </Button>
                )}

                {showNewPasswordInput && (
                  <Button
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: "blue.800" }}
                    onClick={handleResetPassword}
                  >
                    Submit
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
