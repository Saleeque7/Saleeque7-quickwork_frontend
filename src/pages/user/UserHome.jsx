import { Box, Text, Flex, Divider } from "@chakra-ui/react";
import Carousel from "../../components/uic/Carousel";
import ProfileBar from "../../components/uic/ProfileBar";
import JobCards from "../../components/uic/JobCards";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import UserProfile from "../../components/user/UserProfile";
import { useUserProfile } from "../../utils/context/ProfileContext";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { getJobPost, getsavedJobApi } from "../../utils/api/api";
import { Pagination } from "../../components/user/Pagination";

export default function UserHome() {
  const { userProfile, setUserProfile } = useUserProfile();
  const user = useSelector((state) => state.persisted.user.user);
  const [activeHeading, setActiveHeading] = useState("Best Matches");
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [DislikeJobs, setDislikeJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user.isUserProfile) {
      setUserProfile(true);
    }
  }, [user.isUserProfile]);

  useEffect(() => {
    if (activeHeading === "Best Matches" || activeHeading === "Most Recent") {
      fetchJobPosts(activeHeading, currentPage);
    }
    if (activeHeading === "Saved Jobs") {
      fetchSavedJobs(currentPage);
    }
  }, [activeHeading, currentPage]);

  const fetchJobPosts = async (activeHeading, page = 1, limit = 3) => {
    try {
      const res = await userAxiosInstance.get(getJobPost, {
        params: { activeHeading, page, limit },
      });
      console.log(res.data);
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchSavedJobs = async (page = 1, limit = 3) => {
    try {
      const res = await userAxiosInstance.get(getsavedJobApi, {
        params: { page, limit },
      });

      setSavedJobs(res.data.jobs.map((item) => item.job));
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching saved job posts:", error);
    }
  };

  return (
    <>
      <Box  minH="100vh">
        {userProfile && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flexDirection={{ base: "column", md: "row" }}
              bg="gray.100"
            >
              <Box
                w={{ base: "100%", md: "75%" }}
                mb={{ base: 8, md: 0 }}
                alignItems="center"
                p={8}
                borderRadius="md"
                textAlign="center"
              >
                <Box
                  w={{ base: "100%" }}
                  minH="20vh"
                  mb={{ base: 8, md: 0 }}
                  alignItems="center"
                  justifySelf={"center"}
                  borderRadius="md"
                  textAlign="center"
                >
                  <Carousel />
                </Box>
              </Box>
              <Box
                w={{ base: "100%", md: "25%" }}
                mb={{ base: 8, md: 0 }}
                alignItems="center"
                ml={12}
                textAlign="center"
              >
                <ProfileBar user={user} />
              </Box>
            </Flex>

            <Flex
              justifyContent="flex-start"
              alignItems="start"
              flexDirection={{ base: "column", md: "row" }}
              bg="gray.100"
              p={5}
            >
              <Text
                color="teal.500"
                _hover={{ color: "green", cursor: "pointer" }}
                ml={12}
                fontSize={"2xl"}
              >
                Jobs you might like
              </Text>
            </Flex>

            <Flex
              justifyContent="flex-start"
              alignItems="start"
              flexDirection={{ base: "column", md: "row" }}
              bg="gray.100"
              p={5}
            >
              {["Best Matches", "Most Recent", "Saved Jobs"].map((heading) => (
                <Text
                  key={heading}
                  fontSize="xl"
                  fontWeight="bold"
                  mr={4}
                  mb={{ base: 4, md: 0 }}
                  color={activeHeading === heading ? "green" : "dark"}
                  ml={5}
                  _hover={{ color: "teal.700", cursor: "pointer" }}
                  onClick={() => {
                    setActiveHeading(heading);
                    setCurrentPage(1);
                  }}
                  pl={8}
                >
                  {heading}
                </Text>
              ))}
            </Flex>

            <Flex
              flexDirection={{ base: "column", md: "row" }}
              bg="gray.100"
              mt={-4}
            >
              <Box ml={16} w={{ base: "100%", md: "80%" }}>
                <Divider borderColor={"gray"} />
              </Box>
            </Flex>

            <Flex
              flexDirection={{ base: "column", md: "row" }}
              bg="gray.100"
              fontSize={"xs"}
              p={4}
            >
              <Text ml={16}>
                {activeHeading === "Best Matches"
                  ? `*Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.`
                  : `*Browse the most recent jobs that match your skills and profile description to the skills clients are looking for.`}
              </Text>
            </Flex>

            <Flex flexDirection={{ base: "column", md: "row" }} bg="gray.100">
              <Box ml={16} w={{ base: "100%", md: "80%" }}>
                <Divider borderColor={"gray"} />
              </Box>
            </Flex>

            <Flex
              flexDirection={{ base: "column", md: "column" }}
              bg="gray.100"
              p={5}
             
            >
              <JobCards
                jobs={jobs}
                activeHeading={activeHeading}
                savedJobs={savedJobs}
                setSavedJobs={setSavedJobs}
                DislikeJobs={DislikeJobs}
                setDislikeJobs={setDislikeJobs}
              />
            </Flex>
            <Box p={5}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Box>
          </Box>
        )}

        {!userProfile && <UserProfile user={user} />}
      </Box>
    </>
  );
}
