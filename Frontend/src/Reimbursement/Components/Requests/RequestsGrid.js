import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { EditRequest } from "./EditRequest/EditRequest";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import moment from "moment/moment";

export const RequestsGrid = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
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
    handleOpen();
  };

  const columns = [
    { field: "serialNumber", headerName: "Sr.no", width: 90 },
    // {
    //   field: "name",
    //   headerName: "Employee Name",
    //   headerAlign: "left",
    //   align: "left",
    //   width: 200,
    // },
    // {
    //   field: "dept_name",
    //   headerName: "Department",
    //   headerAlign: "left",
    //   align: "left",
    //   type: "number",
    //   width: 170,
    // },
    {
      field: "paid_amount",
      headerName: "Paid Amount",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
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
      width: 150,
    },
    {
      field: "expenditure_category",
      headerName: "Expenditure Category",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 200,
    },
    // {
    //   field: "purpose_of_expenditure",
    //   headerName: "Description",
    //   headerAlign: "left",
    //   align: "left",
    //   sortable: false,
    //   width: 180,
    //   renderCell: (row) => {
    //     return (
    //       <span className="w-100 text-truncate ">
    //         {row.row.purpose_of_expenditure}
    //       </span>
    //     );
    //   },
    // },
    {
      field: "initiate_date",
      headerName: "Initiated Date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.initiate_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "employee_status",
      headerName: "Status",
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
      field: "last_updated_date",
      headerName: "Last updated date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 160,
      renderCell: (row) => {
        return (
          <span>
            {row.row.last_updated_date === "Pending"
              ? "Pending"
              : moment(new Date(row.row.last_updated_date)).format(
                  "DD-MM-YYYY"
                )}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "actions",
      width: 150,
      sortable: false,

      // renderCell: (row) => {
      //   return (
      //     <div className="actionSpan">
      //       <Button onClick={handleOpen}>Edit</Button>
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
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
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
      <EditRequest open={open} handleClose={handleClose} id={id} />
    </div>
  );
};
