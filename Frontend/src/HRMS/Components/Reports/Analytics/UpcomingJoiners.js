import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import moment from "moment";
import "./Styles.css";

export const UpcomingJoiners = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "hrmetrics/getUpcomingJoiners")
        .then((res) => {
          setData(res.data);
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
    <div className="card p-3 col-lg-5 col-12 d-flex justify-content-start  align-items-center upcomingJoiners">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center  w-100 mb-3">
        <span className="fw-bold text-muted" style={{ fontSize: "13px" }}>
          Upcoming Joiners
        </span>
        <span className="fw-bold text-muted" style={{ fontSize: "13px" }}>
          Total - {data?.count}
        </span>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Date of Joining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.candidate_name}</TableCell>
                <TableCell>{row.designation}</TableCell>
                <TableCell>
                  {moment(new Date(row.joinig_date)).format("DD-MM-YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
