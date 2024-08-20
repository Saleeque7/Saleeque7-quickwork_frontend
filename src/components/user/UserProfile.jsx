import {
  Box,
  Button,
  Flex,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Stack,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Text,
  Textarea,
  List,
  ListItem,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Radio,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import ProfileStart from "../uic/ProfileStart";
import { useUserProfile } from "../../utils/context/ProfileContext";
import ImageUploaderWithCrop from "./CroppedImage";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { addprofileApi, addprofilesecApi , addExperienceApi , isUserprofileApi } from "../../utils/api/api";
import { setUser } from "../../utils/Redux/userSlice";
import { toast } from "react-toastify";

const steps = [
  { title: "Add Profile", description: "Profile Info" },
  { title: "Professional Info", description: "Skills" },
  { title: "Job experience", description: "Experience" },
];

export default function UserProfile() {
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };

  const user = useSelector((state) => state.persisted.user.user);

  const { isStart, setIsStart } = useUserProfile();

  const [email, setEmail] = useState(user.email || "");
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [image, setImage] = useState(user?.profile?.location || "");
  const [imageError, setImageError] = useState("");
  const [place, setPlace] = useState(user.State || "");
  const [placeError, setPlaceError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDate(user.dateOfBirth) || ""
  );
  const [dateOfBirtherror, setdateOfBirthError] = useState("");

  const [jobTitle, setJobTitle] = useState(user.jobTitle || "");
  const [jobTitleError, setJobTitleError] = useState("");
  const [Overview, setOverview] = useState(user.overview || "");
  const [OverviewError, setOverviewError] = useState("");
  const [skill, setSkill] = useState("");
  const [skillError, setSkillError] = useState("");
  const [skills, setSkills] = useState(user.skills || []);
  const [rate, setRate] = useState(user.hourlyRate || "");
  const [rateError, setRateError] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [profit, setProfit] = useState("");

  const [jobTitleExp, setJobTitleExp] = useState("");
  const [jobTitleErrorExp, setJobTitleErrorExp] = useState("");
  const [companyExp, setCompanyExp] = useState("");
  const [companyExpError, setcompanyExpError] = useState("");
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState("");
  const [expOverview, setExpOverview] = useState("");
  const [expOverviewError, setExpOverviewError] = useState("");

  const [hasExperience, setHasExperience] = useState(null);
  const [selectedBox, setSelectedBox] = useState("");
  const [preformSubmit, setPreFormSubmit] = useState(false);
  const [moreExperience , setMoreExperience] = useState(false)

  const setUserrate = (rate) => {
    const ser = (rate * 10) / 100;
    const pro = rate - ser;
    setRate(rate);
    setServiceFee(ser);
    setProfit(pro);
  };
  useEffect(() => {
    if (user.hourlyRate) {
      setUserrate(user.hourlyRate);
    }
  }, [user.hourlyRate]);

  const validateDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const ageDiff = today.getFullYear() - selectedDate.getFullYear();
    const ageMonthDiff = today.getMonth() - selectedDate.getMonth();
    const ageDayDiff = today.getDate() - selectedDate.getDate();

    if (selectedDate > today) {
      return "Date of birth can't be in the future.";
    }

    if (
      ageDiff < 18 ||
      (ageDiff === 18 &&
        (ageMonthDiff < 0 || (ageMonthDiff === 0 && ageDayDiff < 0)))
    ) {
      return "You must be at least 18 years old.";
    }

    return "";
  };

  const setErrorWithTimeout = (setError, errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  function validatePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.trim();
    if (!phoneNumber) {
      return "Please enter your phone number";
    }
    const phoneRegex =
      /^\+?(\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})$/;

    if (!phoneRegex.test(phoneNumber)) {
      return "Please enter a valid phone number (10 to 14 digits, optional country/area code)";
    }
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 14) {
      return "Phone number must be between 10 and 14 digits long";
    }
    const uniqueDigits = new Set(digitsOnly);

    if (uniqueDigits.size < 4) {
      return "Phone number must contain at least 4 different digits";
    }
    return "";
  }

  const validateFields1 = () => {
    let isValid = true;
    const currentYear = new Date().getFullYear();

    if (!image.trim()) {
      setErrorWithTimeout(setImageError, "Please add an image");
      isValid = false;
    } else {
      setImageError("");
    }

    if (!phone.trim()) {
      setErrorWithTimeout(setPhoneError, "Please enter your phone number");
      isValid = false;
    } else {
      const phoneErrorMessage = validatePhoneNumber(phone);
      if (phoneErrorMessage) {
        setErrorWithTimeout(setPhoneError, phoneErrorMessage);
        isValid = false;
      } else {
        setPhoneError("");
      }
    }

    if (!dateOfBirth.trim()) {
      setErrorWithTimeout(
        setdateOfBirthError,
        "Please enter your date of birth"
      );
      isValid = false;
    } else {
      const errorMessage = validateDate(dateOfBirth);
      if (errorMessage) {
        setErrorWithTimeout(setdateOfBirthError, errorMessage);
        isValid = false;
      } else {
        setdateOfBirthError("");
      }
    }

    if (!place.trim()) {
      setErrorWithTimeout(setPlaceError, "Please enter your state");
      isValid = false;
    } else {
      setPlaceError("");
    }

    return isValid;
  };
  const validateFields2 = () => {
    let isValid = true;
    if (!jobTitle.trim()) {
      setErrorWithTimeout(setJobTitleError, "Please Add a job Title");
      isValid = false;
    } else {
      setJobTitleError("");
    }

    if (!Overview.trim()) {
      setErrorWithTimeout(setOverviewError, "Please fill the field");
      isValid = false;
    } else {
      const trimmedValue = Overview.trim();
      if (trimmedValue.length < 50) {
        setErrorWithTimeout(setOverviewError, "Enter at least 50 characters");
        isValid = false;
      } else {
        setOverviewError("");
      }
    }
    if (skills.length === 0) {
      setErrorWithTimeout(setSkillError, "Please add at least one skill");
      isValid = false;
    } else {
      setSkillError("");
    }
    if (!rate.toString().trim()) {
      setErrorWithTimeout(setRateError, "please add atleast one skill");
      isValid = false;
    } else {
      setRateError("");
    }

    return isValid;
  };

  const validateExperience = () => {
    let isValid = true;

    if (!jobTitleExp.trim()) {
      setErrorWithTimeout(setJobTitleErrorExp, "Please Add  job Title");
      isValid = false;
    } else {
      setJobTitleErrorExp("");
    }
    if (!companyExp.trim()) {
      setErrorWithTimeout(setcompanyExpError, "Please fill the field");
      isValid = false;
    } else {
      setcompanyExpError("");
    }
    if (!duration.trim()) {
      setErrorWithTimeout(setDurationError, "how many years of experience ?");
      isValid = false;
    } else {
      setDurationError("");
    }
    if (!expOverview.trim()) {
      setErrorWithTimeout(setExpOverviewError, "explain your self");
      isValid = false;
    } else {
      setExpOverviewError("");
    }
    return isValid;
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDateOfBirth(date);
  };

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        user.name &&
        user.email &&
        user.phone &&
        user.dateOfBirth &&
        user.profile.location
      ) {
        goToNext();
      } else {
        if (!validateFields1()) {
          return;
        }
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "profile_image.jpg", { type: blob.type });

      
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("place", place);
        formData.append("image", file);
        try {
          const res = await userAxiosInstance.post(addprofileApi, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (res.data && res.data.success) {
            dispatch(setUser(res.data.user));
            goToNext();
          }
        } catch (error) {
          console.error("Error saving profile:", error);
        }
      }
      //else if (){
      // alert("bayya")
      // goToNext();
      // }else{
      // alert("byya byya")
    } else if (activeStep === 1) {
      if (user.jobTitle && user.overview && user.skills && user.hourlyRate) {
        goToNext();
      } else {
        if (!validateFields2()) {
          return;
        }
        const data = {
          jobTitle,
          Overview,
          skills,
          rate,
        };
        console.log(data);
        try {
          const res = await userAxiosInstance.post(addprofilesecApi, data);

          if (res.data && res.data.user) {
            dispatch(setUser(res.data.user));
            goToNext();
          }
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
    } else if (activeStep === 2) {
      if (!hasExperience) {
        const res = await  userAxiosInstance.post(isUserprofileApi)
        console.log(res.data);
        if (res.data && res.data.user) {
          dispatch(setUser(res.data.user));
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      } else {
        if (!validateExperience()) {
          return;
        }
        const data ={
          jobTitleExp,
          companyExp,
          duration,
          expOverview
        }
        const res = await userAxiosInstance.post(addExperienceApi,data)
        console.log(res.data);
        if (res.data && res.data.user) {
          dispatch(setUser(res.data.user));
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      }
    }
  };

  const handlePrev = () => {
    goToPrevious();
  };
  const handleProfileStart = () => {
    setIsStart(true);
  };
  const handleImageCropped = (croppedImageUrl) => {
    setImage(croppedImageUrl);
  };
  const handlebackpage = () => {
    setHasExperience(null);
    setPreFormSubmit(false);
  };

  const handleBoxClick = (boxName) => {
    setSelectedBox(boxName);
  };
  const handleExperienceSubmit = () => {
    if (selectedBox === "boxA") {
      setHasExperience(true);
    } else if (selectedBox === "boxB") {
      setHasExperience(false);
    }
    setPreFormSubmit(true);
  };

  const addSkill = () => {
    if (skill.trim()) {
      setSkills([...skills, skill]);
      setSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleRate = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    const amt = parseInt(numericValue, 10);

    if (isNaN(amt) || numericValue === "") {
      setRate("");
      setServiceFee("");
      setProfit("");
    } else {
      const servicePer = 10;
      const serFee = amt * (servicePer / 100);
      const prft = amt - serFee;

      setRate(numericValue);
      setServiceFee(serFee.toFixed(2));
      setProfit(prft.toFixed(2));
    }
  };

  const durationOptions = [
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "3 years", value: "3 years" },
    { label: "4 years", value: "4 years" },
    { label: "5 years", value: "5 years" },
    { label: "Above 5 years", value: "Above 5 years" },
  ];

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };
  return (
    <>
      {isStart ? (
        <Box
        bgGradient="linear(to-b, green.100, gray.100)"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection={{ base: "column", md: "row" }}
            p={5}

          >
            <Box
              w={{ base: "100%", md: "75%" }}
              mb={{ base: 8, md: 0 }}
              alignItems="center"
              p={8}
              mt={8}
              borderRadius="md"
              textAlign="center"
             boxShadow="xl"
             bg={"white"}

            >
              <Stepper index={activeStep}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <>
                  <Flex
                    px={10}
                    mb={-2}
                    mt={12}
                    fontSize={"2xl"}
                    fontWeight="bold"
                    color={"teal.700"}
                    textDecoration="underline"
                  >
                    <Text>Basic Info</Text>
                  </Flex>
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDirection={{ base: "column", md: "row" }}
                    p={5}
                  >
                    <Box w={{ base: "100%", md: "70%" }} p={5}>
                      <Stack spacing={4}>
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            placeholder
                            type="text"
                            value={name}
                            fontWeight={"bold"}
                            isDisabled
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            placeholder
                            type="email"
                            isDisabled
                            value={email}
                            fontWeight={"bold"}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl isInvalid={!!phoneError}>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            placeholder
                            type="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          {phoneError && (
                            <FormErrorMessage>{phoneError}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Stack>
                    </Box>
                    <ImageUploaderWithCrop
                      user={user}
                      onImageCropped={handleImageCropped}
                      imageError={imageError}
                    />
                  </Flex>
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDirection={{ base: "column", md: "row" }}
                    mt={-12}
                    p={5}
                  >
                    <Box w={{ base: "100%", md: "50%" }} p={5}>
                      <Stack spacing={4}>
                        <FormControl isInvalid={!!dateOfBirtherror}>
                          <FormLabel>Date of Birth</FormLabel>
                          <Input
                            placeholder=""
                            type="date"
                            value={dateOfBirth}
                            sx={!dateOfBirth ? { opacity: 0.5 } : {}}
                            onChange={handleDateChange}
                          />
                          {dateOfBirtherror && (
                            <FormErrorMessage>
                              {dateOfBirtherror}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Stack>
                    </Box>
                    <Box w={{ base: "100%", md: "50%" }} p={5}>
                      <Stack spacing={4}>
                        <FormControl isInvalid={!!placeError}>
                          <FormLabel>State</FormLabel>
                          <Input
                            placeholder
                            type="text"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                          />
                          {placeError && (
                            <FormErrorMessage>{placeError}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Stack>
                    </Box>
                  </Flex>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Flex
                    px={10}
                    mb={-2}
                    mt={12}
                    fontSize={"2xl"}
                    fontWeight="bold"
                    color={"teal.700"}
                    textDecoration="underline"
                  >
                    <Text>Professional Information</Text>
                  </Flex>
                  <Flex
                    justifyContent="start"
                    flexDirection={{ base: "column", md: "row" }}
                    p={5}
                  >
                    <Box w={{ base: "100%", md: "70%" }} p={5}>
                      <Stack spacing={4}>
                        <FormControl isInvalid={!!jobTitleError}>
                          <FormLabel>Job Title</FormLabel>
                          <Input
                            type="text"
                            placeholder="Ex:Full-stack developer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                          />
                          {jobTitleError && (
                            <FormErrorMessage>{jobTitleError}</FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl isInvalid={!!OverviewError}>
                          <FormLabel>Overview</FormLabel>
                          <Textarea
                            placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
                            value={Overview}
                            onChange={(e) => setOverview(e.target.value)}
                          />
                          <Box mt={1} textAlign="right">
                            <Text fontSize="xs" color="gray.600">
                              At least 50 characters
                            </Text>
                          </Box>
                          {OverviewError && (
                            <FormErrorMessage>{OverviewError}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Stack>
                    </Box>
                  </Flex>
                  <Flex
                    px={10}
                    mb={-2}
                    mt={4}
                    fontSize={"2xl"}
                    fontWeight="bold"
                    color={"teal.700"}
                    textDecoration="underline"
                  >
                    <Text>Your Skills</Text>
                  </Flex>
                  <Flex
                    justifyContent="start"
                    flexDirection={{ base: "column", md: "row" }}
                    p={5}
                  >
                    <Box w={{ base: "100%", md: "70%" }} p={5}>
                      <Stack spacing={4}>
                        <FormControl isInvalid={!!skillError}>
                          <FormLabel>Add Skills</FormLabel>
                          <Flex align="center">
                            <Input
                              type="text"
                              placeholder="Enter skills here"
                              value={skill}
                              onChange={(e) => setSkill(e.target.value)}
                            />
                            <Button
                              ml={2}
                              onClick={addSkill}
                              colorScheme="teal"
                            >
                              Add
                            </Button>
                          </Flex>
                          {skillError && (
                            <FormErrorMessage>{skillError}</FormErrorMessage>
                          )}
                        </FormControl>
                        <Flex wrap="wrap" mr={4}>
                          {skills.map((skill, index) => (
                            <Box
                              key={index}
                              display="flex"
                              alignItems="center"
                              border="1px solid gray.400"
                              boxShadow={5}
                              bg={"gray.200"}
                              borderRadius="md"
                              mr={2}
                              px={4}
                              py={2}
                              mb={3}
                            >
                              {skill}
                              
                                <IconButton
                                  icon={<CloseIcon />}
                                  size="xs"
                                  onClick={() => removeSkill(index)}
                                  ml={2}
                                  colorScheme="red"
                                />
                              
                            </Box>
                          ))}
                        </Flex>
                      </Stack>
                    </Box>
                  </Flex>
                  <Flex
                    px={10}
                    mb={-2}
                    mt={4}
                    fontSize={"2xl"}
                    fontWeight="bold"
                    color={"teal.700"}
                    textDecoration="underline"
                  >
                    <Text>Work fee or Hourly rate</Text>
                  </Flex>
                  <Flex
                    justifyContent="start"
                    flexDirection={{ base: "column", md: "row" }}
                    p={5}
                  >
                    <Box w={{ base: "100%", md: "100%" }} p={5}>
                      <Stack spacing={4}>
                        <TableContainer>
                          <Table>
                            <Tbody>
                              <Tr>
                                <Td fontSize={"xl"}>
                                  Hourly rate <br />
                                  <Text fontSize={"sm"} mt={2}>
                                    Total amount the client will see.
                                  </Text>
                                </Td>
                                <Td isNumeric>
                                  <FormControl isInvalid={!!rateError}>
                                    <Input
                                      placeholder="₹ 0:00 / hr"
                                      value={rate ? `₹${rate}` : ""}
                                      onChange={handleRate}
                                      textAlign="right"
                                    />
                                    {rateError && (
                                      <FormErrorMessage>
                                        {rateError}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>
                                </Td>
                              </Tr>
                              <Tr>
                                <Td fontSize={"xl"}>
                                  Service fee <br />
                                  <Text fontSize="sm" mt={2}>
                                    This helps us run the platform and provide
                                    services like payment protection and
                                    customer support.
                                  </Text>
                                </Td>
                                <Td isNumeric>
                                  <Input
                                    placeholder="₹ 0:00 / hr"
                                    value={serviceFee ? `₹${serviceFee}` : ""}
                                    readOnly
                                    textAlign="right"
                                  />
                                </Td>
                              </Tr>
                              <Tr>
                                <Td fontSize={"xl"}>
                                  You'll get
                                  <br />
                                  <Text fontSize={"sm"} mt={2}>
                                    The estimated amount you'll receive after
                                    service fees
                                  </Text>
                                </Td>
                                <Td isNumeric>
                                  <Input
                                    placeholder="₹ 0:00 / hr"
                                    readOnly
                                    value={profit ? `₹${profit}` : ""}
                                    textAlign="right"
                                  />
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Stack>
                    </Box>
                  </Flex>
                </>
              )}
              {activeStep === 2 && (
                <>
                  {hasExperience === null && (
                    <Box
                      py={{ base: "0", sm: "4" }}
                      px={{ base: "4", sm: "6" }}
                      minH="md"
                      boxShadow="xl"
                      borderRadius="3xl"
                      border="1px solid"
                      borderColor="gray.200"
                      alignContent="center"
                      width="2xl"
                      mx="auto"
                      mt={12}
                    >
                      <Text fontSize="xl" fontWeight="bold" textAlign="center">
                        Do you have any professional experience?
                      </Text>

                      <Stack spacing="6" mt={4}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={4}
                        >
                          <Box
                            bg="transparent"
                            alignContent="center"
                            position="relative"
                            borderWidth={selectedBox === "boxA" ? "2px" : "1px"}
                            borderColor={
                              selectedBox === "boxA" ? "green.600" : "gray.200"
                            }
                            onClick={() => handleBoxClick("boxA")}
                            cursor="pointer"
                            p={4}
                            borderRadius="md"
                            w="250px"
                            h="180px"
                          >
                            <Flex
                              justifyContent="center"
                              alignItems="center"
                              h="100%"
                            >
                              <MdCheckCircle size={24} color="teal" />
                              <Text ml={1} color="teal.800" fontSize="lg">
                                Yes, I have experience.
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
                            alignItems="center"
                            position="relative"
                            borderWidth={selectedBox === "boxB" ? "2px" : "1px"}
                            borderColor={
                              selectedBox === "boxB" ? "green.600" : "gray.200"
                            }
                            onClick={() => handleBoxClick("boxB")}
                            cursor="pointer"
                            p={4}
                            borderRadius="md"
                            w="250px"
                            h="180px"
                          >
                            <Flex
                              justifyContent="center"
                              alignItems="center"
                              h="100%"
                            >
                              <MdCancel size={24} color="teal" />
                              <Text ml={1} color="teal.800" fontSize="lg">
                                No, I don't have any experience.
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

                        <Flex
                          direction="row"
                          gap={4}
                          alignItems="center"
                          justifyContent="center"
                          mt={4}
                        >
                          <Button
                            bg={"blue.500"}
                            color={"white"}
                            _hover={{ bg: "blue.800" }}
                            onClick={handleExperienceSubmit}
                            disabled={!selectedBox}
                            opacity={!selectedBox ? 0.5 : 1}
                            width="150px"
                            height="50px"
                          >
                            continue
                          </Button>
                        </Flex>
                      </Stack>
                    </Box>
                  )}

                  {hasExperience === true && (
                    <Stack spacing={4} mt={12}>
                      <FormControl isInvalid={!!jobTitleErrorExp}>
                        <FormLabel>Job Title</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ex: Full-stack developer"
                          value={jobTitleExp}
                          onChange={(e) => setJobTitleExp(e.target.value)}
                        />
                        {jobTitleErrorExp && <FormErrorMessage>{ jobTitleErrorExp} </FormErrorMessage>}
                      </FormControl>
                      <FormControl isInvalid={!!companyExpError}>
                        <FormLabel>Company</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ex: ABC Corp"
                          value={companyExp}
                          onChange={(e) => setCompanyExp(e.target.value)}
                        />
                        {
                          companyExpError && <FormErrorMessage>{companyExpError}</FormErrorMessage>
                        }
                      </FormControl>

                      <FormLabel>Duration</FormLabel>
                      <Flex
                        justifyContent="start"
                        alignItems="center"
                        flexDirection={{ base: "column", md: "row" }}
                        p={5}
                        mt={-12}
                      >
                        <Box w={{ base: "100%", md: "50%" }} p={5}>
                          <Stack ml={-10}>
                            <FormControl isInvalid={!!durationError}>
                              <Select
                                placeholder="Select duration"
                                value={duration}
                                onChange={handleDurationChange}
                              >
                                {durationOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                               { durationError && <FormErrorMessage>
                                {durationError}
                                </FormErrorMessage>}
                            </FormControl>
                          </Stack>
                        </Box>
                      </Flex>

                      <FormControl isInvalid={!!expOverviewError}>
                        <FormLabel>Overview</FormLabel>
                        <Textarea
                          placeholder="Describe your role, responsibilities, and achievements"
                          value={expOverview}
                          onChange={(e) => setExpOverview(e.target.value)}
                        />
                        {expOverviewError && 
                        <FormErrorMessage>
                          {expOverviewError}
                        </FormErrorMessage>
                        }
                      </FormControl>
                      <Flex
                        direction="row"
                        gap={4}
                        alignItems="center"
                        justifyContent="center"
                        mt={4}
                      >
                        <Button
                          bg={"blue.500"}
                          color={"white"}
                          _hover={{ bg: "blue.800" }}
                          onClick={handlebackpage}
                          width="150px"
                          height="50px"
                          leftIcon={<ArrowBackIcon />}
                        >
                          Back
                        </Button>
                      </Flex>
                    </Stack>
                  )}

                  {hasExperience === false &&   (
                    <Stack spacing={4} mt={4}>
                      <Text fontSize="lg">
                        Thank you for letting us know. You can proceed as a
                        fresher.
                      </Text>
                      <Flex
                        direction="row"
                        gap={4}
                        alignItems="center"
                        justifyContent="center"
                        mt={4}
                      >
                        <Button
                          bg={"blue.500"}
                          color={"white"}
                          _hover={{ bg: "blue.800" }}
                          onClick={handlebackpage}
                          width="150px"
                          height="50px"
                          leftIcon={<ArrowBackIcon />}
                        >
                          back
                        </Button>
                      </Flex>
                    </Stack>
                  )}
                </>
              )}
              <Flex mt={4} justifyContent="space-between">
                <Button isDisabled={activeStep === 0} onClick={handlePrev}>
                  Previous
                </Button>
                <Button
                  isDisabled={activeStep === steps.length - 1 && !preformSubmit}
                  onClick={handleNext}
                  color={activeStep === 2 ? "teal" : ""}
                >
                  {activeStep === 2 ? "submit" : "Next"}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Box>
      ) : (
        <ProfileStart onProfileStart={handleProfileStart} user={user} />
      )}
    </>
  );
}
