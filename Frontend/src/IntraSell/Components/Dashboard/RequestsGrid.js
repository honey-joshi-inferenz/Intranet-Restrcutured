import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import moment from "moment";

export const RequestsGrid = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "intraSell/dashboard/getRecentlyUploadedProducts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card p-3 mt-3 w-100">
      <div className="d-flex flex-column flex-md-row justify-content-md-between mb-3">
        <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
          Recently Requested
        </h4>
        <Button
          className="headerButton d-flex justify-content-between"
          onClick={() => navigate("/intrasell-postRequests")}
        >
          View Requests
        </Button>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Post By</TableCell>
              <TableCell align="right">Post Title</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Published Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.userName}</TableCell>
                <TableCell align="right">{row.product_name}</TableCell>
                <TableCell align="right">{row.categoryName}</TableCell>
                <TableCell align="right">₹ {row.product_price}</TableCell>
                <TableCell align="right">
                  {moment(new Date(row.created_date)).format("DD-MM-YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
