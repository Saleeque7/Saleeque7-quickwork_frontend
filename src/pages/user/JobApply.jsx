import { MdCurrencyRupee } from "react-icons/md";
import { Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { browseJobpost ,ApplyNowApi } from "../../utils/api/api";
import { useSelector , useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../utils/Redux/userSlice";

export default function JobApply() {
  const user = useSelector((state) => state.persisted.user.user);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [amountAfterFee, setAmountAfterFee] = useState("");
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const { id } = useParams();
  const [job, setJob] = useState("");
  const navigate = useNavigate();
  const [hourlyrate ,sethourlyRate] = useState('')
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${browseJobpost}?id=${id}`
        );
        console.log(response.data);
        setJob(response.data.job);
        sethourlyRate(response.data.hourlyRate)
      } catch (error) {
        console.error("Failed to fetch job details", error);
      }
    };

    fetchJobData();
  }, [id]);

  const handleChangeTextArea = (e) => {
    setCoverLetter(e.target.value);
  };

  const handleChangeDuration = (e) => {
    setDuration(e.target.value);
  };

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);

    if (value <= 0 || value > 100000 || isNaN(value)) {
      setTimeout(() => {
        setError("");
      }, 2000);
      setError("Bid amount must be between 1 and 100000");
      setBidAmount("");
      setServiceFee("");
      setAmountAfterFee("");
      return;
    }

    setError("");
    setBidAmount(value);

    const calculatedServiceFee = value * 0.1;
    setServiceFee(calculatedServiceFee.toFixed(2));

    const calculatedAmountAfterFee = value - calculatedServiceFee;
    setAmountAfterFee(calculatedAmountAfterFee.toFixed(2));
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 5000);

    return () => clearTimeout(timer);
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!bidAmount) newErrors.bidAmount = "Please bid a Amount";
    if (!duration || duration === "Select duration")
      newErrors.duration = "Please select a duration";
    if (!coverLetter) newErrors.coverLetter = "Please write a cover letter";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        setLoading(true);
        const formData ={
          jobId:id,
          bidAmount,
          duration,
          coverLetter
        }
        console.log(formData ,"inda");
        const res = await userAxiosInstance.post(ApplyNowApi ,formData)
      
        
        setSubmitted(true);
        // dispatch(setUser(res.data.user)
 
        setTimeout(() => {       
          setLoading(false);
          navigate("/user/home")

        }, 2000);
        
        if(res.data.success){
          console.log(true);
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      console.error(error, "error in submitting form");
      toast.error("error", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-10">
        <div className="flex font-semibold text-5xl m-10 mb-5 text-teal-600">
          Submit a proposal
        </div>

        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-7/12 pr-10">
            <div className="text-xl font-semibold mb-5">Job details</div>
            <div className="m-5">
              <span className="text-teal-700 text-xl">
                {job?.jobRole || "Node.js Developer"}
              </span>
            </div>

            <section className="p-1">
              <div className="flex m-5">
                Posted:
                <span className="ml-2">
                  {job?.createdAt ? timeAgo(job.createdAt) : ""}
                </span>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <p>{job?.description || ""}</p>
              </div>
              <Divider className="my-4" />

              <div className="m-5">
                <h2 className="font-sans font-semibold text-md mb-3">
                  Skills and Expertise
                </h2>
                <div className="flex flex-wrap">
                  {job?.skills?.map((skill, index) => (
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

          <div className="w-4/12 pl-2">
            <div className="m-5">
              <div className="flex items-center mb-2">
                <MdCurrencyRupee />
                {job?.budgetType === "fixed" && (
                  <span className="ml-2 text-lg">{job?.budget || ""}</span>
                )}
                {job?.budgetType === "hourly" && (
                  <span className="ml-2 text-lg">
                    {job?.wageRangeMin
                      ? `${job.wageRangeMin} to ${job.wageRangeMax}`
                      : ""}
                  </span>
                )}
              </div>
              <div>
                <span className="text-md">
                  {job?.budgetType === "fixed" ? "Fixed price" : "Hourly rate"}
                </span>
              </div>
            </div>

            <div className="flex m-5">
              Project type:
              <span className="ml-2 font-bold text-gray-500">
                {job?.projectTerm || ""}
              </span>
            </div>
          </div>
        </div>
        {job.budgetType === "fixed" && (
          <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
            <div className="w-7/12 ">
              <div className="text-xl font-semibold mb-5">Terms</div>
              <div className="m-5">
                <span className="text-teal-700 text-md">
                  What is the full amount you'd like to bid for this job?
                </span>
              </div>

              <section className="p-1">
                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      Bid
                    </h2>
                    <span className="text-gray-500 text-sm">
                      Total amount the client will see on your proposal
                    </span>
                  </div>
                  <div>
                    <input
                      type="number"
                      id="bidAmountInput"
                      name="bidAmountInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-teal-500"
                      placeholder="₹ 0:00"
                      value={bidAmount}
                      onChange={handleChange}
                      min="1"
                      max="100000"
                      step="0.01"
                    />
                    {errors.bidAmount && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.bidAmount}
                      </div>
                    )}
                  </div>
                </div>

                {error && <div className="text-red-500 ml-5">{error}</div>}
                <hr className="my-4" />

                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      10% Freelancer Service Fee
                    </h2>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="serviceFeeInput"
                      name="serviceFeeInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-none"
                      placeholder="₹ 0:00"
                      value={serviceFee ? `₹ ${serviceFee}` : "₹ 0:00"}
                      readOnly
                    />
                  </div>
                </div>
                <hr className="my-4" />

                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      You’ll Receive
                    </h2>
                    <span className="text-gray-500 text-sm">
                      The estimated amount you'll receive after service fees
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="amountAfterFeeInput"
                      name="amountAfterFeeInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-none"
                      placeholder="₹ 0:00"
                      value={amountAfterFee ? `₹ ${amountAfterFee}` : "₹ 0:00"}
                      readOnly
                    />
                  </div>
                </div>
              </section>
            </div>
            <div className="w-5/12 px-5 py-9 ">
              <div className="m-5 pb-5">
                <span className="text-teal-700 text-md">
                  How long will this project take?
                </span>
              </div>
              <div className="m-5 ">
                <select
                  id="projectDuration"
                  name="projectDuration"
                  className="px-2 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  value={duration}
                  onChange={handleChangeDuration}
                >
                  <option value="">Select duration</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="more than 2 months">More than 2 months</option>
                </select>
                {errors.duration && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.duration}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {job.budgetType === "hourly" && (
          <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
            <div className="w-7/12 ">
              <div className="text-xl font-semibold mb-5">Terms</div>
              <div className="m-5">
                <span className="text-teal-700 text-md">
                  What is the rate you'd like to bid for this job?
                </span>
              </div>

              <section className="p-1">
                <div className="flex justify-between m-5 mb-10">
                  <div>
                    <h2 className="font-sans font-semibold text-gray-500 text-sm mb-1">
                      Your profile rate :{`₹ ${hourlyrate} /hr`}
                    </h2>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-sans font-semibold text-gray-500 text-sm mb-1">
                      Client's budget: {`₹ ${job?.wageRangeMin} - ₹ ${job?.wageRangeMax} /hrs`}
                    </h2>
                  </div>
                </div>
                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      Bid
                    </h2>
                    <span className="text-gray-500 text-sm">
                      Total amount the client will see on your proposal
                    </span>
                  </div>
                  <div>
                    <input
                      type="number"
                      id="bidAmountInput"
                      name="bidAmountInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-teal-500"
                      placeholder="₹ 0:00"
                      value={bidAmount}
                      onChange={handleChange}
                      min="1"
                      max="100000"
                      step="0.01"
                    />
                    {errors.bidAmount && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.bidAmount}
                      </div>
                    )}
                  </div>
                </div>
                {error && <div className="text-red-500 ml-5">{error}</div>}
                <hr className="my-4" />

                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      10% Freelancer Service Fee
                    </h2>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="serviceFeeInput"
                      name="serviceFeeInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-none"
                      placeholder="₹ 0:00"
                      value={serviceFee ? `₹ ${serviceFee}` : "₹ 0:00"}
                      readOnly
                    />
                  </div>
                </div>
                <hr className="my-4" />

                <div className="flex justify-between m-5">
                  <div>
                    <h2 className="font-sans font-semibold text-md mb-1">
                      You’ll Receive
                    </h2>
                    <span className="text-gray-500 text-sm">
                      The estimated amount you'll receive after service fees
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="amountAfterFeeInput"
                      name="amountAfterFeeInput"
                      className="px-3 py-2 block w-80 border border-gray-300 rounded-md text-right focus:outline-none"
                      placeholder="₹ 0:00"
                      value={amountAfterFee ? `₹ ${amountAfterFee}` : "₹ 0:00"}
                      readOnly
                    />
                  </div>
                </div>
              </section>
            </div>
            <div className="w-5/12 px-5 py-9 ">
              <div className="m-5 pb-5">
                <span className="text-teal-700 text-md">
                  How long will this project take?
                </span>
              </div>
              <div className="m-5 ">
                <select
                  id="projectDuration"
                  name="projectDuration"
                  className="px-2 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  value={duration}
                  onChange={handleChangeDuration}
                >
                  <option value="">Select duration</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="more than 4 hours">More than 4 hours</option>
                </select>

                {errors.duration && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.duration}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-2 border-gray-200 m-10 rounded-xl p-10 flex">
          <div className="w-full pr-10">
            <div className="text-xl font-semibold p-3 mb-5">Cover Letter</div>
            <textarea
              id="coverLetter"
              name="coverLetter"
              className="px-3 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              rows="8"
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={handleChangeTextArea}
            />
            {errors.coverLetter && (
              <div className="text-red-500 text-sm mt-1">
                {errors.coverLetter}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10  p-20 flex justify-between">
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
                <span>Submit Proposal</span>
              )}
            </button>
        </div>
      </div>
    </>
  );
}
