import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { PostDetails } from "../Requests/PostDetails/PostDetails";
import moment from "moment";

export const PostRequestsGrid = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const handleOpen = (row) => {
    setOpen(true);
    setId(row?.row?.product_id);
  };
  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "name",
      headerName: "Post By",
      width: 200,
      renderCell: (row) => {
        return <span>{row.row.user?.name}</span>;
      },
    },
    {
      field: "product_name",
      headerName: "Post Title",
      width: 200,
    },
    {
      field: "category_name",
      headerName: "Category",
      width: 200,
      renderCell: (row) => {
        return <span>{row.row.category?.category_name}</span>;
      },
    },
    {
      field: "product_price",
      headerName: "price",
      width: 150,
      renderCell: (row) => {
        return <span>₹ {row.row.product_price}</span>;
      },
    },
    {
      field: "created_date",
      headerName: "Published Date",
      width: 150,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.created_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "is_approved",
      headerName: "Status",
      width: 150,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.is_approved === false && row.row.action_date === null
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.is_approved === true
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.is_approved === false && row.row.action_date !== null
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.is_approved === true
              ? "Approved"
              : row.row.is_approved === false && row.row.action_date === null
              ? "Pending"
              : row.row.is_approved === false && row.row.action_date !== null
              ? "Rejected"
              : ""}
          </span>
        );
      },
    },
    {
      field: "approved_by",
      headerName: "Updated By",
      width: 200,
      renderCell: (row) => {
        return <span>{row.row.approved_by}</span>;
      },
    },
  ];

  return (
    <div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.product_id}
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
          onRowClick={(row) => handleOpen(row)}
        />
      </div>
      <PostDetails open={open} handleClose={handleClose} id={id} />
    </div>
  );
};
