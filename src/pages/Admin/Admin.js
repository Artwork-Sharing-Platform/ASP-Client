import classNames from "classnames/bind";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";

import api from "~/services/apiService";
import { fetchUserDataV2 } from "~/services/userService";
import { AuthContext } from "~/contexts/AuthContext";

import SideBar from "~/components/Admin/SideBar";
import NotFound from "~/components/NotFound";
import MainHeader from "~/layouts/MainHeader";
import OverViewChart from "~/components/Admin/Chart/OverViewChart";
import DoughnutChart from "~/components/Admin/Chart/DoughnutChart";
import Widget from "~/components/Admin/Widget";

import styles from "./Admin.module.scss";
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
  const { userData } = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [widgets, setWidgets] = useState([
    {
      id: 0,
      type: "Revenue",
      icon: "fa-solid fa-sack-dollar",
      isMoney: true,
      data: 0,
      title: "Today profit",
      changeData: 200,
      changePercent: 15,
      previous: [],
      current: [],
    },
    {
      id: 1,
      type: "Artwork",
      icon: "fa-solid fa-image",
      isMoney: false,
      data: 0,
      title: "Today artworks",
      changeData: 5,
      changePercent: 25,
      previous: [],
      current: [],
    },
    {
      id: 2,
      type: "User",
      icon: "fa-solid fa-user",
      isMoney: false,
      data: 0,
      title: "Today users",
      changeData: 50,
      changePercent: 20,
      previous: [],
      current: [],
    },

    {
      id: 3,
      type: "Comment",
      icon: "fa-solid fa-messages-question",
      isMoney: false,
      data: 0,
      title: "Today comments",
      changeData: 10,
      changePercent: 25,
      previous: [],
      current: [],
    },
  ]);
  const [packageData, setPackageData] = useState([]);
  const [authorize, setAuthorize] = useState(true);

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
        if (userData && userData.type === "Admin") {
          setAuthorize(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/admin/getAllData");
        const data = response.data;
        const totalAmountUSD = data.totalAmount / 24675;
        setWidgets((prevWidgets) => {
          return prevWidgets.map((widget) => {
            switch (widget.type) {
              case "Revenue":
                return {
                  ...widget,
                  data: totalAmountUSD,
                };
              case "Artwork":
                return {
                  ...widget,
                  data: data.totalArts,
                };
              case "User":
                return {
                  ...widget,
                  data: data.totalUsers,
                };
              case "Comment":
                return {
                  ...widget,
                  data: data.totalCountAllComments,
                };
              default:
                return widget;
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const updatedWidgets = widgets.map((widget) => ({
      ...widget,
      previous: Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 100)
      ),
      current: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
    }));

    setWidgets(updatedWidgets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getPackageData = async () => {
      try {
        const response = await api.get("/admin/countPackage");
        setPackageData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPackageData();
  }, []);

  return (
    <>
      {authorize ? (
        <div>{userData.type !== "Admin" && <NotFound />}</div>
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
                    <DoughnutChart packageData={packageData} />
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
