import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await userAxiosInstance.get(userProfileApi);
      if (res.data) {
        dispatch(setUser(res.data));
      }
    };
    fetchUser();
  }, []);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.post(saveJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
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
        setSavedJobs((prevSavedJobs) =>
          prevSavedJobs.filter((job) => job._id !== jobId)
        );
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
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
        <div
          className="bg-white shadow-md rounded-xl p-8 m-4 ml-12 w-[90%] md:w-[80%] text-left"
          key={index}
        >
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 rounded h-4 w-1/4 mb-4" />
          ) : (
            <p className="text-xs text-gray-500">
              Posted: {format(job.createdAt)}
            </p>
          )}

          <div className="flex justify-end items-center">
            {!isApplied && !isSaved && (
              <button
                type="button"
                title={isDislike ? "Interested" : "Not Interested"}
                className="p-2 text-teal-700 hover:bg-black/5 rounded-full transition-colors cursor-pointer mr-4"
                onClick={() =>
                  isDislike
                    ? handleLikeJob(job._id)
                    : handleDislikeJob(job._id)
                }
              >
                {isDislike ? <HiThumbDown className="text-2xl" /> : <HiOutlineThumbDown className="text-2xl" />}
              </button>
            )}

            {isApplied && (
              <div className="flex items-center cursor-default mr-8" title="Applied">
                <AiOutlineCheckCircle className="text-green-500 text-2xl" />
                <span className="ml-2 text-lg text-green-500 font-semibold">
                  Applied
                </span>
              </div>
            )}

            {!isNotInterested.includes(job._id) && (
              <button
                type="button"
                title={isSaved ? "Unsave Job" : "Save Job"}
                className="p-2 text-teal-700 hover:bg-black/5 rounded-full transition-colors cursor-pointer mr-8"
                onClick={() =>
                  isSaved ? handleUnSaveJob(job._id) : handleSaveJob(job._id)
                }
              >
                {isSaved ? <IoBookmark className="text-2xl" /> : <IoBookmarkOutline className="text-2xl" />}
              </button>
            )}
          </div>

          {!isNotInterested.includes(job._id) ? (
            <>
              <div className="flex justify-start items-center mt-[-12px]">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 rounded h-6 w-1/2" />
                ) : (
                  <p
                    className="text-xl font-bold cursor-pointer text-teal-600 hover:underline"
                    onClick={() => navigate(`/user/JobProfile/${job._id}`)}
                  >
                    {job.jobRole}
                  </p>
                )}
              </div>

              <div className="flex justify-start items-center mt-3 mb-8">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-1/4" />
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">
                      {job.projectTerm} -{" "}
                      {job.budgetType === "fixed"
                        ? `${job.budgetType} Price - ₹${job.budget}`
                        : `${job.budgetType} rate - ₹${job.wageRangeMin} to ₹${job.wageRangeMax}`}
                    </p>
                    {job.budgetType === "hourly" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated Time: {job.selecthour} hrs
                      </p>
                    )}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded h-24 w-full" />
              ) : (
                <p className="text-md mb-4 text-gray-700">
                  {job.description}
                </p>
              )}

              <div className="flex justify-start items-center mt-2 flex-wrap">
                {job.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-gray-300 shadow-sm bg-gray-100 rounded-md m-2 px-4 py-1.5 text-sm font-medium"
                  >
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 rounded h-4 w-10" />
                    ) : (
                      skill
                    )}
                  </div>
                ))}
              </div>

              {!isLoading && (
                <Rating
                  layout="JobCards"
                  reviews={userReviews}
                  place={job.Place}
                />
              )}

              <div className="flex justify-start items-center mt-3">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-16" />
                ) : (
                  <p className="text-xs text-gray-500">
                    Proposals: {job?.proposals.length}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-start items-center mt-[-12px]">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded h-6 w-1/2" />
              ) : (
                <p className="text-xl font-bold cursor-pointer text-teal-600">
                  {job.jobRole}
                </p>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {activeHeading === "Best Matches" && jobs.length === 0 && (
        <div className="bg-white shadow-md rounded-xl min-h-[50vh] flex items-center justify-center p-8 m-4 ml-12 w-[90%] md:w-[80%]">
          <div className="text-center font-semibold text-2xl text-gray-600">
            You don't have any jobs that match your skills.
          </div>
        </div>
      )}

      {activeHeading === "Most Recent" && jobs.length === 0 && (
        <div className="bg-white shadow-md rounded-xl min-h-[50vh] flex items-center justify-center p-8 m-4 ml-12 w-[90%] md:w-[80%]">
          <div className="text-center font-semibold text-2xl text-gray-600">
            You don't have any recent jobs to list.
          </div>
        </div>
      )}

      {activeHeading === "Saved Jobs" && savedJobs.length === 0 && (
        <div className="bg-white shadow-md rounded-xl min-h-[50vh] flex items-center justify-center p-8 m-4 ml-12 w-[90%] md:w-[80%]">
          <div className="text-center font-semibold text-2xl text-gray-600">
            Keep track of jobs you're interested in. Click the icon on a job
            post to save it for later.
          </div>
        </div>
      )}

      {activeHeading === "Best Matches" && renderJobs(jobs)}
      {activeHeading === "Most Recent" && renderJobs(jobs)}
      {activeHeading === "Saved Jobs" && renderJobs(savedJobs)}
    </>
  );
};

export default JobCards;
