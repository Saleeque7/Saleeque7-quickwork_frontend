import React, { useState, useEffect } from "react";
import Carousel from "../../components/uic/Carousel";
import ProfileBar from "../../components/uic/ProfileBar";
import JobCards from "../../components/uic/JobCards";
import { useSelector } from "react-redux";
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
      <div className="min-h-screen text-left">
        {userProfile && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 md:p-12 gap-8">
              <div className="w-full md:w-[75%] flex flex-col items-center justify-center p-8 rounded-md bg-white shadow-sm min-h-[20vh]">
                <Carousel />
              </div>
              <div className="w-full md:w-[25%] flex flex-col items-center justify-center">
                <ProfileBar user={user} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start bg-gray-100 p-5">
              <h2 className="text-2xl text-teal-600 hover:text-teal-700 cursor-pointer ml-12 font-bold transition-colors">
                Jobs you might like
              </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start bg-gray-100 p-5 gap-4">
              {["Best Matches", "Most Recent", "Saved Jobs"].map((heading) => (
                <button
                  key={heading}
                  onClick={() => {
                    setActiveHeading(heading);
                    setCurrentPage(1);
                  }}
                  className={`text-xl font-bold cursor-pointer transition-colors pl-8 ${
                    activeHeading === heading
                      ? "text-teal-700 border-b-2 border-teal-700"
                      : "text-gray-500 hover:text-teal-600"
                  }`}
                >
                  {heading}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row bg-gray-100 mt-[-16px]">
              <div className="ml-16 w-full md:w-[80%]">
                <hr className="border-gray-300 w-full" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-gray-100 text-xs p-4">
              <p className="ml-16 text-gray-500 italic">
                {activeHeading === "Best Matches"
                  ? `*Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.`
                  : `*Browse the most recent jobs that match your skills and profile description to the skills clients are looking for.`}
              </p>
            </div>

            <div className="flex flex-col md:flex-row bg-gray-100">
              <div className="ml-16 w-full md:w-[80%]">
                <hr className="border-gray-300 w-full" />
              </div>
            </div>

            <div className="flex flex-col bg-gray-100 p-5">
              <JobCards
                jobs={jobs}
                activeHeading={activeHeading}
                savedJobs={savedJobs}
                setSavedJobs={setSavedJobs}
                DislikeJobs={DislikeJobs}
                setDislikeJobs={setDislikeJobs}
              />
            </div>
            <div className="p-5 bg-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {!userProfile && <UserProfile user={user} />}
      </div>
    </>
  );
}
