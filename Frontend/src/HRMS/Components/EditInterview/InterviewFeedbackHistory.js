import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";

export const InterviewFeedbackHistory = ({ data }) => {
  return (
    <div className="interviewFeedbackHistory card w-100 p-3">
      {data?.length > 0 ? (
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No</TableCell>
                <TableCell>Interview Round</TableCell>
                <TableCell>Interviewer</TableCell>
                <TableCell>Interview Date</TableCell>
                <TableCell>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{row.interview_round}</TableCell>
                  <TableCell>{row.interviewer_name}</TableCell>
                  <TableCell>
                    {moment(new Date(row.interview_date)).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell width={600}>{row.interview_feedback}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <span className="fw-bold">Data not found!</span>
          <span
            className="fw-bold mt-3"
            style={{ fontSize: "13px", color: "#4E5F77" }}
          >
            There are no interview feedback to show here right now!
          </span>
        </>
      )}
    </div>
  );
};
