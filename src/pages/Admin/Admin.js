import classNames from "classnames/bind";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import { fetchUserDataV2 } from "~/services/userService";

import SideBar from "~/components/Admin/SideBar";
import NotFound from "~/components/NotFound";
import MainHeader from "~/layouts/MainHeader";
import OverViewChart from "~/components/Admin/Chart/OverViewChart";
import DoughnutChart from "~/components/Admin/Chart/DoughnutChart";

import styles from "./Admin.module.scss";
import Widget from "~/components/Admin/Widget";
const cx = classNames.bind(styles);

const colorData = (type) => {
  if (type === "Revenue") {
    return {
      color: "#30D003",
    };
  } else if (type === "Artwork") {
    return {
      color: "#EC4A68",
    };
  } else if (type === "User") {
    return {
      color: "#448DFB",
    };
  } else {
    return {
      color: "#30E3CD",
    };
  }
};

function Admin({ onLogout }) {
  const [authorize, setAuthorize] = useState(false);
  const [index, setIndex] = useState(0);
  const widgets = [
    {
      id: 0,
      type: "Revenue",
      icon: "fa-solid fa-sack-dollar",
      isMoney: true,
      data: 1500,
      title: "Today profit",
      changeData: 200,
      changePercent: 15,
      previous: [1200, 1300, 1400, 1250, 1400, 1300],
      current: [1300, 1400, 1500, 1550, 1600, 1700],
    },
    {
      id: 1,
      type: "Artwork",
      icon: "fa-solid fa-image",
      isMoney: false,
      data: 25,
      title: "Today artworks",
      changeData: 5,
      changePercent: 25,
      previous: [20, 22, 24, 23, 21, 20],
      current: [22, 24, 25, 28, 30, 32],
    },
    {
      id: 2,
      type: "User",
      icon: "fa-solid fa-user",
      isMoney: false,
      data: 300,
      title: "Today users",
      changeData: 50,
      changePercent: 20,
      previous: [250, 280, 290, 270, 260, 255],
      current: [260, 300, 320, 310, 330, 340],
    },

    {
      id: 3,
      type: "Comment",
      icon: "fa-solid fa-messages-question",
      isMoney: false,
      data: 50,
      title: "Today comments",
      changeData: 10,
      changePercent: 25,
      previous: [40, 45, 48, 47, 46, 45],
      current: [45, 50, 52, 55, 58, 60],
    },
  ];
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        if (!storedToken) {
          throw new Error("Access token not found in localStorage");
        }
        const decodeAccessToken = jwtDecode(storedToken);
        const userId = decodeAccessToken.userId;
        if (!userId) {
          throw new Error("User ID not found in token");
        }
        const userData = await fetchUserDataV2(userId);
        if (userData && userData.type !== "Admin") {
          setAuthorize(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <>
      {authorize ? (
        <NotFound />
      ) : (
        <div className={cx("admin-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("admin-container")}>
            <SideBar />
            <div className={cx("dashboard_container")}>
              <div className={cx("dashboard_content")}>
                <div className={cx("daily-information")}>
                  {widgets.map((widget, index) => (
                    <Widget key={index} widget={widget} setIndex={setIndex} />
                  ))}
                </div>

                <div className={cx("chart_overview")}>
                  <div className={cx("chart-total")}>
                    <div className={cx("chart-title")}>
                      Total {widgets[index].type}
                    </div>
                    <div
                      className={cx("chart-data")}
                      style={colorData(widgets[index].type)}
                    >
                      {widgets[index].isMoney ? "$" : ""}
                      {(() => {
                        let formattedNumber =
                          widgets[index].data.toLocaleString();
                        return formattedNumber;
                      })()}
                    </div>
                    <OverViewChart dataChart={widgets[index]} />
                  </div>
                  <div className={cx("chart-revenue-by-category")}>
                    <div className={cx("title")}>Total Package</div>
                    <DoughnutChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
