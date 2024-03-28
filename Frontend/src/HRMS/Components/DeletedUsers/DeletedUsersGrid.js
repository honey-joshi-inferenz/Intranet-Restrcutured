import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export const DeletedUsersGrid = ({ users }) => {
  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.no",
      headerAlign: "left",
      align: "left",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      align: "left",
      width: 180,
    },
    {
      field: "contact",
      headerName: "Contact",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "dept_name",
      headerName: "Department",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },
    {
      field: "emp_code",
      headerName: "Employee Code",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },
    {
      field: "role",
      headerName: "Role",
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
          rows={users}
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
