import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider, StepSeparator } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { Tooltip, Box, Text } from "@chakra-ui/react";
import { FaTrashCan } from "react-icons/fa6";
import { browseOfferletter, createContractApi } from "../../utils/api/api";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { FaPaperclip } from "react-icons/fa";
import { toast } from "react-toastify";

export default function OfferLetter() {
  const navigate = useNavigate();
  const { jobId, proposalId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFile, setisFile] = useState(false);
  const [jobinfo, setJobinfo] = useState("");
  const [proposalInfo, setProposalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => {
    return localStorage.getItem("date") || "";
  });
  const [startdate, setstartDate] = useState(() => {
    return localStorage.getItem("startdate") || "";
  });

  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || "fullPay";
  });
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

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

  const [milestones, setMilestones] = useState(() => {
    const savedMilestones = localStorage.getItem("milestones");
    return savedMilestones
      ? JSON.parse(savedMilestones)
      : [{ name: "", dueDate: "", amount: "" }];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jobId && proposalId) {
          const url = `${browseOfferletter}?jobid=${jobId}&proposalId=${proposalId}`;
          const response = await clientAxiosInstance.get(url);
          if (response.status === 200) {
            setJobinfo(response.data.jobInfo);
            setProposalInfo(response.data.proposalInfo);
          } else {
            console.error("Failed to fetch offer letter details");
          }
        } else {
          console.error("jobId or proposalId is undefined");
        }
      } catch (error) {
        console.error(error, "error in fetching offerletter details");
      }
    };
    fetchData();
  }, [jobId, proposalId]);

  useEffect(() => {
    localStorage.setItem("date", date);
  }, [date]);
  useEffect(() => {
    localStorage.setItem("startdate", startdate);
  }, [startdate]);

  useEffect(() => {
    localStorage.setItem("milestones", JSON.stringify(milestones));
    localStorage.setItem("selectedOption", selectedOption);
  }, [milestones, selectedOption]);

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleMilestoneDelete = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", dueDate: "", amount: "" }]);
  };

  const handledate = (e) => {
    setDate(e.target.value);
  };
  const handleStartdate = (e) => {
    setstartDate(e.target.value);
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

    if (jobinfo?.budgetType === "fixed") {
      if (selectedOption === "milestones" && milestones.length === 0) {
        newErrors.milestones = "Please add at least one milestone.";
      }
      if (selectedOption === "fullPay" && (!date || date < currentDate)) {
        newErrors.date = "Please select a valid due date.";
      }
      if (selectedOption === "milestones") {
        let totalAmount = 0;
        for (let milestone of milestones) {
          if (
            !milestone.name ||
            !milestone.dueDate ||
            !milestone.amount ||
            milestone.dueDate < currentDate
          )  {
            newErrors.milestones =
              "Please fill all milestone details and ensure dates are not in the past.";
            break;
          }
          totalAmount += Number(milestone.amount);
        }
        if (totalAmount !== proposalInfo?.bidAmount) {
          newErrors.milestones = `Total milestone amount must be equal to ${proposalInfo?.bidAmount}. Current total: ${totalAmount}`;
        }
      }
    } else if (jobinfo?.budgetType === "hourly") {
      if (!startdate || startdate < currentDate) {
        newErrors.startdate = "Please select a valid start date.";
      }
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Please select a file.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
  
    const formData = new FormData();
    formData.append('userId', proposalInfo?.freelancerId?._id);
    formData.append('proposalId', proposalId);
    formData.append('contractTitle', jobinfo?.jobRole);
    formData.append('jobId', jobId);
    formData.append('budgetType', jobinfo?.budgetType);
    formData.append('contractAmount', proposalInfo?.bidAmount);
    formData.append('hoursOfWork', proposalInfo?.duration);

  
    if (jobinfo?.budgetType === "fixed") {
      formData.append('paymentOption', selectedOption);
      if (selectedOption === "fullPay") {
        formData.append('contractDueDate', date);
      } else if (selectedOption === "milestones") {
        formData.append('milestones', JSON.stringify(milestones));
      }
    } else if (jobinfo?.budgetType === "hourly") {
      formData.append('projectStartDate', startdate);
    }
  
    if (selectedFile) {
      formData.append('projectFile', selectedFile);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
     
      const response = await clientAxiosInstance.post(createContractApi, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if(response.status === 200){
        const contract = response.data.contract
        toast.success(response.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        })
        setTimeout(()=>{
          const url = `/client/hire/${jobId}/${proposalId}/${contract._id}`
          navigate(url)
        },2000)
      }else {
        toast.error("error", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.error("Error submitting job:", error);
      throw new Error("Error submitting job. Please try again.");
    } finally {
      setLoading(false);
      setSelectedOption("fullPay");
      setDate("");
      setSelectedFile('')
      localStorage.removeItem("milestones");
      localStorage.removeItem("selectedOption");
      localStorage.removeItem("date");
      localStorage.removeItem("startdate");
      setMilestones([{ name: "", dueDate: "", amount: "" }]);
    }
  };
  

  return (
    <>
      <div className="p-10">
        <div className="flex font-semibold text-5xl m-10 mb-5 text-teal-600">
          Send an offer
        </div>

        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-8/12 pr-10">
            <div className="text-3xl font-semibold mb-5">Contract terms</div>
            <section className="p-1">
              <div className="m-5">
                <div className="flex items-center text-teal-700 text-xl">
                  <span className="font-semibold">Payment option</span>
                  <Tooltip
                    label={
                      <Box width="250px">
                        <Text fontWeight="semibold" fontSize="lg" mb="2">
                          When will I be charged?
                        </Text>
                        <Text fontSize="md">
                          Over the course of the contract, your talent will
                          submit milestones for review and the funds in QW
                          Wallet will be released upon your approval. Failing to
                          respond to a milestone submission within 14 days is
                          deemed approval and the QW Wallet funds will be
                          automatically released to your talent.
                        </Text>
                      </Box>
                    }
                    placement="top"
                    hasArrow
                    bg="gray.100"
                    color="teal"
                    p="2"
                    borderRadius="md"
                    fontSize="md"
                    sx={{ boxShadow: "md" }}
                  >
                    <span className="text-2xl">
                      <RxQuestionMarkCircled
                        className="ml-2"
                        color="teal.900"
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
              <div className="m-5">
                <div className="my-3">
                  <span className="text-md">
                    {jobinfo?.budgetType === "fixed"
                      ? "Fixed price"
                      : "Hourly rate"}
                  </span>
                </div>

                <div className="flex items-center  mb-1">
                  <MdCurrencyRupee />
                  <span className="ml-1 text-xl">
                    {proposalInfo?.bidAmount || ""}
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-md">
                    estimate time :{proposalInfo?.duration || ""}
                  </span>
                </div>
              </div>
              <Divider className="my-4" />
              {jobinfo?.budgetType === "fixed" ? (
                <div>
                  <div className="m-5">
                    <span className="font-semibold text-teal-700 text-xl">
                      Deposit fund in QW Wallet
                    </span>
                    <div className="flex justify-start my-5">
                      <div className="flex items-center font-semibold">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="fullPay"
                          checked={selectedOption === "fullPay"}
                          onChange={() => setSelectedOption("fullPay")}
                          className="mr-2"
                        />
                        <label className="flex items-center mr-10">
                          Deposit <MdCurrencyRupee className="ml-1" />{" "}
                          {proposalInfo?.bidAmount || ""} for the whole Project
                        </label>
                      </div>
                      <div className="flex items-center font-semibold">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="milestones"
                          checked={selectedOption === "milestones"}
                          onChange={() => setSelectedOption("milestones")}
                          className="mr-2"
                        />
                        <label>
                          Deposit a lesser amount to cover the first milestone
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="m-5">
                    {selectedOption === "fullPay" && (
                      <div className="mb-5">
                        <label className="block mb-2 font-medium">
                          Select Due Date:
                        </label>
                        <input
                          type="date"
                          className="border p-2 rounded-md w-1/2"
                          value={date}
                          onChange={(e) => handledate(e)}
                        />
                        {errors.date && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.date}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOption === "milestones" && (
                      <div className="mb-5">
                        {milestones.map((milestone, index) => (
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
                                  onChange={(e) =>
                                    handleMilestoneChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="border p-2 rounded-md w-full"
                                />
                                {errors.milestones && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors.milestones}
                                  </div>
                                )}
                              </div>
                              <div className="mb-2 px-2 w-1/3">
                                <label className="flex mb-1 font-medium">
                                  Due Date:
                                </label>
                                <input
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) =>
                                    handleMilestoneChange(
                                      index,
                                      "dueDate",
                                      e.target.value
                                    )
                                  }
                                  className="border p-2 rounded-md w-full"
                                />
                              </div>
                              <div className="mb-2 px-2 w-1/3">
                                <label className="flex mb-1 font-medium">
                                  Amount:
                                </label>
                                <input
                                  type="number"
                                  value={milestone.amount}
                                  onChange={(e) =>
                                    handleMilestoneChange(
                                      index,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                  className="border p-2 rounded-md w-full"
                                />
                              </div>
                            </div>
                            <div className="ml-2">
                              <FaTrashCan
                                className="text-red-500 cursor-pointer mt-3"
                                onClick={() => handleMilestoneDelete(index)}
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addMilestone}
                          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                        >
                          Add Milestone
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="m-5">
                    <div className="flex items-center mb-5 text-teal-700 text-xl">
                      <span className="font-semibold">
                        Deposit funds into QW wallet
                      </span>
                    </div>
                    <h2 className="font-sans text-md mb-3">Pay by the hour</h2>
                    <div className="flex items-center  mb-1">
                      <MdCurrencyRupee />
                      <span className="ml-1 text-md">
                        {`${proposalInfo?.bidAmount} /hr` || ""}
                      </span>
                    </div>
                  </div>
                  {/* <div className="m-5">
                    <h2 className="font-sans  text-md mb-3">
                    Weekly Limit
                    </h2>
                    <div className="flex items-center  mb-1">
                      <MdCurrencyRupee />
                      <span className="ml-1 text-md">
                        {`${proposalInfo?.bidAmount} /hr` || ""}
                      </span>
                    </div>
                </div> */}
                  <div className="m-5">
                    <div className="mb-5">
                      <label className="block mb-2 font-medium">
                        Select start Date:
                      </label>
                      <input
                        type="date"
                        className="border p-2 rounded-md w-1/2"
                        value={startdate}
                        onChange={(e) => handleStartdate(e)}
                      />
                      {errors.startdate && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.startdate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Divider className="my-4" />

              <div className="m-5">
                <h2 className="font-sans font-semibold  mb-3 text-teal-700 text-xl">
                  Work discription
                </h2>
                <div className="flex flex-wrap">
                  <span className="font-sans text-md font-semibold rounded-md mr-4 my-2">
                    {jobinfo?.jobRole || "developer"}
                  </span>
                  <span className="font-sans text-md py-2 rounded-md mr-4 mb-4">
                    {jobinfo?.description || ""}
                  </span>
                </div>
              </div>
              <div className="m-5">
                <h2 className="font-sans font-semibold text-md mb-3">
                  Skills and Expertise
                </h2>
                <div className="flex flex-wrap">
                  {jobinfo?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="m-5">
                {isFile && (
                  <span className="my-2 text-green-500 font-semibold">
                    file uploaded successFullly....
                  </span>
                )}
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
              </div>
            </section>
          </div>
          <div className="">
            <Divider
              orientation="vertical"
              className="h-full bg-gray-200"
              style={{ width: "2px" }}
            />
          </div>

          <div className="w-4/12 mx-5">
            <div className="mx-4">
              <div className="p-5 border rounded-lg shadow-lg w-full">
                <div className="flex items-center mb-4">
                  <img
                    src={
                      proposalInfo?.freelancerId?.profile?.location ||
                      proposalInfo?.freelancerId?.name ||
                      ""
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="ml-8">
                    <h2 className="text-lg text-teal-600 font-bold">
                      {proposalInfo?.freelancerId?.name}
                    </h2>
                    <p className="text-sm text-teal-600">
                      {proposalInfo?.freelancerId?.jobTitle}
                    </p>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {proposalInfo?.freelancerId?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p>{proposalInfo?.freelancerId?.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" px-20 flex justify-between">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 ${
              loading ? "bg-gray-300" : "bg-teal-500"
            } text-white border rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-pulse rounded-full h-3 w-3 bg-teal-500 mr-2"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
