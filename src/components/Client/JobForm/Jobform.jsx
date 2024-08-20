import React, { useState } from "react";
import "./Jobform.scss";
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
    <div className="dropdown-main-div">
      <div className="inner-wrap">
        <div className="dropdown">
          <p>
            Project Duration<span style={{ color: "red" }}>*</span>
          </p>
          <div onClick={toggleDropdown} className="item-div">
            <motion.h6 onClick={toggleDropdown}>
              {selectedItem ? selectedItem : "Select"}
            </motion.h6>
            <motion.div
              className="inside-drop"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <p onClick={toggleDropdown}>
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
                className="dropdown-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="item"
                  onClick={() => handleItemClick("Short term project")}
                >
                  Short term project
                </motion.div>
                <motion.div
                  className="item"
                  onClick={() => handleItemClick("Long term project")}
                >
                  Long term project
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {errors.selectedItem && (
            <p className="error">{errors.selectedItem}</p>
          )}
        </div>
        <div className="Template-name">
          <p>
            Job requirement Title <span style={{ color: "red" }}>*</span>
          </p>
          <div className="input">
            <input
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              type="text"
              placeholder="Please Type"
            />
          </div>
          {errors.jobRole && <p className="error">{errors.jobRole}</p>}
        </div>
      </div>
      <div className="skills-section">
        <p>
          Required Skills <span style={{ color: "red" }}>*</span>
        </p>
        <div className="input">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            type="text"
            placeholder="Add a skill"
          />
          <button className="btn-add" onClick={handleAddSkill}>
            Add Skill
          </button>
        </div>
        {errors.skills && <p className="error">{errors.skills}</p>}
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <span>{skill}</span>
              <IoMdClose onClick={() => handleRemoveSkill(index)} />
            </div>
          ))}
        </div>
      </div>
      <div className="budget-section">
        <p>
          Budget Type <span style={{ color: "red" }}>*</span>
        </p>
        <div className="input">
          <label className="child1">
            <input
              type="radio"
              value="fixed"
              checked={budgetType === "fixed"}
              onChange={() => handleBudgetTypeChange("fixed")}
            />
            Fixed Rate
          </label>
          <label className="child2">
            <input
              type="radio"
              value="hourly"
              checked={budgetType === "hourly"}
              onChange={() => handleBudgetTypeChange("hourly")}
            />
            Hourly Rate
          </label>
        </div>
        {budgetType === "fixed" && (
          <div className="input-fixed">
            <p className="input-text">
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
            />
          </div>
        )}
        {errors.budget && <p className="error">{errors.budget}</p>}
      </div>
      <div className="budget-wrap">
        {budgetType === "hourly" && (
          <div className="inner-wrap">
            <div className="budget-name">
              <p>
                Estimated amount<span style={{ color: "red" }}>*</span>
              </p>
              <div className="input">
                <input
                  value={wageRangeMin}
                  onChange={(e) =>
                    setWageRangeMin(e.target.value.replace(/\D/, ""))
                  }
                  type="text"
                  placeholder="From :₹ 0:00 "
                />
                <input
                  value={wageRangeMax}
                  onChange={(e) =>
                    setWageRangeMax(e.target.value.replace(/\D/, ""))
                  }
                  type="text"
                  placeholder="To : ₹ 0:00"
                />
              </div>
              {errors.wageRange && <p className="error">{errors.wageRange}</p>}
            </div>
            <div className="dropdown">
              <p>
                Estimated hours<span style={{ color: "red" }}>*</span>
              </p>
              <div onClick={toggleDropdownbudget} className="bud-div">
                <motion.h6 onClick={toggleDropdownbudget}>
                  {selecthour ? selecthour : "Select"}
                </motion.h6>
                <motion.div
                  className="inside-drop"
                  animate={{ rotate: isbudget ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p onClick={toggleDropdownbudget}>
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
                    className="dropdown-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="item"
                      onClick={() => handleItemClickbudget("0-6")}
                    >
                      0-6
                    </motion.div>
                    <motion.div
                      className="item"
                      onClick={() => handleItemClickbudget("0-8")}
                    >
                      0-8
                    </motion.div>
                    <motion.div
                      className="item"
                      onClick={() => handleItemClickbudget("0-16")}
                    >
                      0-16
                    </motion.div>
                    <motion.div
                      className="item"
                      onClick={() => handleItemClickbudget("16+")}
                    >
                      16+
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.selecthour && (
                <p className="error">{errors.selecthour}</p>
              )}
            </div>
          </div>
        )}
      </div>
     
      <div className="expiry-section">
        <p>
          Expiry Date <span style={{ color: "red" }}>*</span>
        </p>
        <div className="expiry-input">
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={date ? "" : "placeholder-opacity"}
          />
        </div>
        {errors.date && <p className="error">{errors.date}</p>}
      </div>
      <div className="place-section">
        <p>
         Place <span style={{ color: "red" }}>*</span>
        </p>
        <div className="place-input">
          <input
            type="text"
            value={place}
            onChange={(e) => setplace(e.target.value)}
            placeholder="please type"
          />
        </div>
        {errors.place && <p className="error">{errors.place}</p>}
      </div>
      <div className="overview-section">
        <p>
          Describe what you need <span style={{ color: "red" }}>*</span>
        </p>
        <div className="overview-body">
          <textarea
            className="overview-input"
            value={overviewInput}
            onChange={(e) => setOverviewInput(e.target.value)}
            placeholder="Describe your project requirements..."
            rows={4}
          />
        </div>
        {errors.overviewInput && (
          <p className="error">{errors.overviewInput}</p>
        )}
      </div>
      <div className="btn-4">
        <div className="l-b">
          <button onClick={handlePostCancel}>Cancel</button>
        </div>
        <div className="r-b">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
