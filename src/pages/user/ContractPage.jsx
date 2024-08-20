import { useEffect, useState } from "react";
import { Divider } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { browseContractDetails, ContractActionApi } from "../../utils/api/api";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../../components/uic/Rating";
import { FaCheckCircle, FaTimesCircle , FaHourglassHalf  } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";

export default function ViewContract() {
  const [contract, setContract] = useState({});
  const { id } = useParams();
  const userReviews = [2, 3, 4];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetals = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${browseContractDetails}?id=${id}`
        );
        console.log(response.data);
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

  const handleContractAction = async (id, action) => {
    console.log(action, "action");
    try {
      const response = await userAxiosInstance.patch(`${ContractActionApi}`, {
        id,
        action,
      });
      if (response.status === 200) {
        toast.success("success", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setContract(response.data);
        setTimeout(() => {
          navigate("/user/workList");
        }, 2000);
      } else {
        throw new Error("Failed to update contract status");
      }
    } catch (error) {
      console.error("Error updating contract status:", error);
    }
  };
  return (
    <>
      <div className="flex justify-start items-center">
        <div className="mt-4 pt-10 pl-28">
          <span className="text-teal-700 text-3xl">
            {contract.contractTitle || "No Contract Available"}
          </span>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <hr className="w-full mx-16 bg-black" style={{ height: "1px" }} />
      </div>

      <div className="px-10 pt-10">
        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-full pr-10">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold mb-5">Contract details</div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Proposal status</span>
                  {contract?.proposalId?.status === "accepted" ? (
                    <>
                      <FaCheckCircle className="text-md text-green-500" />
                      <span className="text-green-500">accepted</span>
                    </>
                  ) : contract?.proposalId?.status === "rejected" ? (
                    <>
                      <FaTimesCircle className="text-md text-red-500" />
                      <span className="text-red-500">rejected</span>
                    </>
                  ) : (
                    <span className="text-gray-700">pending</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Contract status</span>
                  {contract?.userSide?.status === "pending" ? (
                  <>
                    <FaHourglassHalf className="text-md text-yellow-500" />
                    <span className="text-yellow-500">Pending</span>
                  </>
                ) : contract?.userSide?.status === "accepted" ? (
                  <>
                    <FaCheckCircle className="text-md text-green-500" />
                    <span className="text-green-500">Accepted</span>
                  </>
                ) : contract?.userSide?.status === "rejected" ? (
                  <>
                    <FaTimesCircle className="text-md text-red-500" />
                    <span className="text-red-500">Rejected</span>
                  </>
                ) : (
                  <span className="text-gray-700">Unknown Status</span>
                )}
                </div>
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
              <div className="flex justify-between">
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

                {contract?.userSide?.status === "pending" && (
                  <div className="m-5 p-6 flex space-x-8">
                    <button
                      onClick={() =>
                        handleContractAction(contract._id, "accepted")
                      }
                      className="px-4  bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleContractAction(contract._id, "rejected")
                      }
                      className="px-4  bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
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
            <div className="text-xl font-semibold mb-5">Company Info</div>
            <div className="m-5">
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-lg text-teal-600 font-bold">
                    {contract?.clientSide?.clientId?.email || ""}
                  </h2>
                  <p className="text-sm text-teal-600">
                    {contract?.clientSide?.clientId?.Address?.address || ""}{" "}
                    <br />
                    {contract?.clientSide?.clientId?.Address?.city || ""},
                    {contract?.clientSide?.clientId?.Address?.state || ""}{" "}
                    <br />
                    {contract?.clientSide?.clientId?.Address?.postalCode || ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center mr-10 mt-5 text-gray-500">
                <MdVerified className="text-green-600 text-xl mr-1" />
                <span>Payment verified</span>
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
