import React, { useContext } from "react";
import "./Cards.css";
import Carousel from "react-grid-carousel";
import totalImg from "../../../../Assets/Images/Total.png";
import todayImg from "../../../../Assets/Images/Today's.png";
import currentImg from "../../../../Assets/Images/Current Month.png";
import confirmedImg from "../../../../Assets/Images/Confirmed.png";
import inProgressImg from "../../../../Assets/Images/In Progress.png";
import pendingImg from "../../../../Assets/Images/Pending.png";
import joinedImg from "../../../../Assets/Images/Joined.png";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { RecruiterDashboardContext } from "../../../../Context/CreateContext";

export const Cards = ({ getTableData }) => {
  const { myInterviews, statistics, setCard, card } = useContext(
    RecruiterDashboardContext
  );

  return (
    <div>
      <div className="dashboardCardCompo w-100">
        <Carousel
          cols={4}
          rows={1}
          gap={10}
          showDots={false}
          mobileBreakpoint={768}
          containerClassName="dashboardCarousel"
          scrollSnap={true}
        >
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card1 d-flex flex-column"
              onClick={() => {
                getTableData(1);
                setCard(1);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={totalImg} alt="dashboardImg" />
              </div>

              <div className="recruiterCardData">
                <span>
                  total <br /> applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.totalApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 1 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card1Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card2 d-flex flex-column"
              onClick={() => {
                getTableData(2);
                setCard(2);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={todayImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  today's <br />
                  Applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.todaysApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 2 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card2Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card3 d-flex flex-column"
              onClick={() => {
                getTableData(3);
                setCard(3);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={currentImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  current month <br /> application
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.currentMonthApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 3 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card3Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card4 d-flex flex-column"
              onClick={() => {
                getTableData(4);
                setCard(4);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={confirmedImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  confirmed <br /> applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.confirmedApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 4 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card4Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card5 d-flex flex-column"
              onClick={() => {
                getTableData(5);
                setCard(5);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={inProgressImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  in progress <br /> applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.inProgressApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 5 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card5Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card6 d-flex flex-column"
              onClick={() => {
                getTableData(6);
                setCard(6);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={joinedImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  Joined <br /> applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.joinedApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 6 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card6Arrow" />
              </div>
            )}
          </Carousel.Item>
          <Carousel.Item>
            <div className=" p-4"></div>
            <div
              className=" recruiterCard card7 d-flex flex-column"
              onClick={() => {
                getTableData(7);
                setCard(7);
              }}
            >
              <div className="recruiterDashboardImg">
                <img src={pendingImg} alt="dashboardImg" />
              </div>
              <div className="recruiterCardData">
                <span>
                  Pending <br /> applications
                </span>
                <h3 className="mt-3 mt-md-1">
                  {statistics?.pendingApplications}
                </h3>
              </div>
            </div>
            {!myInterviews && card === 7 && (
              <div className="mt-3">
                <TbTriangleInvertedFilled className="card7Arrow" />
              </div>
            )}
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};
