import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import {
  browseJobPostsApi,
  browseContracts,
  browseSubmittedApi,
  deleteJobApi,
} from "../../utils/api/api";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import debounce from "lodash.debounce";
import JobExpiryCountdown from "../../components/Client/JobExpiry";
import { Pagination } from "../../components/user/Pagination";

export default function Joblisted() {
  const [activeminTab, setActiveminTab] = useState("All Job Posts");
  const [jobs, setJob] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [submittedContract, setSubmittedContract] = useState([]);
  const navigate = useNavigate();
  const [searchQueryContracts, setSearchQueryContracts] = useState("");
  const [searchQueryJobPosts, setSearchQueryJobPosts] = useState("");
  const [submittedContractsearchQuery, setSubmittedContractsearchQuery] =
    useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


  const fetchJob = async (query, page=1 , limit=3) => {
    try {
      const response = await clientAxiosInstance.get(browseJobPostsApi, {
        params: { searchQuery: query ,page , limit },
      });
      console.log(response.data);
      setJob(response.data.jobpost);
      setTotalPages(response.data.pages)
    } catch (error) {
      console.error("Failed to fetch job details", error);
    }
  };

  const fetchContract = async (query) => {
    try {
      const response = await clientAxiosInstance.get(browseContracts, {
        params: { searchQuery: query },
      });
      console.log(response.data);
      setContracts(response.data);
    } catch (error) {
      console.error("Failed to fetch contract details", error);
    }
  };

  const fetchSubmitContract = async (query) => {
    try {
      const response = await clientAxiosInstance.get(browseSubmittedApi, {
        params: { searchQuery: query },
      });
      console.log(response.data);
      setSubmittedContract(response.data);
    } catch (error) {
      console.error("Failed to fetch contract details", error);
    }
  };

  const handleFetchJob = useCallback(
    debounce((query,page) => fetchJob(query,page), 300),
    []
  );
  const handleFetchContract = useCallback(
    debounce((query) => fetchContract(query), 300),
    []
  );
  const handlesubmittedContract = useCallback(
    debounce((query) => fetchSubmitContract(query), 300),
    []
  );

  useEffect(() => {
    if (activeminTab === "All Job Posts") {
      handleFetchJob(searchQueryJobPosts, currentPage);
    }

    if (activeminTab === "All Contracts") {
      handleFetchContract(searchQueryContracts);
    }
    if (activeminTab === "All submitted Contracts") {
      handlesubmittedContract(submittedContractsearchQuery);
    }
  }, [
    activeminTab,
    searchQueryJobPosts,
    searchQueryContracts,
    submittedContractsearchQuery,
    currentPage,
    handleFetchJob,
    handleFetchContract,
    handlesubmittedContract,
  ]);

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



  const handleView = (id) => {
    navigate(`/client/listjobs/${id}`);
  };

  const handleContractView = (id) => {
    navigate(`/client/viewContract/${id}`);
  };

  const handleCloseJob = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${deleteJobApi}?jobId=${id}`
      );
      console.log("Job post closed successfully", response.data);
      setJob(prevJobs => {
        const jobIndex = prevJobs.findIndex(job => job._id === id);
        const updatedJobs = [...prevJobs];
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = response.data;
        } else {
          updatedJobs.push(response.data);
        } 
        return updatedJobs;
      });

    } catch (error) {
      console.error("Error in handleCloseJob:", error.message);
    }
  };

  const handleRepost = async(id)=>{
    const action = 'Repost'
    navigate(`/client/jobForm/${action}/${id}`)
  }

  return (
    <>
      <div className="p-10 min-h-[100vh]">
        <section className="p-1">
          <div className="flex justify-between items-center p-3">
            <nav>
              <ul className="flex">
                <li className="mr-4 font-semibold">
                  <button
                    className={`${
                      activeminTab === "All Job Posts"
                        ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                        : "text-gray-500"
                    } px-2 py-1`}
                    onClick={() => setActiveminTab("All Job Posts")}
                  >
                    All Job Posts
                  </button>
                </li>
                <li className="mr-4 font-semibold">
                  <button
                    className={`${
                      activeminTab === "All Contracts"
                        ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                        : "text-gray-500"
                    } px-2 py-1`}
                    onClick={() => setActiveminTab("All Contracts")}
                  >
                    All Contract Requests
                  </button>
                </li>
                <li className="mr-4 font-semibold">
                  <button
                    className={`${
                      activeminTab === "All submitted Contracts"
                        ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                        : "text-gray-500"
                    } px-2 py-1`}
                    onClick={() => setActiveminTab("All submitted Contracts")}
                  >
                    All submitted Contracts
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <hr className="w-full border-t-1 border-gray-500 mb-12" />
          {activeminTab === "All Job Posts" && (
            <div className="flex justify-between px-12 pb-5">
              <h1 className="text-3xl text-gray-700 font-bold">
                All Job Posts
              </h1>
              <button className="bg-teal-800 text-white px-3 py-2 rounded-xl hover:bg-green-600">
                <Link to={"/client/postJob"}>Post a new job</Link>
              </button>
            </div>
          )}
        </section>
        <div className="w-full mx-auto py-8">
          {activeminTab === "All Job Posts" && (
            <section className="px-10">
              <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
                <input
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                  value={searchQueryJobPosts}
                  onChange={(e) => setSearchQueryJobPosts(e.target.value)}
                  className="px-4 py-2 outline-none w-full rounded-l-xl"
                />
                <FaSearch className="text-gray-500 mx-2" />
              </div>
              {jobs.length > 0 ? (
                <div className="w-full mx-auto py-8">
                  {jobs.map((job) => {

                    return (
                      <div key={job._id}>
                        <div className="flex justify-between items-center p-10 mb-4 bg-white border border-gray-200 rounded-lg shadow-md">
                          <div>
                            <h2
                              className="text-lg font-semibold cursor-pointer"
                              onClick={() => handleView(job._id)}
                            >
                              {job.jobRole}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {timeAgo(job.createdAt)}
                            </p>
                            {job.status !== "Expired" && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <span className="font-semibold">
                                  Expires in:{" "}
                                </span>
                                <JobExpiryCountdown
                                  expiryDate={job.Expirydate}
                                  onExpire={() => handleCloseJob(job._id)}
                                />
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            {job.status === "Expired" ? (
                              <button
                                className="px-3 py-2 text-teal-700 rounded-md hover:bg-teal-600 hover:text-white focus:outline-none"
                                onClick={() => handleRepost(job._id)}
                              >
                                Repost Job
                              </button>
                            ) : (
                              <button
                                className="px-3 py-2 text-red-500 rounded-md hover:bg-red-600 hover:text-white focus:outline-none"
                                onClick={() => handleCloseJob(job._id)}
                              >
                                Close Job Post
                              </button>
                            )}
                          </div>
                        </div>
                        <hr className="my-8 border-gray-300" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center mt-20">
                  <p className="text-start font-semibold text-xl text-orange-400">
                    You don't have any job posts yet
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
        {activeminTab === "All Contracts" && (
          <>
            <section className="px-10">
              {activeminTab === "All Contracts" && (
                <div className="flex justify-between pb-5">
                  <h1 className="text-3xl text-gray-700 font-bold">
                    All Job Contracts
                  </h1>
                </div>
              )}
              <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
                <input
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                  value={searchQueryContracts}
                  onChange={(e) => setSearchQueryContracts(e.target.value)}
                  className="px-4 py-2 outline-none w-full rounded-l-xl"
                />
                <FaSearch className="text-gray-500 mx-2" />
              </div>
              {contracts.length > 0 ? (
                <div className="w-full mx-auto py-8">
                  {contracts.map((contract) => (
                    <div
                      key={contract._id}
                      className="flex justify-between items-center p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-md"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleContractView(contract._id)}
                      >
                        <h2 className="text-lg font-semibold ">
                          {contract?.contractTitle || ""}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {timeAgo(contract?.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center mr-5 space-x-2">
                          {contract?.contractStatus === "pending" ? (
                            <>
                              <FaHourglassHalf className="text-md text-yellow-500" />
                              <span className="text-yellow-500">Pending</span>
                            </>
                          ) : contract?.contractStatus === "completed" ? (
                            <>
                              <FaCheckCircle className="text-md text-green-500" />
                              <span className="text-green-500">completed</span>
                            </>
                          ) : contract?.contractStatus === "dismissed" ? (
                            <>
                              <FaTimesCircle className="text-md text-red-500" />
                              <span className="text-red-500">dismissed</span>
                            </>
                          ) : (
                            <span className="text-gray-700">
                              Unknown Status
                            </span>
                          )}
                        </div>
                        {/* <button className="text-red-500 hover:text-red-600 focus:outline-none">
                          <FaTrashAlt className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center mt-20">
                  <p className="text-start font-semibold text-xl text-orange-400">
                    You don't have any contracts yet
                  </p>
                </div>
              )}
            </section>
          </>
        )}
        {activeminTab === "All submitted Contracts" && (
          <>
            <section className="px-10">
              {activeminTab === "All submitted Contracts" && (
                <div className="flex justify-between pb-5">
                  <h1 className="text-3xl text-gray-700 font-bold">
                    All submitted Contracts
                  </h1>
                </div>
              )}
              <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
                <input
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                  value={submittedContractsearchQuery}
                  onChange={(e) =>
                    setSubmittedContractsearchQuery(e.target.value)
                  }
                  className="px-4 py-2 outline-none w-full rounded-l-xl"
                />
                <FaSearch className="text-gray-500 mx-2" />
              </div>
              {submittedContract.length > 0 ? (
                <div className="w-full mx-auto py-8">
                  {submittedContract.map((contract) => (
                    <div
                      key={contract._id}
                      className="flex justify-between items-center p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-md"
                    >
                      <div
                        className="cursor-pointer"
                         onClick={() => navigate(`/client/viewSubmitted/${contract._id}`)}
                      >
                        <h2 className="text-lg font-semibold ">
                          {contract?.contractId?.contractTitle || ""}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {timeAgo(contract?.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center mr-5 space-x-2">
                          {contract?.status === "pending" ? (
                            <>
                              <FaHourglassHalf className="text-md text-yellow-500" />
                              <span className="text-yellow-500">Pending</span>
                            </>
                          ) : contract?.status === "accept" ? (
                            <>
                              <FaCheckCircle className="text-md text-green-500" />
                              <span className="text-green-500">Accepted</span>
                            </>
                          ) : contract?.status === "rejected" ? (
                            <>
                              <FaTimesCircle className="text-md text-red-500" />
                              <span className="text-red-500">Rejected</span>
                            </>
                          ) : (
                            <span className="text-gray-700">
                              pending
                            </span>
                          )}
                        </div>
                       
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center mt-20">
                  <p className="text-start font-semibold text-xl text-orange-400">
                    You don't have any contracts that submited yet
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
