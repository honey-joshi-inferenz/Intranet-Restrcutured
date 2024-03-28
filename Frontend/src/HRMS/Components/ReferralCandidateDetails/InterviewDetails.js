import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";

export const InterviewDetails = () => {
  return (
    <div className="mt-3 w-100 d-flex flex-column ">
      <div className="card p-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">HR Status</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interviewer</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Round</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Date</label>
            <input
              type="date"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Time</label>
            <input
              type="time"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">
              Considered for next round ? (Yes / No)
            </label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Interview Feedback</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Remarks from HR</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
      </div>
      <div className="card p-3 mt-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0  me-md-1">
            <label className="form-label">Ready to Relocate ?</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 me-0  me-md-1">
            <label className="form-label">Relocate Location</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">
              Do You Have Any Other Offer on Your Hand ?
            </label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Final Status</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">
              Do you want to send rejection email to candidate?
            </label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nextRound"
                  value={true}
                />
                <label className="form-check-label form-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nextRound"
                  value={false}
                />
                <label className="form-check-label form-label">No</label>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Select Reason</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0  me-md-2">
            <label className="form-label">Referral Update for Employee</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Add Reason</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0  me-md-2">
            <label className="form-label">Offered Salary in LPA</label>
            <input
              type="number"
              className="form-control formControlInput"
              name="name"
              step="0.0001"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Offered Bonus if Any</label>
            <input
              type="number"
              className="form-control formControlInput"
              name="name"
              step="0.0001"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0  me-md-2">
            <label className="form-label">Final Remarks</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="name"
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Assign Owner</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status"
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};
