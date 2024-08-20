import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import {
  browseAcceptedContracts,
  deleteProposalApi,
  findjobProposalapi,
} from "../../utils/api/api";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format } from "timeago.js";
import debounce from "lodash.debounce";
import { Pagination } from "../../components/user/Pagination";

export default function ListedWork() {
  const [activeminTab, setActiveminTab] = useState("All Contracts");
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [searchQueryContracts, setSearchQueryContracts] = useState("");
  const [searchQueryProposals, setSearchQueryProposals] = useState("");
  const [currentPageContracts, setCurrentPageContracts] = useState(1);
  const [totalPagesContracts, setTotalPagesContracts] = useState(1);
  const [currentPageProposals, setCurrentPageProposals] = useState(1);
  const [totalPagesProposals, setTotalPagesProposals] = useState(1);
  const navigate = useNavigate();

  const fetchContracts = useCallback(
    debounce(async (query, page = 1, limit = 3) => {
      try {
        const response = await userAxiosInstance.get(browseAcceptedContracts, {
          params: { searchQuery: query, page, limit },
        });

        setContracts(response.data.contracts);
        setTotalPagesContracts(response.data.pages);
      } catch (error) {
        console.error("Failed to fetch contract details", error);
      }
    }, 500),
    []
  );

  const fetchProposals = useCallback(
    debounce(async (query, page = 1, limit = 4) => {
      try {
        const response = await userAxiosInstance.get(findjobProposalapi, {
          params: { searchQuery: query, page, limit },
        });

        setProposals(response.data.proposals);
        setTotalPagesProposals(response.data.pages);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (activeminTab === "All Contracts") {
      fetchContracts(searchQueryContracts, currentPageContracts);
    }

    if (activeminTab === "All Job Proposals") {
      fetchProposals(searchQueryProposals, currentPageProposals);
    }
  }, [
    activeminTab,
    searchQueryContracts,
    searchQueryProposals,
    fetchContracts,
    fetchProposals,
    currentPageContracts,
    currentPageProposals,
  ]);

  const handleView = (id) => {
    navigate(`/user/ContractInfo/${id}`);
  };

  const proposalView = (id) => {
    navigate(`/user/viewproposal/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const res = await userAxiosInstance.delete(
        `${deleteProposalApi}?id=${id}`
      );
      if (res.data) {
        setProposals((prevProposals) =>
          prevProposals.filter((proposal) => proposal._id !== id)
        );
        fetchProposals(searchQueryProposals, currentPageProposals);
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

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
                      activeminTab === "All Contracts"
                        ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                        : "text-gray-500"
                    } px-2 py-1`}
                    onClick={() => setActiveminTab("All Contracts")}
                  >
                    All Contracts
                  </button>
                </li>
                <li className="mr-4 font-semibold">
                  <button
                    className={`${
                      activeminTab === "All Job Proposals"
                        ? "border-b-2 border-teal-500 text-teal-700 font-bold"
                        : "text-gray-500"
                    } px-2 py-1`}
                    onClick={() => setActiveminTab("All Job Proposals")}
                  >
                    All Job Proposals
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <hr className="w-full border-t-1 border-gray-500 mb-12" />
          {activeminTab === "All Contracts" && (
            <div className="flex justify-between px-12 pb-5">
              <h1 className="text-3xl text-gray-700 font-bold">
                All Contracts
              </h1>
            </div>
          )}
        </section>
        <div>
          {activeminTab === "All Contracts" && (
            <>
              <section className="px-10 min-h-[60vh]">
                <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
                  <input
                    aria-label="Search"
                    placeholder="Search Contracts"
                    type="search"
                    className="px-4 py-2 outline-none w-full rounded-l-xl"
                    value={searchQueryContracts}
                    onChange={(e) => setSearchQueryContracts(e.target.value)}
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
                        <div>
                          <h2
                            className="text-lg font-semibold cursor-pointer"
                            onClick={() => handleView(contract._id)}
                          >
                            {contract.contractTitle}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {format(contract.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {contract?.contractStatus === "pending" ? (
                            <>
                              <FaHourglassHalf className="text-md text-yellow-500" />
                              <span className="text-yellow-500">Pending</span>
                            </>
                          ) : contract?.contractStatus === "completed" ? (
                            <>
                              <FaCheckCircle className="text-md text-green-500" />
                              <span className="text-green-500">Completed</span>
                            </>
                          ) : contract?.contractStatus === "dismissed" ? (
                            <>
                              <FaTimesCircle className="text-md text-red-500" />
                              <span className="text-red-500">Dismissed</span>
                            </>
                          ) : (
                            <span className="text-gray-700">Unknown</span>
                          )}
                        </div>
                          <button
                            className="px-8 py-2 text-teal-500 rounded-md hover:bg-teal-600 hover:text-white focus:outline-none"
                            onClick={() => handleView(contract._id)}
                          >
                            Contract Info
                            <FaEye className="inline ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center mt-20">
                    <p className="text-start font-semibold text-xl text-orange-400">
                      You don't have any job contracts yet
                    </p>
                  </div>
                )}
              </section>
              <Pagination
                currentPage={currentPageContracts}
                totalPages={totalPagesContracts}
                onPageChange={setCurrentPageContracts}
              />
            </>
          )}
        </div>
        {activeminTab === "All Job Proposals" && (
          <>
            <section className="px-10 min-h-[60vh]">
              <div className="flex justify-between pb-5">
                <h1 className="text-3xl text-gray-700 font-bold">
                  All Job Proposals
                </h1>
              </div>
              <div className="flex items-center bg-white border border-gray-300 rounded-xl mb-5 overflow-hidden w-1/2">
                <input
                  aria-label="Search"
                  placeholder="Search Proposals"
                  type="search"
                  className="px-4 py-2 outline-none w-full rounded-l-xl"
                  value={searchQueryProposals}
                  onChange={(e) => setSearchQueryProposals(e.target.value)}
                />
                <FaSearch className="text-gray-500 mx-2" />
              </div>
              {proposals.length > 0 ? (
                <div className="w-full mx-auto py-8">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal._id}
                      className="flex justify-between items-center p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-md"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => proposalView(proposal._id)}
                      >
                        <h2 className="text-lg font-semibold">
                          {proposal?.jobId?.jobRole || ""}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {format(proposal?.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center mr-5 space-x-2">
                          {proposal?.status === "pending" ? (
                            <>
                              <FaHourglassHalf className="text-md text-yellow-500" />
                              <span className="text-yellow-500">Pending</span>
                            </>
                          ) : proposal?.status === "accepted" ? (
                            <>
                              <FaCheckCircle className="text-md text-green-500" />
                              <span className="text-green-500">Accepted</span>
                            </>
                          ) : proposal?.status === "rejected" ? (
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
                        <button
                          className="text-red-500 hover:text-red-600 focus:outline-none"
                          onClick={() => handleDelete(proposal._id)}
                        >
                          <FaTrashAlt className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center mt-20">
                  <p className="text-start font-semibold text-xl text-orange-400">
                    You don't have any job proposals yet
                  </p>
                </div>
              )}
            </section>

            <Pagination
              currentPage={currentPageProposals}
              totalPages={totalPagesProposals}
              onPageChange={setCurrentPageProposals}
            />
          </>
        )}
      </div>
    </>
  );
}
