import React, { useState, useEffect } from "react";
import { InterviewerHeader } from "../../../Components/InterviewerHeader/InterviewerHeader";
import { Link, useNavigate } from "react-router-dom";
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
import TablePagination from "@mui/material/TablePagination";
import { Api } from "../../../../Config/API";
import moment from "moment";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const InterviewHistory = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [interviews, setInterviews] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const uuid = localStorage.getItem("userId");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let api = new Api();

    api.getMyInterviewHistory(uuid, token).then((res) => {
      setInterviews(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(false);
        setMessage("Your session has been expired.");
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

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
          <TableCell>{row.serialNumber}</TableCell>
          <TableCell>{row.candidate_name}</TableCell>
          <TableCell align="left">{row.designation}</TableCell>
          <TableCell align="left">{row.interview_round}</TableCell>
          <TableCell>
            {moment(new Date(row.interview_date)).format("DD-MM-YYYY")}
          </TableCell>
          <TableCell>{row.interview_time}</TableCell>{" "}
          <TableCell align="left">{row.status_hr}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell width={500}>Feedback</TableCell>
                      <TableCell>Considered for next round</TableCell>
                      <TableCell align="right">Logical</TableCell>
                      <TableCell align="right">Analytical</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                      <TableCell align="right">Communication</TableCell>
                      <TableCell align="right">Attitude</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {row.history?.map((historyRow) => ( */}
                    <TableRow>
                      <TableCell>{row.interview_feedback}</TableCell>
                      <TableCell>
                        {row.eligible_for_next_round === 0
                          ? "No"
                          : row.eligible_for_next_round === 1
                          ? "Yes"
                          : ""}
                      </TableCell>
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
                    {/* ))} */}
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
    <div className="interviewHistory w-100 d-flex  flex-column ">
      {(role === "Interviewer" || role === "Accounts") && <InterviewerHeader />}
      <div
        className={
          " w-100  d-flex align-items-center justify-content-center container " +
          (role === "Interviewer" || role === "Accounts" ? " pt-3  mt-5" : "")
        }
      >
        <div className="interviewHistoryCompo w-100 mt-3 d-flex align-items-center justify-content-center  flex-column ">
          {(role === "Interviewer" || role === "Accounts") && (
            <>
              <h4
                className="fw-bold mt-4 text-start w-100"
                style={{ color: "#042049" }}
              >
                Past Interviews
              </h4>
              {/* <div aria-label="breadcrumb" className="breadcrumbs">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/recruiter-interviews" className="link">
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item active" aria-current="page">
                    Past Interviews
                  </li>
                </ol>
              </div> */}
            </>
          )}

          {interviews?.length > 0 ? (
            <div
              className={
                "viewRequestTable card p-3 w-100" +
                (role === "Interviewer" || role === "Accounts" ? " mt-4" : "")
              }
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Sr. No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="left">Designation</TableCell>
                      <TableCell align="left">Interview Round</TableCell>
                      <TableCell align="left">Interview Date</TableCell>
                      <TableCell align="left">Interview Time</TableCell>
                      <TableCell align="left">HR Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {interviews?.length > 0 &&
                      interviews
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((row, index) => <Row key={index} row={row} />)}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={interviews?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </div>
          ) : (
            <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
              <span className="fw-bold">Data not found!</span>
              <span
                className="fw-bold mt-3"
                style={{ fontSize: "13px", color: "#4E5F77" }}
              >
                There are no interview history to show here right now!
              </span>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        onClose={handleSnackbar}
      >
        <Alert
          severity={errorMsg ? "error" : "success"}
          sx={{ width: "100%" }}
          onClose={handleSnackbar}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
