import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

export const RequestGrid = ({ data }) => {
  const columns = [
    { field: "serialNumber", headerName: "Sr.no", width: 90 },
    // {
    //   field: "referred_by",
    //   headerName: "Employee Name",
    //   headerAlign: "left",
    //   align: "left",
    //   width: 200,
    // },
    {
      field: "candidate_name",
      headerName: "Candidate Name",
      headerAlign: "left",
      align: "left",
      type: "number",
      width: 200,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 250,
    },

    {
      field: "relevant_it_experience",
      headerName: "Total Experience",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },

    {
      field: "applied_date",
      headerName: "Applied date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.applied_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "application_status",
      headerName: "Application Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.application_status === "In Progress"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.application_status === "On Hold"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.application_status === "Hired"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.application_status === "Joined"
                ? "refunded d-flex align-items-center justify-content-center rounded"
                : row.row.application_status === "Rejected"
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.application_status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.serialNumber}
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
