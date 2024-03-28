import React from "react";
import { CandidateContext } from "../CreateContext";
import { useState } from "react";

export const CandidateProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filledData, setFilledData] = useState({});
  const [history, setHistory] = useState([]);
  const [phone, setPhone] = useState("");
  const [firstPhone, setFirstPhone] = useState("");
  const [secondPhone, setSecondPhone] = useState("");
  const [relocate, setRelocate] = useState(false);
  const [otherOffer, setOtherOffer] = useState(false);
  const [otherReason, setOtherReason] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [file, setFile] = useState(null);
  const [sendRejectionEmail, setSendRejectionEmail] = useState(null);
  const [formErrors, setFormErrors] = useState({
    current_ctc: "",
    expected_ctc: "",
    negotiated_ctc: "",
    offered_salary: "",
  });
  const [currentRound, setCurrentRound] = useState("");
  const [hired, setHired] = useState(false);
  const [softSkills, setSoftSkills] = useState({
    attitudeFeedback: "",
    logicalFeedback: "",
    analyticalFeedback: "",
    confidenceFeedback: "",
    communicationFeedback: "",
  });

  const handleRadioChange = (event) => {
    setSendRejectionEmail(event.target.value);
  };

  const handleFile = (file) => {
    setFile(file);
  };

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilledData({ ...filledData, [name]: value });
    setSoftSkills((prevSoftSkills) => ({
      ...prevSoftSkills,
      [name]: value,
    }));

    if (
      name === "relocate_to_ahmedabad" &&
      (Number(value) === 1 || Number(value) === 2)
    ) {
      setRelocate(true);
    } else if (name === "relocate_to_ahmedabad" && Number(value) === 0) {
      setRelocate(false);
    }

    if (name === "other_offer_on_hand" && Number(value) === 1) {
      setOtherOffer(true);
    }

    if (
      name === "final_status" &&
      (value === "Rejected" ||
        value === "Irrelevant Profile" ||
        value === "Location Not Matched" ||
        value === "Salary Expectation High" ||
        value === "Not Appeared" ||
        value === "Declined Offer" ||
        value === "Not Responded")
    ) {
      setRejected(true);
    } else if (
      name === "final_status" &&
      (value === "Hired" ||
        value === "In Progress" ||
        value === "On Hold" ||
        value === "Email Sent" ||
        value === "Joined")
    ) {
      setRejected(false);
      setOtherReason(false);
    }
    if (name === "final_status" && value === "Hired") {
      setHired(true);
    } else if (name === "final_status" && value !== "Hired") {
      setHired(false);
    }

    if (name === "template_no" && Number(value) === 3) {
      setOtherReason(true);
    } else if (name === "template_no" && Number(value) !== 3) {
      setOtherReason(false);
    }
  };
  return (
    <CandidateContext.Provider
      value={{
        data,
        setData,
        filledData,
        setFilledData,
        history,
        setHistory,
        phone,
        setPhone,
        firstPhone,
        setFirstPhone,
        secondPhone,
        setSecondPhone,
        handleChange,
        relocate,
        setRelocate,
        rejected,
        setRejected,
        otherReason,
        setOtherReason,
        file,
        setFile,
        handleFile,
        sendRejectionEmail,
        setSendRejectionEmail,
        handleRadioChange,
        formErrors,
        setFormErrors,
        currentRound,
        setCurrentRound,
        hired,
        setHired,
        otherOffer,
        setOtherOffer,
        softSkills,
        setSoftSkills,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};
