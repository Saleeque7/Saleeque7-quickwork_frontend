
import { Divider,Tooltip, Button } from "@chakra-ui/react";
import { MdCurrencyRupee, MdVerified, MdSaveAlt } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "../../components/uic/Rating";
import { HiLocationMarker } from "react-icons/hi";
import { useEffect, useState } from "react";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { browseJobpost , saveJobApi , unsaveJobApi ,userProfileApi } from "../../utils/api/api";
import { BsFillSave2Fill } from "react-icons/bs";
import { setUser } from "../../utils/Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";


export default function ClientJobProfile() {
  const user = useSelector((state) => state.persisted.user.user);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJob] = useState("");
  const [jobcount, setJobCount] = useState("");
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
  const { id } = useParams();
  const navigate = useNavigate();
const dispatch = useDispatch()

useEffect(()=>{
  const fetchUser = async()=>{
    const res = await userAxiosInstance.get(userProfileApi)
    if(res.data){
      dispatch(setUser(res.data))
    }
  }
  fetchUser()
},[])

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${browseJobpost}?id=${id}`
        );
        setJob(response.data.job);
        setJobCount(response.data.jobPostCount);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      }
    };

    fetchJobData();
  }, [id]);


  const handleSaveJob = async (jobId) => {
    try {
      const res = await userAxiosInstance.post(saveJobApi, { jobId });
      if (res.data) {
        dispatch(setUser(res.data));
        const savedJobIds = getSavedJobIds();
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
          prevSavedJobs.filter((job) => !savedJobIds.includes(job._id))
        );
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };
  const getSavedJobIds = () => {
    return user.savedJobs.map((job) => job.job);
  };

  const userReviews = [2, 3, 4];
  const savedJobIds = user.savedJobs.map((job) => job.job);
  const appliedJobIds = user.applications.map((job) => job.jobId);

  return (
    <>
      <div className="px-10 py-8 ">
      <div className="px-10 py-5">
        <span
          onClick={() => {
            navigate(-1);
          }}
          className="hover:underline text-teal-600 cursor-pointer"
        >
          Back to Home
        </span>
      </div>
        <div className="flex justify-between  border-2 rounded-md ">
          <div className="w-2/3 py-8 mr-16 my-10 px-10">
            <div className="flex justify-start items-center ">
              <div className="px-5 mb-10">
                <span className="text-teal-700 text-5xl ">
                  {jobs?.jobRole ? jobs.jobRole : "node.js developer"}
                </span>
              </div>
            </div>
            <section className="p-1">
              <div className="flex m-5">
                posted
                <span className="ml-2">
                  {jobs?.createdAt ? timeAgo(jobs.createdAt) : ""}
                </span>
              </div>
              <Divider p={2} color={"gray.500"} opacity={1}></Divider>
              <div className="flex m-5">
                <p>{jobs?.description ? jobs.description : ""}</p>
              </div>
              <Divider p={2} color={"gray.500"} opacity={1}></Divider>
              <div className="m-5">
                <div className="flex items-center">
                  <MdCurrencyRupee />
                  {jobs?.budgetType === "fixed" && (
                    <span>{jobs?.budget ? jobs.budget : ""}</span>
                  )}
                  {jobs?.budgetType === "hourly" && (
                    <span>
                      {jobs?.wageRangeMin
                        ? `${jobs?.wageRangeMin} to ${jobs?.wageRangeMax}`
                        : ""}
                    </span>
                  )}
                </div>
                <div>
                  <span>
                    {jobs?.budgetType === "fixed"
                      ? `${jobs.budgetType} price`
                      : `${jobs.budgetType} rate`}
                  </span>
                </div>
              </div>
              <Divider p={2} color={"gray.500"} opacity={1}></Divider>
              <div className="flex m-5">
                Project type:
                <span className="ml-2 font-bold text-gray-500">
                  {jobs?.projectTerm ? jobs.projectTerm : ""}
                </span>
              </div>
              <Divider width={"auto"} color={"gray.500"} opacity={1}></Divider>
              <div className="flex m-5">
                <h2 className="font-sans font-semibold text-md mb-3">
                  Skills and Expertise
                </h2>
              </div>
              <div className="flex flex-wrap m-5">
                {jobs &&
                  jobs.skills &&
                  jobs.skills.length > 0 &&
                  jobs.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
              <Divider p={2} color={"gray.500"} opacity={1}></Divider>
              <div className="flex m-5">
                Proposals:
                <span className="ml-2">
                  {jobs?.proposalCount ? jobs.proposalCount : 0}
                </span>
              </div>
            </section>
          </div>

          <Divider
            orientation="vertical"
            height="auto"
            borderColor="gray.300"
            opacity={1}
          />
          <div className="w-1/3 p-20">
            <div className="pb-10">
              <div className="flex justify-center">
               {appliedJobIds.includes(jobs._id) ? 
              
                (
                  <Tooltip label="Job is already applied" aria-label="Job is already applied" placement="top">
                  <button
                    className="w-80 mr-10 my-3 border-1 border-green-500 px-16 py-2 items-center rounded-xl font-semibold bg-green-600 text-white"
                  >
                    Applied
                  </button>
                </Tooltip>
                )
                :
                ( <button
                  className="w-80 mr-10 my-3 border-1 border-teal-500 px-16 py-2 items-center rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-500"
                  onClick={() => {
                    navigate(`/user/applyNow/${jobs._id}`);
                  }}
                >
                  Apply now
                </button>)}
              </div>
              <div className="flex justify-center">
                {!savedJobIds.includes(jobs._id) ? 
                (
                  <button className="w-80 mr-10 my-3 border-2 px-16 py-2 flex items-center justify-center rounded-xl text-teal-700 font-semibold border-teal-600 hover:bg-gray-100"
                  onClick={()=>handleSaveJob(jobs._id)}>
                    <MdSaveAlt className="mr-2 text-xl text-teal-700" />
                    Save Job
                  </button>
                ) 
                : 
                (
                  <button className="w-80 mr-10 my-3 bg-green-700 px-16 py-2 flex items-center justify-center rounded-xl text-white font-semibold hover:bg-green-500"
                  onClick={()=>handleUnSaveJob(jobs._id)}>
                    <BsFillSave2Fill className="mr-2 text-lg text-white-700" />
                    Saved
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="mr-10 my-3 font-bold text-3xl text-gray-500">
                About the Client
              </div>
            </div>
            <div className="flex items-center mr-10 mt-5 text-gray-500">
              <MdVerified className="text-green-600 text-xl mr-1" />
              <span>Payment verified</span>
            </div>
            <div className="flex items-center mr-10 mt-5 text-gray-500">
              <Rating layout="ClientJobProfile" reviews={userReviews} />
            </div>
            <div className="flex items-center mr-10 mt-5">
              <HiLocationMarker className="text-teal-500 w-4 h-6" />
              <span className="ml-2 mr-6 text-gray-500 text-sm">Mumbai</span>
            </div>
            <div className="flex items-center mr-10 mt-5 text-gray-500">
              <span className="font-semibold">
                {" "}
                {jobcount ? jobcount : 0} Jobs Posted
              </span>
            </div>
            <div className="flex items-center mr-10 mt-5 text-gray-500">
              <span className="font-semibold"> ₹ 12000 total spent</span>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
}
