import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

export const ReportsGrid = ({ data }) => {
  const columns = [
    {
      field: "candidate_name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 150,
    },

    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
    },
    {
      field: "applied_date",
      headerName: "Applied Date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 120,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.applied_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "resume_source",
      headerName: "Source of Resume",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "status_hr",
      headerName: "HR Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.status_hr === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "In Progress" ||
                  row.row.status_hr === "On Hold"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "Completed"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "Skipped"
                ? "refunded d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.status_hr}
          </span>
        );
      },
      width: 110,
    },
    {
      field: "interview_round",
      headerName: "Interview Round",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
    },
    {
      field: "final_status",
      headerName: "Final Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.final_status === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "In Progress" ||
                  row.row.final_status === "On Hold" ||
                  row.row.final_status === "Email Sent"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Hired"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Joined"
                ? "refunded d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Rejected" ||
                  row.row.final_status === "Irrelevant Profile" ||
                  row.row.final_status === "Location Not Matched" ||
                  row.row.final_status === "Salary Expectation High" ||
                  row.row.final_status === "Not Appeared" ||
                  row.row.final_status === "Declined Offer" ||
                  row.row.final_status === "Not Responded"
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.final_status}
          </span>
        );
      },
    },
    {
      field: "interviewer_name",
      headerName: "Interviewer",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "owner_name",
      headerName: "Assigned Owner",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "referred_by",
      headerName: "referred By",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
    },
  ];

  return (
    <div className="mt-3">
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableDensitySelector
          disableColumnSelector
          disableColumnMenu
        />
      </div>
    </div>
  );
};
