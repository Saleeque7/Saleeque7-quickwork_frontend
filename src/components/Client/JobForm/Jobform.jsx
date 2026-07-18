import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDropupCircle,
  IoMdClose,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clientAxiosInstance } from "../../../utils/api/privateAxios";
import { jobSubmit } from "../../../utils/api/api";
import { toast } from "react-toastify";

export default function Jobform() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("fixed");
  const [wageRangeMin, setWageRangeMin] = useState("");
  const [wageRangeMax, setWageRangeMax] = useState("");
  const [selecthour, setSelecthour] = useState("");
  const [overviewInput, setOverviewInput] = useState("");
  const [isbudget, setisbudget] = useState(false);
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState("");
  const [place, setplace] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 2000);

    return () => clearTimeout(timer);
  }, [errors]);

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCancel = () => {
    setSelectedItem("");
    setIsOpen(false);
  };
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
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

  const validateForm = () => {
    const newErrors = {};
    if (!selectedItem) newErrors.selectedItem = "Project duration is required.";
    if (!jobRole) newErrors.jobRole = "Job requirement title is required.";
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
    if (!date) {
      newErrors.date = "Date is required.";
    } else {
      const selectedDate = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate <= currentDate) {
        newErrors.date = "The selected date must be in the future.";
      }
    }
    if (!overviewInput) newErrors.overviewInput = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        const formData = {
          selectedItem,
          jobRole,
          skills,
          budgetType,
          overviewInput,
          Expirydate:date,
          Place:place
        };

        if (budgetType === "fixed") {
          formData.budget = budget;
        } else if (budgetType === "hourly") {
          formData.wageRangeMin = wageRangeMin;
          formData.wageRangeMax = wageRangeMax;
          formData.selecthour = selecthour;
        }
        const res = await clientAxiosInstance.post(jobSubmit, formData);
        const id = res.data.jobPost._id;
        if (id && res.data) {
          toast.success("success", {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate(`/client/listjobs/${id}`);
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("Failed to submit job", {
        autoClose: 1000,
        closeButton: true,
        draggable: true,
      });

      console.error(error);
    }
  };

  const handlePostCancel = () => {
    navigate(-1);
  };
  
  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (e.target.value) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };

  return (
    <div className="m-5 md:m-[20px_10px_10px_89px] min-h-[200px] rounded-md p-4 md:p-[20px] shadow-[0_5px_15px_rgba(0,0,0,0.15)] bg-white">
      <div className="flex flex-col md:flex-row justify-between p-4 gap-6">
        <div className="w-full md:w-[48%] relative">
          <p className="font-sans font-medium text-sm text-gray-800">
            Project Duration<span className="text-red-500">*</span>
          </p>
          <div onClick={toggleDropdown} className="w-full mt-2.5 p-[8px_12px] border border-gray-200 rounded-md flex items-center justify-between cursor-pointer">
            <motion.h6 className="font-sans font-semibold text-xs text-gray-500">
              {selectedItem ? selectedItem : "Select"}
            </motion.h6>
            <motion.div
              className="flex justify-center items-center gap-1 text-gray-500"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                {isOpen ? (
                  <IoMdArrowDropupCircle className="text-lg" />
                ) : (
                  <IoMdArrowDropdownCircle className="text-lg" />
                )}
              </div>
              {isOpen && (
                <div onClick={(e) => { e.stopPropagation(); handleCancel(); }}>
                  <IoMdClose className="text-lg hover:text-red-500" />
                </div>
              )}
            </motion.div>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="w-full overflow-hidden flex flex-col mt-1 bg-white border border-gray-200 rounded shadow-lg absolute z-10"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="p-[8px_12px] hover:bg-gray-100 font-sans font-medium text-xs cursor-pointer border-b border-gray-100"
                  onClick={() => handleItemClick("Short term project")}
                >
                  Short term project
                </motion.div>
                <motion.div
                  className="p-[8px_12px] hover:bg-gray-100 font-sans font-medium text-xs cursor-pointer"
                  onClick={() => handleItemClick("Long term project")}
                >
                  Long term project
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {errors.selectedItem && (
            <p className="text-red-500 text-xs mt-1">{errors.selectedItem}</p>
          )}
        </div>
        <div className="w-full md:w-[48%]">
          <p className="font-sans font-medium text-sm text-gray-800">
            Job requirement Title <span className="text-red-500">*</span>
          </p>
          <div className="w-full pt-2.5">
            <input
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              type="text"
              placeholder="Please Type"
              className="w-full p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors"
            />
          </div>
          {errors.jobRole && <p className="text-red-500 text-xs mt-1">{errors.jobRole}</p>}
        </div>
      </div>

      <div className="p-4">
        <p className="font-sans font-medium text-sm text-gray-800">
          Required Skills <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center gap-3 mt-2.5 w-full md:w-[60%]">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            type="text"
            placeholder="Add a skill"
            className="flex-1 p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors"
          />
          <button 
            className="p-[8px_16px] rounded border border-teal-600 text-teal-600 bg-transparent font-sans font-medium text-xs cursor-pointer hover:bg-teal-600 hover:text-white transition-colors"
            onClick={handleAddSkill}
          >
            Add Skill
          </button>
        </div>
        {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
        <div className="mt-2.5 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 p-[5px_10px] rounded-md">
              <span className="font-sans font-medium text-xs text-gray-700">{skill}</span>
              <IoMdClose className="cursor-pointer text-blue-900 hover:text-red-500" onClick={() => handleRemoveSkill(index)} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <p className="font-sans font-medium text-sm text-gray-800">
          Budget Type <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center gap-6 mt-2.5">
          <label className="flex items-center gap-2 font-sans font-medium text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              value="fixed"
              checked={budgetType === "fixed"}
              onChange={() => handleBudgetTypeChange("fixed")}
              className="accent-teal-600"
            />
            Fixed Rate
          </label>
          <label className="flex items-center gap-2 font-sans font-medium text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              value="hourly"
              checked={budgetType === "hourly"}
              onChange={() => handleBudgetTypeChange("hourly")}
              className="accent-teal-600"
            />
            Hourly Rate
          </label>
        </div>
        {budgetType === "fixed" && (
          <div className="pl-0 md:pl-[50px] mt-4">
            <p className="font-sans font-medium text-xs text-gray-600">
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
              className="w-[150px] p-[8px_12px] rounded border border-gray-300 font-sans font-medium text-xs outline-none bg-transparent mt-3 focus:border-teal-500 transition-colors"
            />
          </div>
        )}
        {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
      </div>

      <div className="p-4">
        {budgetType === "hourly" && (
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="w-full md:w-[48%]">
              <p className="font-sans font-medium text-sm text-gray-800">
                Estimated amount<span className="text-red-500">*</span>
              </p>
              <div className="flex gap-4 mt-2">
                <input
                  value={wageRangeMin}
                  onChange={(e) =>
                    setWageRangeMin(e.target.value.replace(/\D/, ""))
                  }
                  type="text"
                  placeholder="From :₹ 0:00 "
                  className="flex-1 p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors"
                />
                <input
                  value={wageRangeMax}
                  onChange={(e) =>
                    setWageRangeMax(e.target.value.replace(/\D/, ""))
                  }
                  type="text"
                  placeholder="To : ₹ 0:00"
                  className="flex-1 p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors"
                />
              </div>
              {errors.wageRange && <p className="text-red-500 text-xs mt-1">{errors.wageRange}</p>}
            </div>
            
            <div className="w-full md:w-[48%] relative">
              <p className="font-sans font-medium text-sm text-gray-800">
                Estimated hours<span className="text-red-500">*</span>
              </p>
              <div onClick={toggleDropdownbudget} className="w-full mt-2.5 p-[8px_12px] border border-gray-200 rounded-md flex items-center justify-between cursor-pointer">
                <motion.h6 className="font-sans font-semibold text-xs text-gray-500">
                  {selecthour ? selecthour : "Select"}
                </motion.h6>
                <motion.div
                  className="flex justify-center items-center gap-1 text-gray-500"
                  animate={{ rotate: isbudget ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    {isbudget ? (
                      <IoMdArrowDropupCircle className="text-lg" />
                    ) : (
                      <IoMdArrowDropdownCircle className="text-lg" />
                    )}
                  </div>
                  {isbudget && (
                    <div onClick={(e) => { e.stopPropagation(); handleCancelbudget(); }}>
                      <IoMdClose className="text-lg hover:text-red-500" />
                    </div>
                  )}
                </motion.div>
              </div>
              <AnimatePresence>
                {isbudget && (
                  <motion.div
                    className="w-full overflow-hidden flex flex-col mt-1 bg-white border border-gray-200 rounded shadow-lg absolute z-10"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {["0-6", "0-8", "0-16", "16+"].map((hr) => (
                      <motion.div
                        key={hr}
                        className="p-[8px_12px] hover:bg-gray-100 font-sans font-medium text-xs cursor-pointer border-b border-gray-100 last:border-0"
                        onClick={() => handleItemClickbudget(hr)}
                      >
                        {hr}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.selecthour && (
                <p className="text-red-500 text-xs mt-1">{errors.selecthour}</p>
              )}
            </div>
          </div>
        )}
      </div>
     
      <div className="p-4">
        <p className="font-sans font-medium text-sm text-gray-800">
          Expiry Date <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center mt-2.5 w-full md:w-[40%]">
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={`flex-1 p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors ${date ? "" : "opacity-50"}`}
          />
        </div>
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>
      
      <div className="p-4">
        <p className="font-sans font-medium text-sm text-gray-800">
          Place <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center mt-2.5 w-full md:w-[40%]">
          <input
            type="text"
            value={place}
            onChange={(e) => setplace(e.target.value)}
            placeholder="please type"
            className="flex-1 p-[8px_12px] rounded border border-gray-200 font-sans font-medium text-xs outline-none bg-transparent focus:border-teal-500 transition-colors"
          />
        </div>
        {errors.place && <p className="text-red-500 text-xs mt-1">{errors.place}</p>}
      </div>

      <div className="p-4">
        <p className="font-sans font-medium text-sm text-gray-800">
          Describe what you need <span className="text-red-500">*</span>
        </p>
        <div className="mt-5">
          <textarea
            className="w-full md:w-[80%] p-4 border border-gray-300 rounded-md text-sm resize-y focus:border-teal-500 outline-none transition-colors"
            value={overviewInput}
            onChange={(e) => setOverviewInput(e.target.value)}
            placeholder="Describe your project requirements..."
            rows={4}
          />
        </div>
        {errors.overviewInput && (
          <p className="text-red-500 text-xs mt-1">{errors.overviewInput}</p>
        )}
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200 pt-6 mt-6">
        <div>
          <button 
            onClick={handlePostCancel}
            className="rounded-md py-2 px-8 text-gray-500 border border-gray-300 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        <div>
          <button 
            onClick={handleSubmit}
            className="rounded-md py-2 px-8 bg-teal-600 text-white hover:bg-white hover:text-teal-600 hover:border-teal-600 border border-transparent font-medium transition-all cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
