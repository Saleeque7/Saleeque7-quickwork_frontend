import React, { useEffect, useState } from "react";
import { FaBriefcase, FaFileAlt, FaUserCheck, FaSearch } from "react-icons/fa";
import { Divider, Tooltip, Input } from "@chakra-ui/react";
import { MdCurrencyRupee } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { useNavigate } from "react-router-dom";
import {
  browseJobApi,
  browseProposalsApi,
  shortListJobProposalsApi,
  unshortListJobProposalsApi,
  archiveJobProposalsApi,
  unarchiveJobProposalsApi,
  declineJobProposalsApi,
  createChatsApi,
} from "../../utils/api/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
const Tabs = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("ViewJob");
  const [activeminTab, setActiveminTab] = useState("All Proposals");
  const { id } = useParams();
  const [job, setJob] = useState([]);
  const [proposals, setproposals] = useState([]);
  const [archivedProposals, setarchivedProposals] = useState([]);
  const [acceptedProposals, setacceptedProposals] = useState([]);
  const [shortlistedProposals, setshortlistedProposals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (activeTab === "ViewJob") {
      const fetchJob = async () => {
        try {
          const response = await clientAxiosInstance.get(
            `${browseJobApi}?id=${id}`
          );
          console.log(response.data);
          setJob(response.data);
        } catch (error) {
          console.error("Failed to fetch job details", error);
        }
      };
      fetchJob();
    } else if (activeTab === "Review Proposals") {
      const fetchProposals = async () => {
        try {
          const response = await clientAxiosInstance.get(
            `${browseProposalsApi}?id=${id}`
          );
          console.log(response.data.proposals);
          handleProposal(response.data.proposals);
          // setproposals()
        } catch (error) {
          console.error("Failed to fetch fetchProposals", error);
        }
      };
      fetchProposals();
    }
  }, [id, activeTab, activeminTab]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleProposal = async (data) => {
    try {
      const pendingProposalas = await data.filter(
        (proposal) => proposal.status === "pending"
      );
      const archivedProposal = await data.filter(
        (proposal) => proposal.status === "archived"
      );
      const shortlistedProposal = await data.filter(
        (proposal) => proposal.status === "shortList"
      );
      const acceptedproposal = await data.filter(
        (proposal) => proposal.status === "accepted"
      );
      const rejectedProposal = await data.filter(
        (proposal) => proposal.status === "rejected"
      );

      setproposals(pendingProposalas);
      setarchivedProposals(archivedProposal);
      setshortlistedProposals(shortlistedProposal);
      setacceptedProposals(acceptedproposal);
    } catch (error) {
      console.error(error, "error in handle proposal");
    }
  };

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

  const handleShortlist = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${shortListJobProposalsApi}?id=${id}`
      );
      const updatedjobProposal = response.data.proposals;
      setproposals((preproposals) =>
        preproposals.filter(
          (proposal) => proposal._id !== updatedjobProposal._id
        )
      );

      setshortlistedProposals((prevShortlisted) => [
        ...prevShortlisted,
        updatedjobProposal,
      ]);
    } catch (error) {
      console.error("Error shortlist user", error);
    }
  };

  const handleUnShortlist = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${unshortListJobProposalsApi}?id=${id}`
      );
      const updatedjobProposal = response.data.proposals;
      setshortlistedProposals((prevShortlisted) =>
        prevShortlisted.filter(
          (proposal) => proposal._id !== updatedjobProposal._id
        )
      );

      setproposals((preproposals) => [...preproposals, updatedjobProposal]);
    } catch (error) {
      console.error("Error unshortlist user", error);
    }
  };
  const handleArchive = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${archiveJobProposalsApi}?id=${id}`
      );
      const updatedjobProposal = response.data.proposals;

      setproposals((preproposals) =>
        preproposals.filter(
          (proposal) => proposal._id !== updatedjobProposal._id
        )
      );

      setarchivedProposals((prevarchived) => [
        ...prevarchived,
        updatedjobProposal,
      ]);
    } catch (error) {
      console.error("Error unshortlist user", error);
    }
  };

  const handleunarchive = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${unarchiveJobProposalsApi}?id=${id}`
      );
      const updatedjobProposal = response.data.proposals;

      setarchivedProposals((prearchived) =>
        prearchived.filter(
          (proposal) => proposal._id !== updatedjobProposal._id
        )
      );

      setproposals((preproposals) => [...preproposals, updatedjobProposal]);
    } catch (error) {
      console.error("Error unshortlist user", error);
    }
  };

  const handleDeclineproposal = async (id) => {
    try {
      const response = await clientAxiosInstance.put(
        `${declineJobProposalsApi}?id=${id}`
      );

      const updatedjobProposal = response.data.proposals;

      setarchivedProposals((prearchived) =>
        prearchived.filter(
          (proposal) => proposal._id !== updatedjobProposal._id
        )
      );
    } catch (error) {
      console.error(error, "error in handle declineproposal");
    }
  };

  const handleStartConversation = async () => {
    console.log(`Starting conversation with ${selectedUser.name}`);
    console.log(`Starting conversation with ${selectedUser._id}`);
    try {
      const res = await clientAxiosInstance.post(createChatsApi, {
        userId: selectedUser._id,
      });
      navigate("/client/messages");
      console.log("Chat created:", res.data);
    } catch (error) {
      console.error(error, "error in create  chat");
    } finally {
      onClose();
    }
  };
  const action = 'Edit'

  return (
    <>
      <div className="flex justify-between items-center ">
        <div className="mt-4 pt-10 pl-32">
          <span className="text-teal-700 text-3xl">
            {job?.jobRole ? job.jobRole : ""}
          </span>
        </div>
        {activeTab === "ViewJob" && (
          <div className="mt-4 pt-10 pr-32">
            <Tooltip label="Edit" placement="bottom">
              <Link to={`/client/jobForm/${action}/${job._id}`}>
                <span>
                  <CiEdit className="w-6 h-6 text-gray-500 cursor-pointer" />
                </span>
              </Link>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center p-10 pl-20 pr-20">
        <div className="w-full max-w-100%  min-h-[60vh]">
          <div className="relative right-0">
            <ul
              className="flex flex-wrap p-1 list-none rounded-xl bg-slate-300"
              role="list"
            >
              <li className="flex-auto text-center">
                <button
                  className={`flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 ${
                    activeTab === "ViewJob"
                      ? "bg-white text-teal-700"
                      : "bg-inherit"
                  }`}
                  onClick={() => setActiveTab("ViewJob")}
                  role="tab"
                  aria-selected={activeTab === "ViewJob"}
                  aria-controls="ViewJob"
                >
                  <FaBriefcase className="w-5 h-5 mr-1" />
                  <span className="ml-1">VIEW JOB POST</span>
                </button>
              </li>
              <li className="flex-auto text-center">
                <button
                  className={`flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 ${
                    activeTab === "Review Proposals"
                      ? "bg-white text-teal-700"
                      : "bg-inherit"
                  }`}
                  onClick={() => setActiveTab("Review Proposals")}
                  role="tab"
                  aria-selected={activeTab === "Review Proposals"}
                  aria-controls="Review Proposals"
                >
                  <FaFileAlt className="w-5 h-5 mr-1" />
                  <span className="ml-1">REVIEW PROPOSALS</span>
                </button>
              </li>
              <li className="flex-auto text-center">
                <button
                  className={`flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 ${
                    activeTab === "Hire"
                      ? "bg-white text-teal-700"
                      : "bg-inherit"
                  }`}
                  onClick={() => setActiveTab("Hire")}
                  role="tab"
                  aria-selected={activeTab === "Hire"}
                  aria-controls="Hire"
                >
                  <FaUserCheck className="w-5 h-5 mr-1" />
                  <span className="ml-1">HIRE</span>
                </button>
              </li>
            </ul>
            <div className="p-5">
              <div
                className={activeTab === "ViewJob" ? "block" : "hidden"}
                id="ViewJob"
                role="tabpanel"
              >
                <section className="p-1 ">
                  <div className="flex m-5 ">
                    posted
                    <span className="ml-2">
                      {job.createdAt ? timeAgo(job.createdAt) : ""}
                    </span>
                  </div>
                  <Divider p={2} color={"gray.500"} opacity={1}></Divider>
                  <div className="flex m-5 ">
                    <p>{job?.description ? job.description : ""}</p>
                  </div>
                  <Divider p={2} color={"gray.500"} opacity={1}></Divider>
                  <div className="m-5">
                    <div className="flex items-center">
                      <MdCurrencyRupee />
                      {job?.budgetType === "fixed" && (
                        <span>{job?.budget ? job.budget : ""}</span>
                      )}
                      {job?.budgetType === "hourly" && (
                        <span>
                          {job?.wageRangeMin
                            ? `${job.wageRangeMin} to ${job.wageRangeMax}`
                            : ""}
                        </span>
                      )}
                    </div>
                    <div>
                      <span>
                        {job?.budgetType === "fixed"
                          ? `${job.budgetType} price`
                          : `${job.budgetType} rate`}
                      </span>
                    </div>
                  </div>
                  <Divider p={2} color={"gray.500"} opacity={1}></Divider>
                  <div className="flex m-5 ">
                    Project type:
                    <span className="ml-2 font-bold text-gray-500">
                      {job?.projectTerm ? job.projectTerm : ""}
                    </span>
                  </div>
                  <Divider p={2} color={"gray.500"} opacity={1}></Divider>
                  <div className="flex m-5">
                    <h2 className="font-sans font-semibold text-md mb-3 ">
                      Skills and Expertise
                    </h2>
                  </div>
                  <div className="flex flex-wrap m-5">
                    {job &&
                      job.skills &&
                      job.skills.length > 0 &&
                      job.skills.map((skill, index) => (
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
                    <span className="ml-2">{job?.proposals?.length || 0}</span>
                  </div>
                </section>
              </div>
              <div
                className={
                  activeTab === "Review Proposals" ? "block" : "hidden"
                }
                id="Review Proposals"
                role="tabpanel"
              >
                <section className="p-1 ">
                  <div className="flex justify-between items-center p-3 bg-gray-100">
                    <nav>
                      <ul className="flex">
                        <li className="mr-4 font-semibold">
                          <button
                            className={`${
                              activeminTab === "All Proposals"
                                ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                                : "text-gray-500"
                            } px-2 py-1`}
                            onClick={() => setActiveminTab("All Proposals")}
                          >
                            All Proposals ({proposals.length || 0})
                          </button>
                        </li>
                        <li className="mr-4 font-semibold">
                          <button
                            className={`${
                              activeminTab === "Shortlisted"
                                ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                                : "text-gray-500"
                            } px-2 py-1`}
                            onClick={() => setActiveminTab("Shortlisted")}
                          >
                            Shortlisted({shortlistedProposals.length || 0})
                          </button>
                        </li>
                        <li className="mr-4 font-semibold">
                          <button
                            className={`${
                              activeminTab === "Archived"
                                ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                                : "text-gray-500"
                            } px-2 py-1`}
                            onClick={() => setActiveminTab("Archived")}
                          >
                            Archived ({archivedProposals.length || 0})
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden w-1/2">
                      <input
                        aria-label="Search"
                        placeholder="Search"
                        type="search"
                        className="px-4 py-2 outline-none w-full rounded-l-xl"
                      />
                      <FaSearch className="text-gray-500 mx-2" />
                    </div>
                  </div>
                </section>

                <section className="p-1 ">
                  {activeminTab === "All Proposals" && (
                    <div className="flex justify-center items-start flex-col bg-gray-100 p-5 w-full">
                      {proposals && proposals.length > 0 ? (
                        <div className="space-y-4 w-full">
                          {proposals.map((proposal) => (
                            <div
                              key={proposal._id || ""}
                              className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full"
                            >
                              <div className=" flex items-center mb-5 text-xs font-semibold text-gray-500">
                                {timeAgo(proposal.createdAt)}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={
                                      proposal?.freelancerId?.profile
                                        ?.location || ""
                                    }
                                    alt={proposal?.freelancerId?.name || ""}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <h2 className="font-semibold text-md">
                                    {proposal?.freelancerId?.name || ""}
                                  </h2>
                                </div>

                                <div className="flex items-center justify-between text-gray-500">
                                  <Tooltip
                                    label="Archive without notifying talent"
                                    placement="left"
                                  >
                                    <span
                                      className="mr-3"
                                      onClick={() =>
                                        handleArchive(proposal._id)
                                      }
                                    >
                                      {proposal?.status === "archived" ? (
                                        <BiSolidDislike className="w-6 h-6 text-gray-500 cursor-pointer" />
                                      ) : (
                                        <BiDislike className="w-6 h-6 text-gray-500 cursor-pointer" />
                                      )}
                                    </span>
                                  </Tooltip>

                                  <Tooltip label="ShortList" placement="bottom">
                                    <span
                                      className="mr-5"
                                      onClick={() =>
                                        handleShortlist(proposal._id)
                                      }
                                    >
                                      {proposal?.status === "shortList" ? (
                                        <BiSolidLike className="w-6 h-6 text-gray-500 cursor-pointer" />
                                      ) : (
                                        <BiLike className="w-6 h-6 text-gray-500 cursor-pointer" />
                                      )}
                                    </span>
                                  </Tooltip>
                                  <button
                                    className="mr-3 border-2 rounded-md p-1 border-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none"
                                    onClick={() => handleOpenModal(proposal?.freelancerId)}
                                  >
                                    <span className="p-4">message</span>
                                  </button>
                                  <button
                                    className="border-2 rounded-md p-1 border-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none"
                                    onClick={() =>
                                      navigate(
                                        `/client/offerLetter/${proposal?.jobId}/${proposal?._id}`
                                      )
                                    }
                                  >
                                    <span className="p-4">Hire</span>
                                  </button>
                                </div>
                              </div>
                              <h1 className="text-xl text-gray-500 my-6">
                                {proposal?.freelancerId?.jobTitle || ""}
                              </h1>

                              <p className="mt-2 text-gray-600">
                                <span className="font-bold">Cover Letter</span>{" "}
                                : {proposal.coverLetter || ""}
                              </p>
                              <div className="mt-2 flex items-center flex-wrap">
                                {proposal?.freelancerId?.skills?.map(
                                  (skill) => (
                                    <span
                                      key={skill}
                                      className="inline-block rounded-md px-4 bg-teal-100 text-teal-800 mr-2 mb-2"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                              <div className="mt-2 flex justify-between">
                                <div className="flex">
                                  <div className="flex items-center mr-5">
                                    <MdCurrencyRupee className="mr-1" />
                                    <span className="text-sm text-gray-500 mr-4">
                                      {proposal.bidAmount || ""}
                                    </span>
                                  </div>
                                  {job?.Earned && (
                                    <div className="flex items-center">
                                      <MdCurrencyRupee className="mr-0" />
                                      <span className="text-sm text-gray-500">
                                        {proposal?.TotalEarnings || 0} Earned
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {job?.duration && (
                                  <div>
                                    Estimated time:
                                    <span className="text-sm ml-3 text-gray-500">
                                      {proposal?.duration || ""}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 w-full">
                          <div className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full">
                            <h1 className="text-xl text-gray-500 my-6">
                              Not any proposals yet
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeminTab === "Shortlisted" && (
                    <div className="flex justify-center items-start flex-col bg-gray-100 p-5 w-full">
                      {shortlistedProposals &&
                      shortlistedProposals.length > 0 ? (
                        <div className="space-y-4 w-full">
                          {shortlistedProposals.map((job) => (
                            <div
                              key={job._id}
                              className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full"
                            >
                              <div className=" flex items-center mb-5 text-xs font-semibold text-gray-500">
                                {timeAgo(job.createdAt)}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={
                                      job?.freelancerId?.profile?.location || ""
                                    }
                                    alt={job?.freelancerId?.name || ""}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <h2 className="font-semibold text-md">
                                    {job?.freelancerId?.name || ""}
                                  </h2>
                                </div>
                                <div className="flex items-center justify-between text-gray-500">
                                  <Tooltip
                                    label="Archive without notifying talent"
                                    placement="left"
                                  >
                                    <span className="mr-3">
                                      <BiDislike className="w-6 h-6 text-gray-500 cursor-pointer" />
                                    </span>
                                  </Tooltip>
                                  <Tooltip
                                    label="UnshortList"
                                    placement="bottom"
                                  >
                                    <span
                                      className="mr-5"
                                      onClick={() => handleUnShortlist(job._id)}
                                    >
                                      <BiSolidLike className="w-6 h-6 text-teal-500 cursor-pointer" />
                                    </span>
                                  </Tooltip>
                                  <button
                                    className="mr-3 border-2 rounded-md p-1 border-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none"
                                    onClick={() => handleOpenModal(job?.freelancerId)}
                                  >
                                    <span className="p-4">message</span>
                                  </button>
                                  <button
                                    className="border-2 rounded-md p-1 border-teal-600 hover:bg-teal-600 hover:text-white focus:outline-none"
                                    onClick={() =>
                                      navigate(
                                        `/client/offerLetter/${job?.jobId}/${job?._id}`
                                      )
                                    }
                                  >
                                    <span className="p-4">Hire</span>
                                  </button>
                                </div>
                              </div>
                              <h1 className="text-xl text-gray-500 my-6">
                                {job?.freelancerId?.jobTitle || ""}
                              </h1>

                              <p className="mt-2 text-gray-600">
                                <span className="font-bold">Cover Letter</span>:{" "}
                                {job.coverLetter}
                              </p>
                              <div className="mt-2 flex items-center flex-wrap">
                                {job?.freelancerId?.skills?.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="inline-block rounded-full px-2 bg-teal-100 text-teal-800 mr-2 mb-2"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                              <div className="mt-2 flex justify-between">
                                <div className="flex">
                                  <div className="flex items-center mr-5">
                                    <MdCurrencyRupee className="mr-1" />
                                    <span className="text-sm text-gray-500 mr-4">
                                      {job.bidAmount || ""}
                                    </span>
                                  </div>
                                  {job.Earned !== "" && (
                                    <div className="flex items-center">
                                      <MdCurrencyRupee className="mr-0" />
                                      <span className="text-sm text-gray-500">
                                        {job.Earned} Earned
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {job.duration !== "" && (
                                  <div>
                                    Estimated time:
                                    <span className="text-sm text-gray-500">
                                      {job.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 w-full">
                          <div className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full">
                            <h1 className="text-xl text-gray-500 my-6">
                              No shortlisted proposals yet
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeminTab === "Archived" && (
                    <div className="flex justify-center items-start flex-col bg-gray-100 p-5 w-full">
                      {archivedProposals && archivedProposals.length > 0 ? (
                        <div className="space-y-4 w-full">
                          {archivedProposals.map((job) => (
                            <div
                              key={job.id}
                              className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full"
                            >
                              <div className=" flex items-center mb-5 text-xs font-semibold text-gray-500">
                                {timeAgo(job.createdAt)}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={
                                      job?.freelancerId?.profile?.location || ""
                                    }
                                    alt={job?.freelancerId?.name || ""}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <h2 className="font-semibold text-md">
                                    {job?.freelancerId?.name || ""}
                                  </h2>
                                </div>
                                <div className="flex items-center justify-between text-gray-500">
                                  <button
                                    className="mr-3 border-2 rounded-md p-1 border-orange-400 hover:bg-orange-400 hover:text-white focus:outline-none"
                                    onClick={() => handleunarchive(job._id)}
                                  >
                                    <span className="p-4">unarchive</span>
                                  </button>
                                  <button
                                    className="border-2 rounded-md p-1  border-red-600  hover:bg-red-600 hover:text-white focus:outline-none"
                                    onClick={() =>
                                      handleDeclineproposal(job._id)
                                    }
                                  >
                                    <span className="p-4">decline</span>
                                  </button>
                                </div>
                              </div>
                              <h1 className="text-xl text-gray-500 my-6">
                                {job?.freelancerId?.jobTitle || ""}
                              </h1>

                              <p className="mt-2 text-gray-600">
                                <span className=" font-bold">Cover Letter</span>{" "}
                                :{job.coverLetter}
                              </p>
                              <div className="mt-2 flex items-center flex-wrap">
                                {job?.freelancerId?.skills?.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-block rounded-full px-2 bg-teal-100 text-teal-800 mr-2 mb-2"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-2 flex justify-between">
                                <div className="flex ">
                                  <div className="flex items-center mr-5">
                                    <MdCurrencyRupee className="mr-1" />
                                    <span className="text-sm text-gray-500 mr-4">
                                      {job.budget}
                                    </span>
                                  </div>
                                  {job.Earned !== "" && (
                                    <div className="flex items-center">
                                      <MdCurrencyRupee className="mr-0" />
                                      <span className="text-sm text-gray-500">
                                        {job.Earned} Earned
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {job.duration !== "" && (
                                  <div>
                                    Estimated time:
                                    <span className="text-sm text-gray-500">
                                      {job.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 w-full">
                          <div className="border border-gray-200 rounded-lg overflow-hidden p-4 bg-white w-full">
                            <h1 className="text-xl text-gray-500 my-6">
                              No selected proposals yet
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
              <div
                className={activeTab === "Hire" ? "block" : "hidden"}
                id="Hire"
                role="tabpanel"
              >
                <section className="p-1">
                  <div className="flex m-5 ">
                    posted
                    <span>1 day ago</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Do you want to start a conversation with {selectedUser?.name}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleStartConversation}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tabs;
