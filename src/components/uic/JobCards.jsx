import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tooltip,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import { HiOutlineThumbDown, HiThumbDown } from "react-icons/hi";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import Rating from "./Rating";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import {
  saveJobApi,
  unsaveJobApi,
  disLikeJobApi,
  LikeJobApi,
  userProfileApi,
} from "../../utils/api/api";
import { setUser } from "../../utils/Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCheckCircle } from "react-icons/ai";

const JobCards = ({
  jobs,
  activeHeading,
  savedJobs,
  setSavedJobs,
  DislikeJobs,
  setDislikeJobs,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.persisted.user.user);
  const userReviews = [2];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotInterested, setNotInterested] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(()=>{
    const fetchUser = async()=>{
      const res = await userAxiosInstance.get(userProfileApi)
      if(res.data){
        dispatch(setUser(res.data))
      }
    }
    fetchUser()
  },[])

  const handleSaveJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.post(saveJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
        const savedJobIds = getSavedJobIds();
        setSavedJobs((prevSavedJobs) => [
          ...prevSavedJobs,
          jobs.find((job) => job._id === jobId),
        ]);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleUnSaveJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.post(unsaveJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
        const savedJobIds = getSavedJobIds();
        setSavedJobs((prevSavedJobs) =>
          prevSavedJobs.filter((job) => job._id !== jobId)
        );
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
  };

  const getSavedJobIds = () => {
    return user.savedJobs.map((job) => job.job);
  };

  const handleDislikeJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.put(disLikeJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
        setDislikeJobs([...DislikeJobs, jobId]);
      }
    } catch (error) {
      console.error(error, "error in dislike job");
    }
  };

  const handleLikeJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.put(LikeJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
        setDislikeJobs(DislikeJobs.filter((id) => id !== jobId));
      }
    } catch (error) {
      console.error(error, "error in like job");
    }
  };

  const savedJobIds = user.savedJobs.map((job) => job.job);
  const DislikedJobs = user.notInterestedJobs.map((job) => job.job);
  const appliedJobIds = user.applications.map((job) => job.jobId);

  useEffect(() => {
    setNotInterested(DislikedJobs);
  }, [DislikeJobs]);

  const renderJobs = (jobsToRender) => {
    return jobsToRender.map((job, index) => {
      const isSaved = savedJobIds.includes(job._id);
      const isDislike = DislikedJobs.includes(job._id);
      const isApplied = appliedJobIds.includes(job._id);
      return (
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="xl"
          p={8}
          m={4}
          ml={12}
          width={{ base: "90%", md: "80%" }}
          key={index}
        >
          {isLoading ? (
            <Skeleton height="20px" mb="4" />
          ) : (
            <Text fontSize="xs" color="gray.500">
              Posted: {format(job.createdAt)}
            </Text>
          )}

          <Flex justifyContent="flex-end" alignItems="center">
            {!isApplied && !isSaved && (
              <Tooltip label={isDislike ? "Interested" : "Not Interested"}>
                <IconButton
                  icon={isDislike ? <HiThumbDown /> : <HiOutlineThumbDown />}
                  color="teal.700"
                  fontSize="2xl"
                  cursor="pointer"
                  mr={4}
                  aria-label="Not Interested"
                  variant="ghost"
                  onClick={() =>
                    isDislike
                      ? handleLikeJob(job._id)
                      : handleDislikeJob(job._id)
                  }
                />
              </Tooltip>
            )}

            {isApplied && (
              <Tooltip label="Applied">
                <Box display="flex" alignItems="center" cursor="default" mr={8}>
                  <Icon
                    as={AiOutlineCheckCircle}
                    color="green.500"
                    fontSize="2xl"
                  />
                  <Text ml={2} fontSize="lg" color="green.500">
                    Applied
                  </Text>
                </Box>
              </Tooltip>
            )}

            {!isNotInterested.includes(job._id) && (
              <Tooltip label={isSaved ? "Unsave Job" : "Save Job"}>
                <IconButton
                  icon={isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                  color="teal.700"
                  fontSize="2xl"
                  cursor="pointer"
                  mr={8}
                  aria-label={isSaved ? "Unsave Job" : "Save Job"}
                  variant="ghost"
                  onClick={() =>
                    isSaved ? handleUnSaveJob(job._id) : handleSaveJob(job._id)
                  }
                />
              </Tooltip>
            )}
          </Flex>

          {!isNotInterested.includes(job._id) ? (
            <>
              <Flex justifyContent="start" alignItems="center" mt={-3}>
                {isLoading ? (
                  <Skeleton height="24px" width="50%" />
                ) : (
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    cursor="pointer"
                    color="teal"
                    onClick={() => navigate(`/user/JobProfile/${job._id}`)}
                  >
                    {job.jobRole}
                  </Text>
                )}
              </Flex>

              <Flex justifyContent="start" alignItems="center" mt={3} mb={8}>
                {isLoading ? (
                  <Skeleton height="16px" width="20%" />
                ) : (
                  <div>
                    <Text fontSize="xs" color="gray.500">
                      {job.projectTerm} -{" "}
                      {job.budgetType === "fixed"
                        ? `${job.budgetType} Price - ₹${job.budget}`
                        : `${job.budgetType} rate - ₹${job.wageRangeMin} to ₹${job.wageRangeMax}`}
                    </Text>
                    {job.budgetType === "hourly" && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Estimated Time: {job.selecthour} hrs
                      </Text>
                    )}
                  </div>
                )}
              </Flex>

              {isLoading ? (
                <Skeleton height="120px" />
              ) : (
                <Text fontSize="md" mb={4}>
                  {job.description}
                </Text>
              )}

              <Flex
                justifyContent="flex-start"
                alignItems="center"
                mt={2}
                flexWrap="wrap"
              >
                {job.skills.map((skill, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    border="1px solid gray.400"
                    boxShadow="sm"
                    bg="gray.200"
                    borderRadius="md"
                    m={2}
                    px={4}
                    py={2}
                  >
                    {isLoading ? (
                      <Skeleton height="16px" width="40px" />
                    ) : (
                      skill
                    )}
                  </Box>
                ))}
              </Flex>

              {!isLoading && (
                <Rating
                  layout="JobCards"
                  reviews={userReviews}
                  place={job.Place}
                />
              )}

              <Flex justifyContent="flex-start" alignItems="center" mt={3}>
                {isLoading ? (
                  <Skeleton height="16px" width="20%" />
                ) : (
                  <Text fontSize="xs" color="gray.500">
                    Proposals: {job?.proposals.length}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <Flex justifyContent="start" alignItems="center" mt={-3}>
              {isLoading ? (
                <Skeleton height="24px" width="50%" />
              ) : (
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  cursor="pointer"
                  color="teal"
                >
                  {job.jobRole}
                </Text>
              )}
            </Flex>
          )}
        </Box>
      );
    });
  };

  return (
    <>
      {activeHeading === "Best Matches" && jobs.length === 0 && (
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="xl"
          minH={"50vh"}
          alignContent="center"
          p={8}
          m={4}
          ml={12}
          width={{ base: "90%", md: "80%" }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            mt={2}
            flexWrap="wrap"
            fontFamily={"semi-bold"}
            fontSize={"2xl"}
            minH="100%"
          >
            You don't have any jobs that match your skills.
          </Flex>
        </Box>
      )}

      {activeHeading === "Most Recent" && jobs.length === 0 && (
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="xl"
          minH={"50vh"}
          alignContent="center"
          p={8}
          m={4}
          ml={12}
          width={{ base: "90%", md: "80%" }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            mt={2}
            flexWrap="wrap"
            fontFamily={"semi-bold"}
            fontSize={"2xl"}
            minH="100%"
          >
            You don't have any recent jobs to list.
          </Flex>
        </Box>
      )}

      {activeHeading === "Saved Jobs" && savedJobs.length === 0 && (
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="xl"
          minH={"50vh"}
          alignContent="center"
          p={8}
          m={4}
          ml={12}
          width={{ base: "90%", md: "80%" }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            mt={2}
            flexWrap="wrap"
            fontFamily={"semi-bold"}
            fontSize={"2xl"}
            minH="100%"
          >
            Keep track of jobs you're interested in. Click the icon on a job
            post to save it for later.
          </Flex>
        </Box>
      )}

      {activeHeading === "Best Matches" && renderJobs(jobs)}
      {activeHeading === "Most Recent" && renderJobs(jobs)}
      {activeHeading === "Saved Jobs" && renderJobs(savedJobs)}
    </>
  );
};

export default JobCards;
