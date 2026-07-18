import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { userProfileApi, editImageApi } from "../../utils/api/api";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { differenceInYears } from "date-fns";
import { setUser } from "../../utils/Redux/userSlice";
import { useDispatch } from "react-redux";
import ImageUploaderWithCrop from "./CroppedImage";

export default function EditableProfile({ userData, setUserData }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [rate, setRate] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [profit, setProfit] = useState("");
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editExperienceIndex, setEditExperienceIndex] = useState(null);
  const [editExperienceValue, setEditExperienceValue] = useState({
    jobTitle: "",
    company: "",
    duration: "",
    overview: "",
  });
  const [newExperience, setNewExperience] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [skillsError, setSkillsError] = useState("");

  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const handleImageChange = async () => {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "profile_image.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("image", file);

        const res = await userAxiosInstance.post(editImageApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data) {
          dispatch(setUser(res.data));
          setUserData(res.data);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    if (image !== null) {
      handleImageChange();
    }
  }, [image]);

  const handleSave = async () => {
    if (!editValue.trim()) {
      setErrorMessage(`${editField} should not be empty`);
      return;
    }
    const updatedData = { ...userData, [editField]: editValue };
    console.log("updated datas are ", updatedData);
    try {
      const res = await userAxiosInstance.post(userProfileApi, updatedData);
      if (res.data) {
        dispatch(setUser(res.data));
        setUserData(res.data);
        closeModal();
      }
    } catch (error) {
      console.error(error, "error in save userData");
    }
  };

  const handleSkillsSave = async () => {
    if (skills.length === 0) {
      setSkillsError("Please add at least one skill");
      return;
    }
    const filteredSkills = skills.filter((skill) => skill.trim() !== "");
    const updatedData = { ...userData, skills: filteredSkills };
    try {
      const res = await userAxiosInstance.post(userProfileApi, updatedData);
      if (res.data) {
        dispatch(setUser(res.data));
        setUserData(res.data);
        setIsSkillsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const age = differenceInYears(new Date(), new Date(dateOfBirth));
    return age;
  };

  const openModal = (field) => {
    setEditField(field);
    setErrorMessage("");
    if (field === "dateOfBirth" && userData[field]) {
      const date = new Date(userData[field]);
      const formattedDate = date.toISOString().split("T")[0];
      setEditValue(formattedDate);
    } else {
      setEditValue(userData[field] || "");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditField(null);
    setEditValue("");
    setErrorMessage("");
  };

  const openSkillsModal = () => {
    setSkills(userData?.skills || []);
    setSkillsError("");
    setIsSkillsModalOpen(true);
  };

  const closeSkillsModal = () => {
    setIsSkillsModalOpen(false);
    setSkillsError("");
  };

  const handleSkillChange = (index, event) => {
    const newSkills = [...skills];
    newSkills[index] = event.target.value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleExperienceSave = async () => {
    let updatedExperiences = [...(userData.experiences || [])];
    if (newExperience) {
      updatedExperiences.push(editExperienceValue);
    } else {
      updatedExperiences[editExperienceIndex] = editExperienceValue;
    }
    const updatedData = { ...userData, experiences: updatedExperiences };
    try {
      const res = await userAxiosInstance.post(userProfileApi, updatedData);
      if (res.data) {
        dispatch(setUser(res.data));
        setUserData(res.data);
        closeExperienceModal();
      }
    } catch (error) {
      console.error("Error updating experience:", error);
    }
  };

  const handleDeleteExperience = async (index) => {
    const updatedExperiences = userData.experiences.filter(
      (_, i) => i !== index
    );
    const updatedData = { ...userData, experiences: updatedExperiences };
    try {
      const res = await userAxiosInstance.post(userProfileApi, updatedData);
      if (res.data) {
        dispatch(setUser(res.data));
        setUserData(res.data);
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const openExperienceModal = (index = null) => {
    if (index !== null) {
      setEditExperienceIndex(index);
      setEditExperienceValue(userData.experiences[index]);
      setNewExperience(false);
    } else {
      setEditExperienceValue({
        jobTitle: "",
        company: "",
        duration: "",
        overview: "",
      });
      setNewExperience(true);
    }
    setIsExperienceModalOpen(true);
  };

  const closeExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setEditExperienceIndex(null);
    setEditExperienceValue({});
    setNewExperience(false);
  };

  const durationOptions = [
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "3 years", value: "3 years" },
    { label: "4 years", value: "4 years" },
    { label: "5 years", value: "5 years" },
    { label: "Above 5 years", value: "Above 5 years" },
  ];

  const handleImageCropped = (croppedImageUrl) => {
    setImage(croppedImageUrl);
  };

  useEffect(() => {
    if (userData?.hourlyRate) {
      const parsedRate = parseFloat(userData.hourlyRate);
      setRate(parsedRate);
      const calculatedServiceFee = parsedRate * 0.1;
      setServiceFee(calculatedServiceFee.toFixed(2));
      const calculatedProfit = parsedRate - calculatedServiceFee;
      setProfit(calculatedProfit.toFixed(2));
    }
  }, [userData]);

  return (
    <>
      <div className="flex justify-between w-full mb-5 text-left">
        <div className="flex items-start w-full">
          <ImageUploaderWithCrop
            user={userData}
            onImageCropped={handleImageCropped}
            imageError={imageError}
          />

          <div className="flex flex-col space-y-2 mt-5 w-1/2">
            <div className="relative group">
              <h2 className="font-semibold text-2xl text-teal-700 cursor-pointer pr-6">
                {userData?.name || ""}
                <FaEdit
                  onClick={() => openModal("name")}
                  className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
                />
              </h2>
            </div>
            <div className="relative group">
              <h2 className="font-semibold text-xl text-teal-700 cursor-pointer pr-6">
                {userData?.jobTitle || ""}
                <FaEdit
                  onClick={() => openModal("jobTitle")}
                  className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
                />
              </h2>
            </div>
            <div className="relative group">
              <h2 className="font-semibold text-sm text-teal-700 cursor-pointer pr-6">
                {`${calculateAge(userData?.dateOfBirth)} years` || "N/A"}
                <FaEdit
                  onClick={() => openModal("dateOfBirth")}
                  className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
                />
              </h2>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full">
          <div className="relative group mt-5">
            <h2 className="font-semibold text-md text-gray-700 cursor-pointer pr-6 relative group">
              {userData?.email || ""}
              <FaEdit
                onClick={() => openModal("email")}
                className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
              />
            </h2>
            <h2 className="font-semibold text-md text-gray-700 mt-3 pr-6 relative group">
              {userData?.phone || ""}
              <FaEdit
                onClick={() => openModal("phone")}
                className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
              />
            </h2>
            <h2 className="font-semibold text-md text-gray-700 mt-3 pr-6 relative group">
              {userData?.State || ""}
              <FaEdit
                onClick={() => openModal("State")}
                className="absolute top-0 right-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
              />
            </h2>
          </div>
        </div>
      </div>

      <hr className="mb-1 border-gray-300 shadow-md" />
      <hr className="mb-8 border-gray-300" />

      <div className="flex relative group text-left">
        <div className="pr-6 flex items-center">
          <span className="text-xl">{userData?.overview || ""}</span>
          <FaEdit
            onClick={() => openModal("overview")}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
          />
        </div>
      </div>
      <div className="px-5 pt-5 mb-[-0.5rem] mt-4 text-2xl font-bold text-teal-700 underline text-left">
        Work fee or Hourly rate
      </div>
      <div className="flex flex-col md:flex-row text-left">
        <div className="w-full p-5">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  <tr>
                    <td className="text-xl py-4">
                      Hourly rate <br />
                      <span className="text-sm mt-2 block text-gray-500">
                        Total amount the client will see.
                      </span>
                    </td>
                    <td className="text-right py-4">
                      <div className="relative inline-block">
                        <input
                          type="text"
                          value={`₹ ${rate}`}
                          placeholder="₹ 0:00 / hr"
                          className="border rounded p-2 text-right pr-10"
                          readOnly
                        />
                        <FaEdit
                          onClick={() => openModal("hourlyRate")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xl py-4">
                      Service fee <br />
                      <span className="text-sm mt-2 block text-gray-500">
                        This helps us run the platform and provide services like
                        payment protection and customer support.
                      </span>
                    </td>
                    <td className="text-right py-4">
                      <input
                        type="text"
                        value={`₹ ${serviceFee}`}
                        placeholder="₹ 0:00 / hr"
                        readOnly
                        className="border rounded p-2 text-right bg-gray-50"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xl py-4">
                      You'll get <br />
                      <span className="text-sm mt-2 block text-gray-500">
                        The estimated amount you'll receive after service fees
                      </span>
                    </td>
                    <td className="text-right py-4">
                      <input
                        type="text"
                        value={`₹ ${profit}`}
                        placeholder="₹ 0:00 / hr"
                        readOnly
                        className="border rounded p-2 text-right bg-gray-50"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 mt-4 text-2xl font-bold text-teal-700 underline flex items-center text-left">
        Skills
        <FaEdit
          onClick={openSkillsModal}
          className="text-teal-700 cursor-pointer text-xl ml-4"
        />
      </div>
      <div className="flex flex-wrap mx-5 text-left">
        {userData?.skills?.map((skill, index) => (
          <span
            key={index}
            className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="px-5 pb-5 mt-4 text-2xl font-bold text-teal-700 underline text-left">
        Experience
      </div>
      <div className="flex justify-end mx-5 text-left">
        <button
          onClick={() => openExperienceModal()}
          className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-white bg-teal-600 rounded-md shadow hover:bg-teal-700 focus:outline-none cursor-pointer"
        >
          <FaPlus className="mr-2" /> Add Experience
        </button>
      </div>
      <div className="flex flex-wrap mx-5 text-left w-full">
        {userData?.experiences?.map((experience, index) => (
          <div
            key={index}
            className="w-full p-4 mb-4 bg-gray-100 rounded-md relative group text-left"
          >
            <h3 className="text-xl font-semibold text-teal-800">
              {experience.jobTitle}
            </h3>
            <p className="text-sm text-teal-700 mt-1">
              <strong>Company:</strong> {experience.company}
            </p>
            <p className="text-sm text-teal-700">
              <strong>Duration:</strong> {experience.duration}
            </p>
            <p className="text-sm text-teal-700">
              <strong>Overview:</strong> {experience.overview}
            </p>
            <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FaEdit
                onClick={() => openExperienceModal(index)}
                className="cursor-pointer text-gray-500 hover:text-teal-600"
              />
              <FaTrash
                onClick={() => handleDeleteExperience(index)}
                className="cursor-pointer text-gray-500 hover:text-teal-600"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Experience Modal */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {newExperience ? "Add Experience" : "Edit Experience"}
              </h3>
              <button
                onClick={closeExperienceModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editExperienceValue.jobTitle || ""}
                  onChange={(e) =>
                    setEditExperienceValue({
                      ...editExperienceValue,
                      jobTitle: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={editExperienceValue.company || ""}
                  onChange={(e) =>
                    setEditExperienceValue({
                      ...editExperienceValue,
                      company: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                <select
                  value={editExperienceValue.duration || ""}
                  onChange={(e) =>
                    setEditExperienceValue({
                      ...editExperienceValue,
                      duration: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Overview</label>
                <textarea
                  value={editExperienceValue.overview || ""}
                  onChange={(e) =>
                    setEditExperienceValue({
                      ...editExperienceValue,
                      overview: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none h-24"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleExperienceSave}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={closeExperienceModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Modal */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Edit Skills</h3>
              <button
                onClick={closeSkillsModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-2 gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e)}
                      placeholder={`Skill ${index + 1}`}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <FaTrash
                      onClick={() => removeSkill(index)}
                      className="text-red-500 cursor-pointer hover:text-red-700 flex-shrink-0"
                    />
                  </div>
                ))}
                <button
                  onClick={addSkill}
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 border border-teal-600 text-teal-600 rounded text-sm font-semibold hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  <FaPlus className="text-xs" />
                  <span>Add Skill</span>
                </button>
              </div>
              {skillsError && <p className="text-red-500 text-sm mt-2">{skillsError}</p>}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSkillsSave}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={closeSkillsModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Edit {editField}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{editField}</label>
                {editField === "overview" ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none h-32"
                  />
                ) : editField === "dateOfBirth" ? (
                  <input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                )}
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
