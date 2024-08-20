import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { HiOutlineThumbDown, HiThumbDown } from "react-icons/hi";
import { Pagination } from "../../components/user/Pagination";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { AiOutlineCheckCircle } from "react-icons/ai";

import {
  findWorkapi,
  saveJobApi,
  unsaveJobApi,
  disLikeJobApi,
  LikeJobApi,
  userProfileApi
} from "../../utils/api/api";
import debounce from "lodash/debounce";
import Rating from "../../components/uic/Rating";
import { setUser } from "../../utils/Redux/userSlice";

const FindWork = () => {
  const user = useSelector((state) => state.persisted.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [DislikeJobs, setDislikeJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(
    debounce(async (query, page = 1, limit = 3) => {
      try {
        const response = await userAxiosInstance.get(
          `${findWorkapi}?search=${query}`,
          {
            params: { page, limit },
          }
        );
        if (response.data) {
          console.log("API response data:", response.data);
          setJobs(response.data.jobs);
          setTotalPages(response.data.pages);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchJobs(searchQuery, currentPage);
  }, [searchQuery, currentPage, fetchJobs]);

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

  const timeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    } else {
      const today = now.setHours(0, 0, 0, 0);
      const yesterday = new Date(today - 86400000);

      if (date.getTime() >= today) {
        return "today";
      } else if (date.getTime() >= yesterday.getTime()) {
        return "yesterday";
      } else {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
      }
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.post(saveJobApi, { jobId });
      if (res.data) {
        console.log(res.data);
        dispatch(setUser(res.data));
        setSavedJobs([...savedJobs, jobId]);
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
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
      }
    } catch (error) {
      console.error("Error saving job:", error);
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

  const filteredJobs = jobs.filter((job) =>
    job.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="p-20 min-h-[80vh]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center text-2xl px-8 font-semibold text-teal-800">
            Find Work That Matches You
          </div>

          <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden w-1/2">
            <input
              aria-label="Search"
              placeholder="Search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 outline-none w-full rounded-l-xl"
            />
            <FaSearch className="text-gray-500 mx-2" />
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div
              key={index}
              className={`bg-white shadow-md rounded-xl p-8 m-4 w-full ${
                DislikedJobs.includes(job._id) ? "opacity-50" : ""
              }`}
            >
              <p className="text-xs text-gray-500">
                Posted: {timeAgo(job.createdAt)}
              </p>
              <div className="flex justify-end items-center">
                {!savedJobIds.includes(job._id) &&
                  !DislikedJobs.includes(job._id) &&
                  !appliedJobIds.includes(job._id) && (
                    <button
                      className="text-teal-700 text-2xl mr-4"
                      aria-label="Not Interested"
                      onClick={() => handleDislikeJob(job._id)}
                    >
                      <HiOutlineThumbDown />
                    </button>
                  )}

                {DislikedJobs.includes(job._id) && (
                  <button
                    className="text-teal-700 text-2xl mr-4"
                    aria-label="Interested"
                    onClick={() => handleLikeJob(job._id)}
                  >
                    <HiThumbDown />
                  </button>
                )}

                {appliedJobIds.includes(job._id) && (
                  <button
                    className="flex items-center text-green-500 text-2xl mr-5"
                    aria-label="applied Job"
                  >
                    <AiOutlineCheckCircle className="mr-2" />
                    <h1 className="text-lg">Applied</h1>
                  </button>
                )}

                {!DislikedJobs.includes(job._id) &&
                  !savedJobIds.includes(job._id) && (
                    <button
                      className="text-teal-700 text-2xl mr-8"
                      aria-label="Save Job"
                      onClick={() => handleSaveJob(job._id)}
                    >
                      <IoBookmarkOutline />
                    </button>
                  )}

                {savedJobIds.includes(job._id) && (
                  <button
                    className="text-teal-700 text-2xl mr-8"
                    aria-label="Unsave Job"
                    onClick={() => handleUnSaveJob(job._id)}
                  >
                    <IoBookmark />
                  </button>
                )}
              </div>

              <div className="flex justify-start items-center mt-[-12px]">
                <p
                  className={`text-xl font-bold text-teal-500 cursor-pointer ${
                    DislikedJobs.includes(job._id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (!DislikedJobs.includes(job._id)) {
                      navigate(`/user/JobProfile/${job._id}`);
                    }
                  }}
                >
                  {job.jobRole}
                </p>
              </div>

              <div className="flex justify-start items-center mt-3 mb-8">
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
              </div>

              <p className="text-md mb-4">{job.description}</p>

              <div className="flex justify-start items-center mt-2 flex-wrap">
                {job.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-gray-400 bg-gray-200 rounded-md m-2 px-4 py-2"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              <Rating layout="JobCards" reviews={[2]} place={job.Place} />
              <div className="flex justify-start items-center mt-3">
                <p className="text-xs text-gray-500">Proposals: 20</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-64 text-center font-semibold text-2xl text-gray-500">
            No jobs found. Try adjusting your search criteria.
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default FindWork;
