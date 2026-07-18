import { MdCheckCircle, MdCancel, MdClose } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import ProfileStart from "../uic/ProfileStart";
import { useUserProfile } from "../../utils/context/ProfileContext";
import ImageUploaderWithCrop from "./CroppedImage";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { addprofileApi, addprofilesecApi , addExperienceApi , isUserprofileApi } from "../../utils/api/api";
import { setUser } from "../../utils/Redux/userSlice";
import { toast } from "react-toastify";

const steps = [
  { title: "Add Profile", description: "Profile Info" },
  { title: "Professional Info", description: "Skills" },
  { title: "Job experience", description: "Experience" },
];

export default function UserProfile() {
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };

  const user = useSelector((state) => state.persisted.user.user);

  const { isStart, setIsStart } = useUserProfile();

  const [email, setEmail] = useState(user.email || "");
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [image, setImage] = useState(user?.profile?.location || "");
  const [imageError, setImageError] = useState("");
  const [place, setPlace] = useState(user.State || "");
  const [placeError, setPlaceError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDate(user.dateOfBirth) || ""
  );
  const [dateOfBirtherror, setdateOfBirthError] = useState("");

  const [jobTitle, setJobTitle] = useState(user.jobTitle || "");
  const [jobTitleError, setJobTitleError] = useState("");
  const [Overview, setOverview] = useState(user.overview || "");
  const [OverviewError, setOverviewError] = useState("");
  const [skill, setSkill] = useState("");
  const [skillError, setSkillError] = useState("");
  const [skills, setSkills] = useState(user.skills || []);
  const [rate, setRate] = useState(user.hourlyRate || "");
  const [rateError, setRateError] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [profit, setProfit] = useState("");

  const [jobTitleExp, setJobTitleExp] = useState("");
  const [jobTitleErrorExp, setJobTitleErrorExp] = useState("");
  const [companyExp, setCompanyExp] = useState("");
  const [companyExpError, setcompanyExpError] = useState("");
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState("");
  const [expOverview, setExpOverview] = useState("");
  const [expOverviewError, setExpOverviewError] = useState("");

  const [hasExperience, setHasExperience] = useState(null);
  const [selectedBox, setSelectedBox] = useState("");
  const [preformSubmit, setPreFormSubmit] = useState(false);
  const [moreExperience , setMoreExperience] = useState(false)

  const setUserrate = (rate) => {
    const ser = (rate * 10) / 100;
    const pro = rate - ser;
    setRate(rate);
    setServiceFee(ser);
    setProfit(pro);
  };
  useEffect(() => {
    if (user.hourlyRate) {
      setUserrate(user.hourlyRate);
    }
  }, [user.hourlyRate]);

  const validateDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const ageDiff = today.getFullYear() - selectedDate.getFullYear();
    const ageMonthDiff = today.getMonth() - selectedDate.getMonth();
    const ageDayDiff = today.getDate() - selectedDate.getDate();

    if (selectedDate > today) {
      return "Date of birth can't be in the future.";
    }

    if (
      ageDiff < 18 ||
      (ageDiff === 18 &&
        (ageMonthDiff < 0 || (ageMonthDiff === 0 && ageDayDiff < 0)))
    ) {
      return "You must be at least 18 years old.";
    }

    return "";
  };

  const setErrorWithTimeout = (setError, errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  function validatePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.trim();
    if (!phoneNumber) {
      return "Please enter your phone number";
    }
    const phoneRegex =
      /^\+?(\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})$/;

    if (!phoneRegex.test(phoneNumber)) {
      return "Please enter a valid phone number (10 to 14 digits, optional country/area code)";
    }
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 14) {
      return "Phone number must be between 10 and 14 digits long";
    }
    const uniqueDigits = new Set(digitsOnly);

    if (uniqueDigits.size < 4) {
      return "Phone number must contain at least 4 different digits";
    }
    return "";
  }

  const validateFields1 = () => {
    let isValid = true;
    const currentYear = new Date().getFullYear();

    if (!image.trim()) {
      setErrorWithTimeout(setImageError, "Please add an image");
      isValid = false;
    } else {
      setImageError("");
    }

    if (!phone.trim()) {
      setErrorWithTimeout(setPhoneError, "Please enter your phone number");
      isValid = false;
    } else {
      const phoneErrorMessage = validatePhoneNumber(phone);
      if (phoneErrorMessage) {
        setErrorWithTimeout(setPhoneError, phoneErrorMessage);
        isValid = false;
      } else {
        setPhoneError("");
      }
    }

    if (!dateOfBirth.trim()) {
      setErrorWithTimeout(
        setdateOfBirthError,
        "Please enter your date of birth"
      );
      isValid = false;
    } else {
      const errorMessage = validateDate(dateOfBirth);
      if (errorMessage) {
        setErrorWithTimeout(setdateOfBirthError, errorMessage);
        isValid = false;
      } else {
        setdateOfBirthError("");
      }
    }

    if (!place.trim()) {
      setErrorWithTimeout(setPlaceError, "Please enter your state");
      isValid = false;
    } else {
      setPlaceError("");
    }

    return isValid;
  };
  const validateFields2 = () => {
    let isValid = true;
    if (!jobTitle.trim()) {
      setErrorWithTimeout(setJobTitleError, "Please Add a job Title");
      isValid = false;
    } else {
      setJobTitleError("");
    }

    if (!Overview.trim()) {
      setErrorWithTimeout(setOverviewError, "Please fill the field");
      isValid = false;
    } else {
      const trimmedValue = Overview.trim();
      if (trimmedValue.length < 50) {
        setErrorWithTimeout(setOverviewError, "Enter at least 50 characters");
        isValid = false;
      } else {
        setOverviewError("");
      }
    }
    if (skills.length === 0) {
      setErrorWithTimeout(setSkillError, "Please add at least one skill");
      isValid = false;
    } else {
      setSkillError("");
    }
    if (!rate.toString().trim()) {
      setErrorWithTimeout(setRateError, "please add atleast one skill");
      isValid = false;
    } else {
      setRateError("");
    }

    return isValid;
  };

  const validateExperience = () => {
    let isValid = true;

    if (!jobTitleExp.trim()) {
      setErrorWithTimeout(setJobTitleErrorExp, "Please Add  job Title");
      isValid = false;
    } else {
      setJobTitleErrorExp("");
    }
    if (!companyExp.trim()) {
      setErrorWithTimeout(setcompanyExpError, "Please fill the field");
      isValid = false;
    } else {
      setcompanyExpError("");
    }
    if (!duration.trim()) {
      setErrorWithTimeout(setDurationError, "how many years of experience ?");
      isValid = false;
    } else {
      setDurationError("");
    }
    if (!expOverview.trim()) {
      setErrorWithTimeout(setExpOverviewError, "explain your self");
      isValid = false;
    } else {
      setExpOverviewError("");
    }
    return isValid;
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDateOfBirth(date);
  };

  const [activeStep, setActiveStep] = useState(0);
  const goToNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPrevious = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        user.name &&
        user.email &&
        user.phone &&
        user.dateOfBirth &&
        user.profile.location
      ) {
        goToNext();
      } else {
        if (!validateFields1()) {
          return;
        }
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "profile_image.jpg", { type: blob.type });

      
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("place", place);
        formData.append("image", file);
        try {
          const res = await userAxiosInstance.post(addprofileApi, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (res.data && res.data.success) {
            dispatch(setUser(res.data.user));
            goToNext();
          }
        } catch (error) {
          console.error("Error saving profile:", error);
        }
      }
      //else if (){
      // alert("bayya")
      // goToNext();
      // }else{
      // alert("byya byya")
    } else if (activeStep === 1) {
      if (user.jobTitle && user.overview && user.skills && user.hourlyRate) {
        goToNext();
      } else {
        if (!validateFields2()) {
          return;
        }
        const data = {
          jobTitle,
          Overview,
          skills,
          rate,
        };
        console.log(data);
        try {
          const res = await userAxiosInstance.post(addprofilesecApi, data);

          if (res.data && res.data.user) {
            dispatch(setUser(res.data.user));
            goToNext();
          }
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }
    } else if (activeStep === 2) {
      if (!hasExperience) {
        const res = await  userAxiosInstance.post(isUserprofileApi)
        console.log(res.data);
        if (res.data && res.data.user) {
          dispatch(setUser(res.data.user));
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      } else {
        if (!validateExperience()) {
          return;
        }
        const data ={
          jobTitleExp,
          companyExp,
          duration,
          expOverview
        }
        const res = await userAxiosInstance.post(addExperienceApi,data)
        console.log(res.data);
        if (res.data && res.data.user) {
          dispatch(setUser(res.data.user));
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      }
    }
  };

  const handlePrev = () => {
    goToPrevious();
  };
  const handleProfileStart = () => {
    setIsStart(true);
  };
  const handleImageCropped = (croppedImageUrl) => {
    setImage(croppedImageUrl);
  };
  const handlebackpage = () => {
    setHasExperience(null);
    setPreFormSubmit(false);
  };

  const handleBoxClick = (boxName) => {
    setSelectedBox(boxName);
  };
  const handleExperienceSubmit = () => {
    if (selectedBox === "boxA") {
      setHasExperience(true);
    } else if (selectedBox === "boxB") {
      setHasExperience(false);
    }
    setPreFormSubmit(true);
  };

  const addSkill = () => {
    if (skill.trim()) {
      setSkills([...skills, skill]);
      setSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleRate = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    const amt = parseInt(numericValue, 10);

    if (isNaN(amt) || numericValue === "") {
      setRate("");
      setServiceFee("");
      setProfit("");
    } else {
      const servicePer = 10;
      const serFee = amt * (servicePer / 100);
      const prft = amt - serFee;

      setRate(numericValue);
      setServiceFee(serFee.toFixed(2));
      setProfit(prft.toFixed(2));
    }
  };

  const durationOptions = [
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "3 years", value: "3 years" },
    { label: "4 years", value: "4 years" },
    { label: "5 years", value: "5 years" },
    { label: "Above 5 years", value: "Above 5 years" },
  ];

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };
  return (
    <>
      {isStart ? (
        <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center p-5">
          <div className="w-full md:w-3/4 bg-white p-8 mt-8 rounded-xl shadow-xl text-center">
            {/* Custom Stepper */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 flex items-center w-full">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all duration-300 ${activeStep >= index ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-semibold transition-colors duration-300 ${activeStep === index ? 'text-teal-700' : 'text-gray-500'}`}>{step.title}</div>
                      <div className="text-xs text-gray-400">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block flex-1 h-0.5 mx-4 transition-all duration-300 ${activeStep > index ? 'bg-teal-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {activeStep === 0 && (
              <>
                <div className="text-left px-4 md:px-10 mb-6 mt-12 text-2xl font-bold text-teal-700 underline">
                  Basic Info
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center p-5">
                  <div className="w-full md:w-[70%] flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        disabled
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded font-bold bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                      <input
                        type="email"
                        disabled
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded font-bold bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors ${
                          phoneError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>
                  </div>
                  <div className="w-full md:w-[30%]">
                    <ImageUploaderWithCrop
                      user={user}
                      onImageCropped={handleImageCropped}
                      imageError={imageError}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 px-5 pb-5">
                  <div className="w-full md:w-1/2 text-left flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={handleDateChange}
                      className={`w-full p-2 border rounded outline-none transition-colors ${
                        dateOfBirtherror ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                      } ${!dateOfBirth ? "opacity-50" : ""}`}
                    />
                    {dateOfBirtherror && <p className="text-red-500 text-xs mt-1">{dateOfBirtherror}</p>}
                  </div>
                  <div className="w-full md:w-1/2 text-left flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">State</label>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className={`w-full p-2 border rounded outline-none transition-colors ${
                        placeError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                      }`}
                    />
                    {placeError && <p className="text-red-500 text-xs mt-1">{placeError}</p>}
                  </div>
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <div className="text-left px-4 md:px-10 mb-6 mt-12 text-2xl font-bold text-teal-700 underline">
                  Professional Information
                </div>
                <div className="flex flex-col gap-4 p-5 text-left">
                  <div className="w-full md:w-[70%] flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Job Title</label>
                      <input
                        type="text"
                        placeholder="Ex: Full-stack developer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors ${
                          jobTitleError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      {jobTitleError && <p className="text-red-500 text-xs mt-1">{jobTitleError}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Overview</label>
                      <textarea
                        placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
                        value={Overview}
                        onChange={(e) => setOverview(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors h-32 ${
                          OverviewError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      <div className="text-right">
                        <span className="text-xs text-gray-500">At least 50 characters</span>
                      </div>
                      {OverviewError && <p className="text-red-500 text-xs mt-1">{OverviewError}</p>}
                    </div>
                  </div>
                </div>

                <div className="text-left px-4 md:px-10 mb-6 mt-4 text-2xl font-bold text-teal-700 underline">
                  Your Skills
                </div>
                <div className="flex flex-col gap-4 p-5 text-left">
                  <div className="w-full md:w-[70%] flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Add Skills</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter skills here"
                          value={skill}
                          onChange={(e) => setSkill(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded outline-none focus:border-teal-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      {skillError && <p className="text-red-500 text-xs mt-1">{skillError}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-200 border border-gray-300 rounded-md px-3 py-1.5 shadow-sm text-sm"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="p-1 rounded-full hover:bg-red-200 text-red-600 transition-colors cursor-pointer"
                          >
                            <MdClose className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-left px-4 md:px-10 mb-6 mt-4 text-2xl font-bold text-teal-700 underline">
                  Work fee or Hourly rate
                </div>
                <div className="p-5">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 text-lg font-medium">
                            Hourly rate <br />
                            <span className="text-sm text-gray-500 font-normal">
                              Total amount the client will see.
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <input
                                placeholder="₹ 0.00 / hr"
                                value={rate ? `₹${rate}` : ""}
                                onChange={handleRate}
                                className={`p-2 border rounded text-right w-48 outline-none focus:border-teal-500 transition-colors ${
                                  rateError ? "border-red-500" : "border-gray-300"
                                }`}
                              />
                              {rateError && <p className="text-red-500 text-xs">{rateError}</p>}
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 text-lg font-medium">
                            Service fee <br />
                            <span className="text-sm text-gray-500 font-normal">
                              This helps us run the platform and provide services like payment protection and customer support.
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <input
                              placeholder="₹ 0.00 / hr"
                              value={serviceFee ? `₹${serviceFee}` : ""}
                              readOnly
                              className="p-2 border border-gray-300 rounded text-right w-48 bg-gray-100 cursor-not-allowed"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 text-lg font-medium">
                            You'll get <br />
                            <span className="text-sm text-gray-500 font-normal">
                              The estimated amount you'll receive after service fees
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <input
                              placeholder="₹ 0.00 / hr"
                              readOnly
                              value={profit ? `₹${profit}` : ""}
                              className="p-2 border border-gray-300 rounded text-right w-48 bg-gray-100 cursor-not-allowed"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                {hasExperience === null && (
                  <div className="py-6 px-8 max-w-2xl mx-auto mt-12 bg-white shadow-xl rounded-3xl border border-gray-200 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                      Do you have any professional experience?
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                      <div
                        onClick={() => handleBoxClick("boxA")}
                        className={`flex flex-col justify-center items-center p-6 border rounded-xl w-60 h-44 cursor-pointer relative transition-all duration-300 ${
                          selectedBox === "boxA" ? "border-green-600 ring-2 ring-green-600/20 bg-green-50/10" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <MdCheckCircle size={28} className="text-teal-600 mb-2" />
                        <span className="text-teal-800 font-semibold text-lg text-center">
                          Yes, I have experience.
                        </span>
                        {selectedBox === "boxA" && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => handleBoxClick("boxB")}
                        className={`flex flex-col justify-center items-center p-6 border rounded-xl w-60 h-44 cursor-pointer relative transition-all duration-300 ${
                          selectedBox === "boxB" ? "border-green-600 ring-2 ring-green-600/20 bg-green-50/10" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <MdCancel size={28} className="text-teal-600 mb-2" />
                        <span className="text-teal-800 font-semibold text-lg text-center">
                          No, I don't have any experience.
                        </span>
                        {selectedBox === "boxB" && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleExperienceSubmit}
                        disabled={!selectedBox}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {hasExperience === true && (
                  <div className="flex flex-col gap-4 mt-12 text-left max-w-xl mx-auto">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Job Title</label>
                      <input
                        type="text"
                        placeholder="Ex: Full-stack developer"
                        value={jobTitleExp}
                        onChange={(e) => setJobTitleExp(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors ${
                          jobTitleErrorExp ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      {jobTitleErrorExp && <p className="text-red-500 text-xs mt-1">{jobTitleErrorExp}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Company</label>
                      <input
                        type="text"
                        placeholder="Ex: ABC Corp"
                        value={companyExp}
                        onChange={(e) => setCompanyExp(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors ${
                          companyExpError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      {companyExpError && <p className="text-red-500 text-xs mt-1">{companyExpError}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Duration</label>
                      <div className="w-full md:w-1/2">
                        <select
                          value={duration}
                          onChange={handleDurationChange}
                          className={`w-full p-2 border rounded outline-none bg-white transition-colors ${
                            durationError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                          }`}
                        >
                          <option value="">Select duration</option>
                          {durationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {durationError && <p className="text-red-500 text-xs mt-1">{durationError}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Overview</label>
                      <textarea
                        placeholder="Describe your role, responsibilities, and achievements"
                        value={expOverview}
                        onChange={(e) => setExpOverview(e.target.value)}
                        className={`w-full p-2 border rounded outline-none transition-colors h-32 ${
                          expOverviewError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"
                        }`}
                      />
                      {expOverviewError && <p className="text-red-500 text-xs mt-1">{expOverviewError}</p>}
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handlebackpage}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white font-semibold rounded hover:bg-blue-800 transition-colors cursor-pointer"
                      >
                        <FaArrowLeft className="text-sm" />
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                )}

                {hasExperience === false && (
                  <div className="flex flex-col items-center gap-4 mt-12 text-center">
                    <p className="text-lg text-gray-700">
                      Thank you for letting us know. You can proceed as a fresher.
                    </p>
                    <button
                      onClick={handlebackpage}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white font-semibold rounded hover:bg-blue-800 transition-colors cursor-pointer"
                    >
                      <FaArrowLeft className="text-sm" />
                      <span>Back</span>
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="flex mt-8 justify-between border-t border-gray-200 pt-6">
              <button
                disabled={activeStep === 0}
                onClick={handlePrev}
                className="px-5 py-2 border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={activeStep === steps.length - 1 && !preformSubmit}
                onClick={handleNext}
                className={`px-5 py-2 font-semibold rounded transition-colors cursor-pointer ${
                  activeStep === 2 ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-teal-500 hover:bg-teal-600 text-white"
                }`}
              >
                {activeStep === 2 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ProfileStart onProfileStart={handleProfileStart} user={user} />
      )}
    </>
  );
}
