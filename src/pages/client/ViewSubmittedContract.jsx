import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import Rating from "../../components/uic/Rating";
import {
  browseSubmitted,
  acceptjobsubmit,
  rejectJobSubmit,
} from "../../utils/api/api";
import { toast } from "react-toastify";

export default function ViewSubmittedContract() {
  const [contractData, setContractData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const reviews = [4, 5, 2, 4];

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await clientAxiosInstance.get(
          `${browseSubmitted}?id=${id}`
        );
        console.log(res.data);
        if (res.data) {
          setContractData(res.data);
        }
      } catch (error) {
        console.error(error, "error in fetch userData");
      }
    };
    fetchContract();
  }, [id]);

  const [fileUrl, setFileUrl] = useState(null);
  useEffect(() => {
    if (contractData?.projectFile?.location) {
      const file = contractData.projectFile.location;

      if (file instanceof Blob || file instanceof File) {
        const url = URL.createObjectURL(file);
        setFileUrl(url);

        return () => URL.revokeObjectURL(url);
      } else if (typeof file === "string") {
        setFileUrl(file);
      }
    }
  }, [contractData]);

  const handleAccept = async () => {
    try {
      const data = {
        contractId: contractData.contractId._id,
        jobId: contractData.jobId._id,
        userId: contractData.userId._id,
        jobsubmission: id,
      };
      const res = await clientAxiosInstance.post(acceptjobsubmit, data);
      if (res.data) {
        toast.success("success", {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate(`/client/rating/${res.data.userId}/${res.data.jobId}`);
        }, 2000);
      }
    } catch (error) {
      console.error(error, "error in handle accept");
    }
  };

  const handleReject = async () => {
    const res = await clientAxiosInstance.post(rejectJobSubmit);
  };

  return (
    <div className="p-10">
      <div className="px-10">
        <span
          onClick={() => {
            navigate(-1);
          }}
          className="hover:underline text-teal-600 cursor-pointer"
        >
          Back to Home
        </span>
      </div>
      <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex flex-col min-h-[80vh]">
        <div className="flex">
          <aside className="w-1/3 p-5 border-r border-gray-200">
            <div className="flex items-center space-x-4 min-w-[60]">
              <img
                src={
                  contractData?.userId?.profile?.location ||
                  "default-profile-pic.jpg"
                }
                alt={`${contractData?.userId?.name}'s profile`}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  {contractData?.userId?.name || "User Name"}
                </h2>
                <p className="text-gray-500">
                  {contractData?.userId?.jobTitle || "Job Title"}
                </p>
              </div>
            </div>
            <hr className="my-8 border-gray-300" />
            <div className="flex items-center justify-center">
              <Rating layout={"userProfile"} reviews={reviews} />
            </div>
            <hr className="my-8 border-gray-300" />
          </aside>

          <div className="w-2/3 p-5 border-r border-gray-200">
            <h2 className="text-2xl text-gray-700">
              Submitted Contract Details
            </h2>
            <div className="mt-6 p-5">
              <h3 className="text-2xl font-semibold text-gray-500">
                {contractData?.contractId?.contractTitle || "Contract Name"}
              </h3>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-500">
                {contractData?.overview || "Contract Overview"}
              </h3>
            </div>
            <div className="mt-6 p-5">
              <h3 className="text-lg font-semibold text-gray-700">
                Additional Details
              </h3>
              {/* <p className="text-gray-500">
                {contractData?.additionalDetails ||
                  "Any additional details about the contract"}
              </p> */}
              <div className="m-5">
                {fileUrl && (
                  <>
                    <span className="font-semibold">
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
            </div>
            {/* Accept and Reject Buttons */}
         
            {contractData?.status !== "accept" && (
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
