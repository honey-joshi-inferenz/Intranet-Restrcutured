import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import moment from "moment";

export const HRRequestsGrid = ({ data }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setId] = useState("");
  const openMenu = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setId(row.row.transaction_id);
    setAnchorEl(event.target);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate("/reimbursement-edit/" + id);
  };
  const columns = [
    { field: "serialNumber", headerName: "Sr.no", width: 70 },
    {
      field: "name",
      headerName: "Employee Name",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "emp_code",
      headerName: "Employee Id",
      headerAlign: "left",
      align: "left",
      type: "number",
      width: 120,
    },
    {
      field: "paid_amount",
      headerName: "Paid Amount",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 110,
      renderCell: (row) => {
        return (
          <span>
            ₹
            {Number(row.row.paid_amount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
    },
    {
      field: "employee_status",
      headerName: "Employee Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.employee_status === "Initiated"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.employee_status === "In Progress"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.employee_status === "Completed"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.employee_status === "Rejected"
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.employee_status}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "HR Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 120,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.status === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.status === "On Hold"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.status === "Approved"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.status === "Rejected"
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.status}
          </span>
        );
      },
    },
    {
      field: "final_status",
      headerName: "Final Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 140,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.final_status === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "On Hold"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Approved" ||
                  row.row.final_status === "Payment Done"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Rejected"
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
      field: "initiate_date",
      headerName: "Initiated Date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 140,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.initiate_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "actions",
      width: 120,
      sortable: false,

      // renderCell: (row) => {
      //   return (
      //     <div className="actionSpan">
      //       <Button onClick={() => navigate("/reimbursement-edit")}>
      //         View Details
      //       </Button>
      //     </div>
      //   );
      // },
      renderCell: (row) => {
        return (
          <div className="actionSpan">
            {" "}
            <Button
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={(e) => {
                handleClick(e, row);
              }}
              className="actionDiv"
              endIcon={<KeyboardArrowDown />}
            >
              Actions
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleEdit}>View Details</MenuItem>
            </Menu>
          </div>
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
          getRowId={(row) => row.transaction_id}
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
