
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
    useRadio,
    useDisclosure,
  } from "@chakra-ui/react";
  import Logo from "../../components/uic/Logo";
  import { PasswordField } from "../../components/uic/passwordShow";
  import { toast } from "react-toastify";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { setAdmin  ,setAdminAuth} from "../../utils/Redux/adminSlice";
  import { AdminAxios } from "../../utils/api/baseUrl";
  import { Link } from "react-router-dom";
  import { useDispatch } from "react-redux";

  const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
const disPatch = useDispatch()

  
    const handleLogin = async () => {
      setLoading(true);
      try {
        if (!email.trim() || !password.trim()) {
          toast.error("fields cannot be empty", {
            autoClose: 1000,
            closeButton: true,
          });
          return;
        }
        const loginData = { email, password };
        const res = await AdminAxios.post("/login", loginData);
        if (res.status === 200) {
          const accessToken = res.data.accessToken
          const refreshToken = res.data.refreshToken
          if (res.data.success) {
            const person = res.data.person;
            toast.success(res.data.message, {
              autoClose: 1000,
              closeButton: true,
              draggable: true,
            });
            setEmail("");
            setPassword("");
            setTimeout(() => {
              
                disPatch(setAdmin(person))
                disPatch(setAdminAuth())
                localStorage.setItem("adminrefreshToken",refreshToken)
                localStorage.setItem("adminaccessToken",accessToken)
                navigate("/admin/dashboard");
            
            }, 2000);
          } else {
            toast.error(res.data.message, {
              autoClose: 1000,
              closeButton: true,
              draggable: true,
            });
          }
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
          toast.error("An unexpected error occurred. Please try again later.", {
            autoClose: 2000,
            closeButton: true,
          });
        }
      }finally{
        setLoading(false);
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
                  Admin Login
                </Heading>
              
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
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
                <HStack justify="end">
                  {/* <Checkbox defaultChecked>Remember me</Checkbox> */}
                  {/* <Button variant="text" size="sm" onClick={onOpen}>
                    Forgot password?
                  </Button> */}
                  
                </HStack>
                <Stack spacing="6">
                  <Button
                    bg={"blue.500"}
                    color={"white"}
                    _hover={{ bg: "blue.800" }}
                    onClick={handleLogin}
                    isLoading={loading}
                    disabled={loading}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default AdminLogin;
  