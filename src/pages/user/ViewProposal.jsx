import { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { viewjobProposalapi , editJobProposalApi } from "../../utils/api/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { format } from "timeago.js";
import {
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

export default function ViewProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState([]);
  const [rate, setRate] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [profit, setProfit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${viewjobProposalapi}?id=${id}`
        );
        setProposal(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error in fetching proposal info", error);
      }
    };

    if (id !== null) fetchProposal();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      setErrors({});
    }, 2000);
  }, [errors]);

  const setUserrate = (rate) => {
    const ser = (rate * 10) / 100;
    const pro = rate - ser;
    setRate(rate);
    setServiceFee(ser);
    setProfit(pro);
  };

  useEffect(() => {
    if (proposal[0]?.bidAmount) {
      setUserrate(proposal[0].bidAmount);
    }
  }, [proposal[0]?.bidAmount]);

  const openModal = (item) => {
    setFormData({
      coverLetter: item.coverLetter,
      bidAmount: item.bidAmount,
      duration: item.duration,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const validateForm = () => {
    const trimmedFormData = {
      coverLetter: formData.coverLetter.trim(),
      bidAmount: formData.bidAmount,
      duration: formData.duration.trim(),
    };

    const newErrors = {};

    if (!trimmedFormData.coverLetter) {
      newErrors.coverLetter = "Cover Letter cannot be empty.";
    }
    if (!trimmedFormData.bidAmount) {
      newErrors.bidAmount = "Bid Amount cannot be empty.";
    }
    if (!trimmedFormData.duration) {
      newErrors.duration = "Duration cannot be empty.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const trimmedFormData = {
      coverLetter: formData.coverLetter.trim(),
      bidAmount: formData.bidAmount,
      duration: formData.duration.trim(),
    };

    const proposalId = proposal[0]?._id;

    try {
      const response = await userAxiosInstance.put(
        `${editJobProposalApi}?id=${proposalId}`,
        trimmedFormData
      );
      toast.success("Proposal updated successfully!", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
      setProposal((prevProposals) =>
        prevProposals.map((prop) =>
            prop._id === proposalId ? { ...prop, ...trimmedFormData } : prop
        )
    );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Error updating proposal. Please try again.", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
    }
  };

  const durationOptions = [
    { label: "2 weeks", value: "2 weeks" },
    { label: "1 month", value: "1 month" },
    { label: "2 months", value: "2 months" },
    { label: "More than 2 months", value: "more than 2 months" },
  ];

  const durationHours = [
    { label: "1 hours", value: "1 hours" },
    { label: "2 hours", value: "2 hours" },
    { label: "3 hours", value: "3 hours" },
    { label: "4 hours", value: "4 hours" },
    { label: "More than 4 hours", value: "more than 4 hours" },
  ];

  const budgetType = proposal[0]?.jobId?.budgetType;

  return (
    <div className="p-10">
      <div className="flex justify-between items-center ">
        <div className="px-10 mb-5 ">
          <span
            onClick={() => navigate(-1)}
            className="hover:underline text-teal-600"
          >
            Back to offer page
          </span>
        </div>
        <div className=" px-16">
          <Tooltip label="Edit" placement="bottom">
            <span onClick={() => openModal(proposal[0])}>
              <CiEdit className="w-6 h-6 text-gray-500 cursor-pointer" />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="border-2 border-gray-200 mx-10 rounded-xl min-h-[60vh] p-10">
        {Array.isArray(proposal) && proposal.length > 0 ? (
          proposal.map((item) => (
            <div key={item._id}>
              <h6 className="text-xl pb-5 text-gray-500">job Info</h6>
              <p className="text-sm text-gray-500">{format(item.createdAt)}</p>
              <div className="flex justify-between">
                <div className="flex font-semibold text-xl text-teal-600">
                  {item?.jobId?.jobRole || ""}
                </div>
              
                <div className="flex items-center space-x-4">
                  <div className="flex items-center mr-5 space-x-2">
                    {item?.status === "pending" ? (
                      <>
                        <FaHourglassHalf className="text-md text-yellow-500" />
                        <span className="text-yellow-500">Pending</span>
                      </>
                    ) : item?.status === "accepted" ? (
                      <>
                        <FaCheckCircle className="text-md text-green-500" />
                        <span className="text-green-500">Accepted</span>
                      </>
                    ) : item?.status === "rejected" ? (
                      <>
                        <FaTimesCircle className="text-md text-red-500" />
                        <span className="text-red-500">Rejected</span>
                      </>
                    ) : (
                      <>
                        <FaHourglassHalf className="text-md text-yellow-500" />
                        <span className="text-yellow-500">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex font-semibold  py-10 text-md text-gray-600">
                  {item?.jobId?.description || ""}
                </div>
              <hr className="my-4" />
              <div className=" pb-5 mt-4 text-lg font-semibold text-teal-900  flex items-center">
                proposal Details
              </div>
              <div className="w-full p-4 mb-4 bg-teal-100 rounded-md relative group">
                <div className="mx-5 text-md flex items-center">
                  <span className="font-bold mr-2">Cover Letter:</span>
                  <p>{item?.coverLetter || ""}</p>
                </div>
                <div className="mx-5 text-md flex items-center">
                  <span className="font-bold mr-2">Estimate Time:</span>
                  <p>{item?.duration || ""}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div className=" pb-5 mt-4 text-lg font-semibold text-teal-700  flex items-center">
                Skills
              </div>
              <div className="flex flex-wrap mx-5">
                {item?.freelancerId?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <hr className="my-4" />
              <div className="pt-10 mb-[-0.5rem] mt-4 text-lg font-semibold text-teal-700 ">
                Bid Value
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-full p-5">
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody>
                          <tr>
                            <td className="text-xl py-4">
                              Hourly rate <br />
                              <span className="text-sm mt-2 block">
                                Total amount the client will see.
                              </span>
                            </td>
                            <td className="text-right py-4">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={`₹ ${rate}`}
                                  placeholder="₹ 0:00 / hr"
                                  className="border rounded p-2 text-right"
                                  readOnly
                                />
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="text-xl py-4">
                              Service fee <br />
                              <span className="text-sm mt-2 block">
                                This helps us run the platform and provide
                                services like payment protection and customer
                                support.
                              </span>
                            </td>
                            <td className="text-right py-4">
                              <input
                                type="text"
                                value={`₹ ${serviceFee}`}
                                placeholder="₹ 0:00 / hr"
                                readOnly
                                className="border rounded p-2 text-right"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="text-xl py-4">
                              You'll get <br />
                              <span className="text-sm mt-2 block">
                                The estimated amount you'll receive after
                                service fees
                              </span>
                            </td>
                            <td className="text-right py-4">
                              <input
                                type="text"
                                value={`₹ ${profit}`}
                                placeholder="₹ 0:00 / hr"
                                readOnly
                                className="border rounded p-2 text-right"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.coverLetter}>
              <FormLabel>Cover Letter</FormLabel>
              <Textarea
                type="text"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
              />
              {errors.coverLetter && (
                <FormErrorMessage>{errors.coverLetter}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={errors.bidAmount}>
              <FormLabel>Bid Amount</FormLabel>
              <Input
                type="number"
                name="bidAmount"
                value={formData.bidAmount}
                onChange={handleInputChange}
              />
              {errors.bidAmount && (
                <FormErrorMessage>{errors.bidAmount}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={errors.duration}>
              <FormLabel>Duration</FormLabel>
              <Select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              >
                {(budgetType === "fixed" ? durationOptions : durationHours).map(
                  (option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
              </Select>
              {errors.duration && (
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleFormSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
