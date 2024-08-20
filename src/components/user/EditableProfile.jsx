import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { userProfileApi, editImageApi } from "../../utils/api/api";
import { userAxiosInstance } from "../../utils/api/privateAxios";
import { differenceInYears } from "date-fns";
import { setUser } from "../../utils/Redux/userSlice";
import { useDispatch  } from "react-redux";
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

  const [image, setImage] = useState( null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const handleImageChange = async () => {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "profile_image.jpg", { type: blob.type });
 
        const formData = new FormData();     
        formData.append("image", file);      
      
        const res = await userAxiosInstance.post(editImageApi, formData,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if(res.data){
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
      setSkillsError("Skills cannot be empty.");
      return;
    }
    if (skills.includes("")) {
      setSkillsError(
        "Please fill in all skill fields before adding a new one."
      );
      return;
    }
    const updatedData = { ...userData, skills };
    try {
      const res = await userAxiosInstance.put(userProfileApi, updatedData);
      console.log(res.data);
      if (res.data) {
        setUserData(res.data);
        setIsSkillsModalOpen(false);
      }
    } catch (error) {
      console.error(error, "error in save skills");
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    return differenceInYears(today, birth);
  };

  const setUserrate = (rate) => {
    const ser = (rate * 10) / 100;
    const pro = rate - ser;
    setRate(rate);
    setServiceFee(ser);
    setProfit(pro);
  };

  useEffect(() => {
    if (userData?.hourlyRate) {
      setUserrate(userData?.hourlyRate);
    }
  }, [userData?.hourlyRate]);

  useEffect(() => {
    if (userData?.skills) {
      setSkills(userData?.skills);
    }
  }, [userData?.skills]);

  const openModal = (field) => {
    if (field === "") return;
    setEditField(field);
    if (field === "dateOfBirth") {
      setEditValue(
        userData[field]
          ? new Date(userData[field]).toISOString().split("T")[0]
          : ""
      );
    } else {
      setEditValue(userData[field] || "");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditField(null);
    setErrorMessage("");
    setEditValue("");
  };

  const openSkillsModal = () => {
    setIsSkillsModalOpen(true);
  };

  const closeSkillsModal = () => {
    setSkillsError("");
    setIsSkillsModalOpen(false);
  };

  const handleSkillChange = (index, event) => {
    const newSkills = [...skills];
    newSkills[index] = event.target.value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    if (skills.includes("")) {
      setSkillsError(
        "Please fill in all skill fields before adding a new one."
      );
      return;
    }

    setSkills([...skills, ""]);
    setSkillsError("");
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };
  const handleExperienceSave = async () => {
    const updatedExperiences = [...userData.experiences];
    if (newExperience) {
      updatedExperiences.push(editExperienceValue);
    } else {
      updatedExperiences[editExperienceIndex] = editExperienceValue;
    }
    const updatedData = { ...userData, experiences: updatedExperiences };
    try {
      const res = await userAxiosInstance.put(userProfileApi, updatedData);
      console.log(res.data);
      if (res.data) {
        setUserData(res.data);
        closeExperienceModal();
      }
    } catch (error) {
      console.error(error, "error in save experience");
    }
  };
  const handleDeleteExperience = async (index) => {
    const updatedExperiences = userData.experiences.filter(
      (_, i) => i !== index
    );
    const updatedData = { ...userData, experiences: updatedExperiences };
    try {
      const res = await userAxiosInstance.put(userProfileApi, updatedData);
      if (res.data) {
        setUserData(res.data);
      }
    } catch (error) {
      console.error(error, "error in delete experience");
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

  // if (!image.trim()) {
  //   setErrorWithTimeout(setImageError, "Please add an image");
  //   isValid = false;
  // } else {
  //   setImageError("");
  // }

  return (
    <>
      <div className="flex justify-between w-full mb-5">
        <div className="flex  items-start w-full">
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
            <h2 className="font-semibold text-md text-gray-700 cursor-pointer pr-6">
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

      <hr className="mb-1 border-gray-300  shadow-md" />
      <hr className="mb-8 border-gray-300" />


      <div className="flex  relative group">
        <div className="pr-6 flex items-center">
          <span className="text-xl">{userData?.overview || ""}</span>
          <FaEdit
            onClick={() => openModal("overview")}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 hover:text-teal-600"
          />
        </div>
      </div>
      <div className="px-5 pt-5 mb-[-0.5rem] mt-4 text-2xl font-bold text-teal-700 underline">
        Work fee or Hourly rate
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
                      <span className="text-sm mt-2 block">
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
                        className="border rounded p-2 text-right"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xl py-4">
                      You'll get <br />
                      <span className="text-sm mt-2 block">
                        The estimated amount you'll receive after service fees
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
      <div className="px-5 pb-5 mt-4 text-2xl font-bold text-teal-700 underline flex items-center">
        Skills
        <FaEdit
          onClick={openSkillsModal}
          className="text-teal-700 cursor-pointer text-xl ml-4"
        />
      </div>
      <div className="flex flex-wrap mx-5">
        {userData?.skills?.map((skill, index) => (
          <span
            key={index}
            className="font-sans text-sm p-2 px-4 bg-teal-100 text-teal-800 rounded-md mr-4 mb-4"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="px-5 pb-5 mt-4 text-2xl font-bold text-teal-700 underline">
        Experience
      </div>
      <div className="flex justify-end mx-5">
        <button
          onClick={() => openExperienceModal()}
          className="flex items-center px-4 py-2 mb-4 text-sm font-medium text-white bg-teal-600 rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <FaPlus className="mr-2" /> Add Experience
        </button>
      </div>
      <div className="flex flex-wrap mx-5">
        {userData?.experiences?.map((experience, index) => (
          <div
            key={index}
            className="w-full p-4 mb-4 bg-gray-100 rounded-md relative group"
          >
            <h3 className="text-xl font-semibold text-teal-800">
              {experience.jobTitle}
            </h3>
            <p className="text-sm text-teal-700">
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
      <Modal isOpen={isExperienceModalOpen} onClose={closeExperienceModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {newExperience ? "Add Experience" : "Edit Experience"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Job Title</FormLabel>
              <Input
                value={editExperienceValue.jobTitle}
                onChange={(e) =>
                  setEditExperienceValue({
                    ...editExperienceValue,
                    jobTitle: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Company</FormLabel>
              <Input
                value={editExperienceValue.company}
                onChange={(e) =>
                  setEditExperienceValue({
                    ...editExperienceValue,
                    company: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Duration</FormLabel>
              <Select
                value={editExperienceValue.duration}
                placeholder="Select duration"
                onChange={(e) =>
                  setEditExperienceValue({
                    ...editExperienceValue,
                    duration: e.target.value,
                  })
                }
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Overview</FormLabel>
              <Textarea
                value={editExperienceValue.overview}
                onChange={(e) =>
                  setEditExperienceValue({
                    ...editExperienceValue,
                    overview: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleExperienceSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeExperienceModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSkillsModalOpen} onClose={closeSkillsModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Skills</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Skills</FormLabel>
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e)}
                    placeholder={`Skill ${index + 1}`}
                    className="mr-2"
                  />
                  <FaTrash
                    onClick={() => removeSkill(index)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              ))}
              <Button
                colorScheme="teal"
                size="sm"
                onClick={addSkill}
                leftIcon={<FaPlus />}
              >
                Add Skill
              </Button>
            </FormControl>
            {skillsError && <p className="text-red-500 mt-2">{skillsError}</p>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSkillsSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeSkillsModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {editField}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{editField}</FormLabel>
              {editField === "overview" ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : editField === "dateOfBirth" ? (
                <Input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              )}
            </FormControl>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
