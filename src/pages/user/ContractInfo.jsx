import { useEffect, useState, useRef } from "react";
import { Divider } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import {
  browseContractDetails,
  ContractActionApi,
  submitjobapi,
  quitContractApi,
} from "../../utils/api/api";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../../components/uic/Rating";
import { FaCheckCircle, FaPaperclip, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import QuitContractModal from "../../components/user/QuitContractModal";

export default function ContractInfo() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [contract, setContract] = useState("");
  const { id } = useParams();
  const userReviews = [2, 3, 4];
  const navigate = useNavigate();
  const [isFile, setisFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [overview, setOverview] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const newErrors = {};
    if (file) {
      if (validateFileType(file)) {
        setTimeout(() => {
          setisFile(false);
        }, 2000);
        setisFile(true);
        setSelectedFile(file);
      } else {
        newErrors.selectedFile =
          "Unsupported file type. Please select a .doc, .pdf, or Google Sheets file.";
      }
    }
    setErrors(newErrors);
  };
  const validateFileType = (file) => {
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.google-apps.spreadsheet",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const [fileUrl, setFileUrl] = useState(null);
  useEffect(() => {
    if (contract?.projectFile?.location) {
      const file = contract.projectFile.location;

      if (file instanceof Blob || file instanceof File) {
        const url = URL.createObjectURL(file);
        setFileUrl(url);

        return () => URL.revokeObjectURL(url);
      } else if (typeof file === "string") {
        setFileUrl(file);
      }
    }
  }, [contract]);

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

  const handleOverviewChange = (event) => {
    setOverview(event.target.value);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      const formData = new FormData();
      formData.append("clientId", contract?.clientSide?.clientId?._id);
      formData.append("contractId", contract?._id);
      formData.append("jobId", contract?.jobId?._id);
      formData.append("completionDate", date);
      formData.append("overview", overview);

      if (selectedFile) {
        formData.append("projectFile", selectedFile);
      }
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await userAxiosInstance.post(submitjobapi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success("success", {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate("/user/workList");
          }, 1500);
        }
      } catch (error) {
        console.error("Error submitting job:", error);
        throw new Error("Error submitting job. Please try again.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 3000);

    return () => clearTimeout(timer);
  }, [errors]);

  const validateForm = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const newErrors = {};

    if (!selectedFile) {
      newErrors.selectedFile = "Please select a file.";
    }
    if (!overview) {
      newErrors.overview = "please fill the field";
    }
    if (overview.trim() === "") {
      newErrors.overview = "please fill the field";
    }
    if (!date || date < currentDate) {
      newErrors.date = "Please select a valid due date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   const handleRatingSubmit = (rating) => {
  //     console.log("Rating submitted:", rating);
  //   };

  //   const handleSubmit = async () => {
  //     if (!validateForm()) return;
  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append('userId', proposalInfo?.freelancerId?._id);
  //     formData.append('proposalId', proposalId);
  //     formData.append('contractTitle', jobinfo?.jobRole);
  //     formData.append('jobId', jobId);
  //     formData.append('budgetType', jobinfo?.budgetType);
  //     formData.append('contractAmount', proposalInfo?.bidAmount);
  //     formData.append('hoursOfWork', proposalInfo?.duration);

  //     if (jobinfo?.budgetType === "fixed") {
  //       formData.append('paymentOption', selectedOption);
  //       if (selectedOption === "fullPay") {
  //         formData.append('contractDueDate', date);
  //       } else if (selectedOption === "milestones") {
  //         formData.append('milestones', JSON.stringify(milestones));
  //       }
  //     } else if (jobinfo?.budgetType === "hourly") {
  //       formData.append('projectStartDate', startdate);
  //     }

  //     if (selectedFile) {
  //       formData.append('projectFile', selectedFile);
  //     }
  //     for (let [key, value] of formData.entries()) {
  //       console.log(key, value);
  //     }
  //     try {

  //       const response = await clientAxiosInstance.post(createContractApi, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       if(response.status === 200){
  //         const contract = response.data.contract
  //         toast.success(response.data.message, {
  //           autoClose: 1000,
  //           closeButton: true,
  //           draggable: true,
  //         })
  //         setTimeout(()=>{
  //           const url = `/client/hire/${jobId}/${proposalId}/${contract._id}`
  //           navigate(url)
  //         },2000)
  //       }else {
  //         toast.error("error", {
  //           autoClose: 1000,
  //           closeButton: true,
  //           draggable: true,
  //         });
  //       }

  //     } catch (error) {
  //       console.error("Error submitting job:", error);
  //       throw new Error("Error submitting job. Please try again.");
  //     } finally {
  //       setLoading(false);
  //       setSelectedOption("fullPay");
  //       setDate("");
  //       setSelectedFile('')
  //       localStorage.removeItem("milestones");
  //       localStorage.removeItem("selectedOption");
  //       localStorage.removeItem("date");
  //       localStorage.removeItem("startdate");
  //       setMilestones([{ name: "", dueDate: "", amount: "" }]);
  //     }
  //   };

  const handleContractAction = async (id, reason) => {
    try {
      const response = await userAxiosInstance.post(`${quitContractApi}`, {
        id,
      });
      if (response.status === 200) {
        toast.success("success", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setContract(response.data);
        setTimeout(() => {
          navigate(`/user/rating/${contract?.jobId?._id}`);
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
              <div className="flex items-center space-x-2">
                {contract?.userSide?.status === "completed" && (
                  <>
                    <FaCheck className="text-md text-green-500" />
                    <span className="text-green-500">completed</span>
                  </>
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

                {contract?.userSide?.status === "accepted" &&
                  contract?.userSide?.status !== "completed" &&
                  contract?.userSide?.status !== "submitted" &&
                  contract?.contractStatus !== "completed" &&
                  contract?.contractStatus !== "dismissed" && (
                    <div className="m-5 p-6 flex space-x-8">
                      <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Quit Contract
                      </button>
                    </div>
                  )}
              </div>
              <Divider className="my-4" />
              <div className="m-5">
                {fileUrl && (
                  <>
                    <span className="font-semibold ">
                      Download the work link
                    </span>
                    <div className="my-2">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700"
                        download
                      >
                        Download
                      </a>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      {contract?.userSide?.status !== "completed" && (
        <div className="px-10">
          <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
            <div className="w-full pr-10">
              <div className="text-xl font-semibold mb-5">
                Work progression And submission
              </div>
              <div className="m-5">
                <span className="text-teal-700 text-md">
                  {contract?.contractTitle || "Node.js Developer"}
                </span>
              </div>
              <div className="m-5 font-medium">
                Contract Duedate
                <span className="text-teal-700 text-md ml-4">
                  {formatDate(contract?.contractDueDate) || ""}
                </span>
              </div>

              <section className="p-1">
                <div className="m-5">
                  <div className="mb-5">
                    <label className="block mb-2 font-medium">
                      completion date
                    </label>
                    <input
                      type="date"
                      className="border p-2 rounded-md w-1/2"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    {errors.date && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.date}
                      </div>
                    )}
                  </div>
                </div>
                <div className="m-5">
                  {isFile && (
                    <span className="my-2 text-green-500 font-semibold">
                      file uploaded successFullly....
                    </span>
                  )}
                  <h1 className="font-semibold py-2">Submit you work file</h1>
                  <button
                    className="bg-teal-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-teal-900"
                    onClick={handleButtonClick}
                  >
                    <FaPaperclip className="mr-2" />
                    Attach File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".doc,.pdf,.xls,.xlsx,application/msword,application/pdf,application/vnd.google-apps.spreadsheet"
                    onChange={handleFileChange}
                  />
                  {errors.selectedFile && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.selectedFile}
                    </div>
                  )}
                  {selectedFile && (
                    <div className="mt-3">
                      <p className="font-semibold">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        File size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <div className="flex mt-2">
                        <button
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md mr-2 hover:bg-gray-400"
                          onClick={handleRemoveFile}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="mt-5">
                    <h2 className="font-semibold py-2">talk about project</h2>
                    <textarea
                      value={overview}
                      onChange={handleOverviewChange}
                      placeholder="Provide an overview of your work here..."
                      className="w-full p-2 border border-gray-300 rounded-md resize-none"
                      rows="4"
                    />
                    {errors.overview && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.overview}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end mx-10">
                  {contract?.contractStatus === "dismissed" ? (
                    <div className="text-red-500 font-bold">
                      Contract Dismissed
                    </div>
                  ) : contract?.userSide?.status !== "completed" &&
                    contract?.userSide?.status !== "submitted" &&
                    contract?.contractStatus !== "completed" &&
                    contract?.contractStatus !== "dismissed" ? (
                    <button
                      className="border-2 px-6 py-2 rounded-md bg-teal-700 text-white hover:bg-teal-500"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  ) : (
                    <button className="border-2 px-6 py-2 rounded-md">
                      Already Done
                    </button>
                  )}
                </div>
              </section>
              <QuitContractModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={(reason) =>
                  handleContractAction(contract._id, reason)
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
