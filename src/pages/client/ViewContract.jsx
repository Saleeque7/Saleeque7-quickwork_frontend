import { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/react";
import { CiEdit } from "react-icons/ci";
import { Divider } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { getContractDetails } from "../../utils/api/api";
import { useParams } from "react-router-dom";
import Rating from "../../components/uic/Rating";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ViewContract() {
  const [contract, setContract] = useState({});
  const { id } = useParams();
  const userReviews = [2, 3, 4];
  useEffect(() => {
    const fetchContractDetals = async () => {
      try {
        const response = await clientAxiosInstance.get(
          `${getContractDetails}?id=${id}`
        );
        if (response.data) {
          setContract(response.data);
        }
      } catch (error) {
        console.error(error, "error in fetching offerletter details");
      }
    };
    fetchContractDetals();
  }, [id]);

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
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };


  return (
    <>
      <div className="flex justify-between items-center">
        <div className="mt-4 pt-10 pl-28">
          <span className="text-teal-700 text-3xl">
            {contract.contractTitle || "No Contract Available"}
          </span>
        </div>
        {/* <div className="mt-4 pt-10 pr-32">
          <Tooltip label="Edit" placement="bottom">
            <span>
              <CiEdit className="w-6 h-6 text-gray-500 cursor-pointer" />
            </span>
          </Tooltip>
        </div> */}
      </div>
      <div className="flex justify-center mt-4">
        <hr className="w-full mx-16 bg-black" style={{ height: "1px" }} />
      </div>

      <div className="px-10 pt-10">
        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-full pr-10">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold mb-5">Contract details</div>
              <div className="flex items-center space-x-2">
                {contract?.contractStatus === "pending"? (
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
                  <span className="text-gray-700">Unknown Status</span>
                )}
              </div>
            </div>
            <div className="m-5">
              <span className="text-teal-700 text-md">
                {contract?.contractTitle || "Node.js Developer"}
              </span>
            </div>

            <section className="p-1">
              <div className="flex mx-5">
                <span className="ml-2">
                  {timeAgo(contract.createdAt) || ""}
                </span>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <p>{contract?.jobId?.description || ""}</p>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <div className="flex items-center mb-2">
                  <MdCurrencyRupee />
                  {contract?.contractAmount}
                </div>
                <div>
                  <span className="text-md">
                    {contract?.budgetType === "fixed"
                      ? "Fixed price"
                      : "Hourly rate"}
                  </span>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="m-5">
                {contract?.paymentOption === "fullPay" ? (
                  <div>
                    Contract duedate:{" "}
                    <span className="text-md font-semibold">
                      {formatDate(contract?.contractDueDate) || ""}
                    </span>
                  </div>
                ) : (
                  <div className="mb-5">
                    {/* {contract?.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-4 p-4 border rounded-md"
                      >
                        <div className="flex flex-wrap w-full">
                          <div className="mb-2 px-2 w-1/3">
                            <label className="flex mb-1 font-medium">
                              Milestone Name:
                            </label>
                            <input
                              type="text"
                              value={milestone.name}
                              className="border p-2 rounded-md w-full"
                              readOnly
                            />
                          </div>
                          <div className="mb-2 px-2 w-1/3">
                            <label className="flex mb-1 font-medium">
                              Due Date:
                            </label>
                            <input
                              type="date"
                              value={formatDate(milestone.dueDate)}
                              className="border p-2 rounded-md w-full"
                              readOnly
                            />
                          </div>
                          <div className="mb-2 px-2 w-1/3">
                            <label className="flex mb-1 font-medium">
                              Amount:
                            </label>
                            <input
                              type="number"
                              value={milestone.amount}
                              className="border p-2 rounded-md w-full"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    ))} */}
                  </div>
                )}
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <h2 className="font-sans font-semibold text-md mb-3">
                  Skills and Expertise
                </h2>
                <div className="flex flex-wrap">
                  {contract?.jobId?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="px-10">
        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-7/12 pr-10">
            <div className="text-xl font-semibold mb-5">Job details</div>
            <div className="m-5">
              <span className="text-teal-700 text-md">
                {contract?.contractTitle || "Node.js Developer"}
              </span>
            </div>

            <section className="p-1">
              <div className="flex mx-5">
                Posted:
                <span className="ml-2">
                  {timeAgo(contract?.jobId?.createdAt) || ""}
                </span>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <p>{contract?.jobId?.description || ""}</p>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <h2 className="font-sans font-semibold text-md mb-3">
                  Skills and Expertise
                </h2>
                <div className="flex flex-wrap">
                  {contract?.jobId?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="w-1/12">
            <Divider
              orientation="vertical"
              className="h-full bg-gray-200"
              style={{ width: "2px" }}
            />
          </div>

          <div className="w-4/12 ">
            <div className="text-xl font-semibold mb-5">Talent Info</div>
            <div className="m-5">
              <div className="flex items-center mb-4">
                <img
                  src={
                    contract?.userSide?.userId?.profile?.location ||
                    contract?.userSide?.userId?.name ||
                    ""
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-8">
                  <h2 className="text-lg text-teal-600 font-bold">
                    {contract?.userSide?.userId?.name || ""}
                  </h2>
                  <p className="text-sm text-teal-600">
                    {contract?.userSide?.userId?.jobTitle || ""}
                  </p>
                </div>
              </div>
              <div>
                <p>{contract?.userSide?.userId?.overview || ""}</p>
              </div>
              <div className="my-5">
                <h2 className="font-sans font-semibold text-md mb-3">Skills</h2>
                <div className="flex flex-wrap">
                  {contract?.userSide?.userId?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center mr-10 mt-5 text-gray-500">
                <Rating layout="ClientJobProfile" reviews={userReviews} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
