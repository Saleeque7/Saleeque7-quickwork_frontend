import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useParams ,useNavigate } from "react-router-dom";
import { browseJobApi ,jobSubmit } from "../../utils/api/api";
import { clientAxiosInstance } from "../../utils/api/privateAxios";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDropupCircle,
  IoMdClose,
} from "react-icons/io";
import { toast } from "react-toastify";


const JobPostForm = () => {
  const navigate = useNavigate()
  const { action , jobId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [projectTerm, setProjectTerm] = useState("");
  const [budgetType, setBudgetType] = useState("fixed");
  const [budget, setBudget] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [wageRangeMin, setWageRangeMin] = useState("");
  const [wageRangeMax, setWageRangeMax] = useState("");
  const [selecthour, setSelecthour] = useState("");
  const [isbudget, setisbudget] = useState(false);
  const [errors, setErrors] = useState({});

  

  const validateForm = () => {
    const newErrors = {};
    if (!projectTerm) newErrors.projectTerm = "Project duration is required.";
    if (!jobRole) newErrors.jobRole = "Job  title is required.";
    if (skills.length === 0)
      newErrors.skills = "At least one skill is required.";
    if (budgetType === "fixed" && !budget)
      newErrors.budget = "Budget is required.";
    if (budgetType === "hourly") {
      if (!wageRangeMin || !wageRangeMax)
        newErrors.wageRange = "Wage range is required.";
      if (!selecthour) newErrors.selecthour = "Estimated hours are required.";
      if (wageRangeMin <= 0)
        newErrors.wageRange = "Hourly rate must be greater than 100.";
      if (wageRangeMax <= wageRangeMin)
        newErrors.wageRange =
          "To range cannot be less than or equal to from range.";
      if (wageRangeMin < 100)
        newErrors.wageRange = "Hourly rate must be greater than 100.";
    }
    if(!place)
    newErrors.place ="place is required."
    if (!expiryDate) {
      newErrors.expiryDate = "Date is required.";
    } else {
      const selectedDate = new Date(expiryDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate <= currentDate) {
        newErrors.expiryDate = "The selected date must be in the future.";
      }
    }
    if (!description) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await clientAxiosInstance.get(
        `${browseJobApi}?id=${jobId}`
      );
      console.log(response.data);

      const data = response.data;
      setProjectTerm(data.projectTerm);
      setJobRole(data.jobRole);
      setSkills(data.skills);
      const formattedDate = new Date(data.Expirydate).toISOString().split('T')[0];
      setExpiryDate(formattedDate);
      setPlace(data.Place)
      setDescription(data.description)
      setBudgetType(data.budgetType)
      if(data.budgetType === 'hourly'){
        setWageRangeMin(data.wageRangeMin)
        setWageRangeMax(data.wageRangeMax)
        setSelecthour(data.selecthour)
      }else{
        setBudget(data.budget)
      }
    };
    if (jobId !== null) fetchData();
  }, [jobId,action]);




  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill(""); // Clear input after adding the skill
    }
    // if( !skills.includes(newSkill.trim())){

    // }
  };


  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };


  const handleSave = async () => {
    try {
      if (validateForm()) {
        const formData = {
          projectTerm,
          jobRole,
          skills,
          budgetType,
          description,
          Expirydate: expiryDate,
          Place: place
        };
  
        if (budgetType === "fixed") {
          formData.budget = budget;
        } else if (budgetType === "hourly") {
          formData.wageRangeMin = wageRangeMin;
          formData.wageRangeMax = wageRangeMax;
          formData.selecthour = selecthour;
        }
        
        console.log(formData, "form");
        
        const res = await clientAxiosInstance.put(jobSubmit, { formData, jobId ,action});
  
        if (res.data.jobPost && res.data.jobPost._id) {

          if(action === 'Repost'){
            toast.success(res.data.message || "Job successfully updated!", {
              autoClose: 1000,
              closeButton: true,
              draggable: true,
            });
            setTimeout(() => {
              navigate('/client/joblisted');
            }, 1000);
          }else if( action === 'Edit'){
            toast.success(res.data.message || "Job successfully updated!", {
              autoClose: 1000,
              closeButton: true,
              draggable: true,
            });
            setTimeout(() => {
              navigate(`/client/listjobs/${res.data.jobPost._id}`);
            }, 1000);
          }
        } else {
          throw new Error("Failed to update job post.");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit job", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });
      console.error(error);
    }
  };
  


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (term) => {
    setProjectTerm(term);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false); // Closes the dropdown
  };
  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
  };
  const toggleDropdownbudget = () => {
    setisbudget(!isbudget);
  };

  const handleItemClickbudget = (item) => {
    setSelecthour(item);
    setisbudget(false);
  };
  const handleCancelbudget = () => {
    setSelecthour("");
    setisbudget(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 2000);

    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <div className="bg-gray-100 p-5 py-16 ">
      <h1 className="flex items-center justify-center text-teal-900 text-4xl font-semibold">
        {action === 'Repost' ? 'Repost Job' : 'Edit JobForm'}
      </h1>
      <div className="mx-24 my-8 min-h-[200px] rounded-md p-4 shadow-md bg-white">
        <div className="flex flex-col md:flex-row justify-between p-4">
          <div className="w-full md:w-[48%]">
            <p className="font-poppins font-medium text-sm">
              Project Duration<span style={{ color: "red" }}>*</span>
            </p>
            <div
              onClick={toggleDropdown}
              className="w-full mt-2 p-2 border border-gray-200 rounded-md flex items-center justify-between"
            >
              <motion.h6
                onClick={toggleDropdown}
                className="font-poppins font-semibold text-xs text-gray-500"
              >
                {projectTerm ? projectTerm : "Select"}
              </motion.h6>
              <motion.div
                className="flex justify-center items-center"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  onClick={toggleDropdown}
                  className="text-center font-semibold text-lg"
                >
                  {isOpen ? (
                    <IoMdArrowDropupCircle />
                  ) : (
                    <IoMdArrowDropdownCircle />
                  )}
                </p>
                {isOpen && (
                  <motion.p onClick={handleCancel}>
                    <IoMdClose />
                  </motion.p>
                )}
              </motion.div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="w-full overflow-hidden justify-start items-center"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="p-1 rounded-sm border border-gray-200 mb-0.5 font-poppins font-medium text-xs"
                    onClick={() => handleItemClick("Short term project")}
                  >
                    Short term project
                  </motion.div>
                  <motion.div
                    className="p-1 rounded-sm border border-gray-200 mb-0.5 font-poppins font-medium text-xs mt-1"
                    onClick={() => handleItemClick("Long term project")}
                  >
                    Long term project
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {errors.projectTerm && <p className="error">{errors.projectTerm}</p>}

          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-poppins font-medium text-sm">
              Job requirement Title <span style={{ color: "red" }}>*</span>
            </p>
            <div className="w-full pt-2">
              <input
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                type="text"
                placeholder="Please Type"
                className="w-full px-2 py-1.5 rounded border border-gray-200 font-poppins font-medium text-sm outline-none bg-transparent"
              />
            </div>

            {errors.jobRole && <p className="text-red-500">{errors.jobRole}</p>}
          </div>
        </div>

        <div className="p-4">
          <p className="font-poppins font-medium text-sm">Skills</p>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="w-1/2 px-2 py-1.5 rounded border border-gray-200 font-poppins font-medium text-sm outline-none bg-transparent"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-1.5 border border-teal-500 text-teal-500 rounded-md font-poppins font-medium text-sm hover:bg-teal-500 hover:text-white "
            >
              Add Skill
            </button>
          </div>

          <div className="mt-2 flex flex-wrap">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center bg-gray-200 p-2 rounded-md mr-2 mb-2"
              >
                <span className="font-poppins font-medium text-sm">
                  {skill}
                </span>
                <FaTimes
                  className="ml-2 cursor-pointer text-primary"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </div>
            ))}
          </div>
          {errors.skills && <p className="text-red-500">{errors.skills}</p>}

        </div>

        <div className="p-4">
          <p className="font-poppins font-medium text-sm">
            Budget Type <span className="text-red-500">*</span>
          </p>
          <div className="flex mt-2 space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="fixed"
                checked={budgetType === "fixed"}
                onChange={() => handleBudgetTypeChange("fixed")}
                className="form-radio text-teal-500"
              />
              <span>Fixed Rate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="hourly"
                checked={budgetType === "hourly"}
                onChange={() => handleBudgetTypeChange("hourly")}
                className="form-radio text-teal-500"
              />
              <span>Hourly Rate</span>
            </label>
          </div>
          {budgetType === "fixed" && (
            <div className="mt-4">
              <p className="font-poppins text-sm my-5 mx-5">
                What is the best cost estimate for your project?
                <br />
                You can negotiate this cost and create milestones when you chat
                with your freelancer.
              </p>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/\D/, ""))}
                type="text"
                placeholder="₹ 0:00 "
                className="w-1/4 mt-2 px-2 py-1.5 rounded border border-gray-200 font-poppins text-sm outline-none bg-transparent text-right"
              />
            </div>
          )}
          {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget}</p>}
        </div>
        <div className="flex p-4  justify-between">
          {budgetType === "hourly" && (
            <div className="flex flex-col space-y-4">
              <div className="w-full">
                <p className="font-poppins font-medium text-sm">
                  Estimated amount<span className="text-red-500">*</span>
                </p>
                <div className="flex mt-2 space-x-2">
                  <input
                    value={wageRangeMin}
                    onChange={(e) =>
                      setWageRangeMin(e.target.value.replace(/\D/, ""))
                    }
                    type="text"
                    placeholder="From :₹ 0:00 "
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md"
                  />
                  <input
                    value={wageRangeMax}
                    onChange={(e) =>
                      setWageRangeMax(e.target.value.replace(/\D/, ""))
                    }
                    type="text"
                    placeholder="To : ₹ 0:00"
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md"
                  />
                </div>
                {errors.wageRange && <p className="text-red-500 text-sm mt-2">{errors.wageRange}</p>}
              </div>

              <div>
                <p className="font-poppins font-medium text-sm">
                  Estimated hours<span className="text-red-500">*</span>
                </p>
                <div
                  onClick={toggleDropdownbudget}
                  className="w-full mt-2 p-2 border border-gray-200 rounded-md flex items-center justify-between cursor-pointer"
                >
                  <motion.h6
                    onClick={toggleDropdownbudget}
                    className="font-poppins font-semibold text-xs text-gray-500"
                  >
                    {selecthour ? selecthour : "Select"}
                  </motion.h6>
                  <motion.div
                    className="flex items-center"
                    animate={{ rotate: isbudget ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-center font-semibold text-lg">
                      {isbudget ? (
                        <IoMdArrowDropupCircle />
                      ) : (
                        <IoMdArrowDropdownCircle />
                      )}
                    </p>
                    {isbudget && (
                      <motion.p onClick={handleCancelbudget}>
                        <IoMdClose />
                      </motion.p>
                    )}
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isbudget && (
                    <motion.div
                      className="w-full mt-2 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="p-1 rounded-sm border border-gray-200 mb-1 font-poppins text-xs cursor-pointer"
                        onClick={() => handleItemClickbudget("0-6")}
                      >
                        0-6
                      </motion.div>
                      <motion.div
                        className="p-1 rounded-sm border border-gray-200 mb-1 font-poppins text-xs cursor-pointer"
                        onClick={() => handleItemClickbudget("0-8")}
                      >
                        0-8
                      </motion.div>
                      <motion.div
                        className="p-1 rounded-sm border border-gray-200 mb-1 font-poppins text-xs cursor-pointer"
                        onClick={() => handleItemClickbudget("0-16")}
                      >
                        0-16
                      </motion.div>
                      <motion.div
                        className="p-1 rounded-sm border border-gray-200 mb-1 font-poppins text-xs cursor-pointer"
                        onClick={() => handleItemClickbudget("16+")}
                      >
                        16+
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.selecthour && <p className="text-red-500 text-sm mt-2">{errors.selecthour}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="font-poppins font-medium text-sm">
            Expiry Date<span className="text-red-500">*</span>
          </p>
          <div className="mt-2 flex">
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-1/3 px-2 py-1.5 rounded border border-gray-200 font-poppins font-medium text-sm outline-none bg-transparent"
            />
          </div>
          {errors.expiryDate && <p className="text-red-500">{errors.expiryDate}</p>}

        </div>

        <div className="p-4">
          <p className="font-poppins font-medium text-sm">Place <span className="text-red-500">*</span></p>
          <div className="mt-2 flex">
            <input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-1/2 px-2 py-1.5 rounded border border-gray-200 font-poppins font-medium text-sm outline-none bg-transparent"
            />
          </div>
          {errors.place && <p className="text-red-500">{errors.place}</p>}
        </div>

        <div className="p-4">
          <p className="font-poppins font-medium text-sm">
            Overview<span className="text-red-500">*</span>
          </p>
          <div className="mt-2">
            <textarea
              rows="4"
              placeholder="Job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
            ></textarea>
          </div>
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex justify-end p-4">
         {action === 'Edit' && 
       (  <button
            onClick={handleSave}
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white hover:bg-teal-500"
          >
            Save
          </button>)
          }
         {action === 'Repost' && 
       (  <button
            onClick={handleSave}
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white hover:bg-teal-500"
          >
            Post Job
          </button>)
          }
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;
