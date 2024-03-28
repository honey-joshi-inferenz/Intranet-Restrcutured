import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useContext } from "react";
import { CandidateContext } from "../../../Context/CreateContext";
import moment from "moment";

export const History = () => {
  const { history } = useContext(CandidateContext);

  function Row(props) {
    const { row } = props;
    var softSkills;
    if (row.interview_softSkills) {
      softSkills = JSON.parse(row.interview_softSkills);
    }
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.interview_round}</TableCell>
          <TableCell>
            {moment(new Date(row.interview_date)).format("DD-MM-YYYY")}
          </TableCell>
          <TableCell>{row.interview_time}</TableCell>
          <TableCell>{row.interviewer_name}</TableCell>
          <TableCell>{row.remarks_hr}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, whiteSpace: "pre-line" }}
            colSpan={7}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell width={500}>Feedback</TableCell>
                      <TableCell align="right">Logical</TableCell>
                      <TableCell align="right">Analytical</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                      <TableCell align="right">Communication</TableCell>
                      <TableCell align="right">Attitude</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{row.interview_feedback}</TableCell>
                      <TableCell align="right">
                        {softSkills?.logicalFeedback}
                      </TableCell>
                      <TableCell align="right">
                        {softSkills?.analyticalFeedback}
                      </TableCell>
                      <TableCell align="right">
                        {softSkills?.confidenceFeedback}
                      </TableCell>
                      <TableCell align="right">
                        {softSkills?.communicationFeedback}
                      </TableCell>
                      <TableCell align="right">
                        {softSkills?.attitudeFeedback}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <div className="card p-3 mt-3 w-100">
      <div className="historyHeader d-flex flex-md-row justify-content-md-between">
        <div className="d-flex flex-column text-start">
          <span className="historyTitle">Last Updated By : </span>
          <span>{history?.modified_by}</span>
        </div>
        <div className="d-flex flex-column text-end">
          <span className="historyTitle">Last Updated Date :</span>
          <span>
            {moment(new Date(history?.modified_date)).format("DD-MM-YYYY")}
          </span>
        </div>
      </div>
      <div className="mt-5">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell>Interview Round</TableCell>
                <TableCell>Interview Date</TableCell>
                <TableCell>Interview Time</TableCell>
                <TableCell>Interviewer</TableCell>
                <TableCell width={300}>Remarks by HR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history?.history?.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
