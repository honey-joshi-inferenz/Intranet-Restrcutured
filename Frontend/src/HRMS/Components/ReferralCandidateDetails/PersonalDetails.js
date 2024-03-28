import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RegExp } from "../../../Helpers/RegExp";

export const PersonalDetails = () => {
  const [phone, setPhone] = useState("");
  const [firstPhone, setFirstPhone] = useState("");
  const [secondPhone, setSecondPhone] = useState("");
  const decimalRegex = RegExp.REACT_APP_DECIMALRAGEX;

  return (
    <div className="mt-3 w-100 d-flex flex-column ">
      <div className="card p-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Contact</label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={setPhone}
              enableSearch
              inputStyle={{ width: "100%", height: "3rem" }}
              inputClass="contactClass"
            />
          </div>
        </div>

        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Current Location</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Permanent / Native Location</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0 me-md-2">
            <label className="form-label">Source of Resume</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Relevant Experience in The Industry
            </label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Position</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Current Organization</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
      </div>
      <div className="card p-3 mt-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Current CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Expected CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Negotiated CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Notice Period</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Reson for Job Change</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>

        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">First Reference Name</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">First Reference Contact</label>
            <PhoneInput
              country={"in"}
              value={firstPhone}
              onChange={setFirstPhone}
              enableSearch
              inputStyle={{ width: "100%", height: "3rem" }}
              inputClass="contactClass"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Second Reference Name</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Second Reference Contact</label>
            <PhoneInput
              country={"in"}
              value={secondPhone}
              onChange={setSecondPhone}
              enableSearch
              inputStyle={{ width: "100%", height: "3rem" }}
              inputClass="contactClass"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
