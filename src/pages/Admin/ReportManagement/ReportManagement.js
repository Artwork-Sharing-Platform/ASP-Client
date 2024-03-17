import { Button, Table } from "antd";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import api from "~/services/apiService";
import { fetchUserDataV2 } from "~/services/userService";

import SideBar from "~/components/Admin/SideBar";
import NotFound from "~/components/NotFound";
import MainHeader from "~/layouts/MainHeader";

import styles from "./ReportManagement.module.scss";
const cx = classNames.bind(styles);
function ReportManagement({ onLogout }) {
  const [authorize, setAuthorize] = useState(false);

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

  const columns = [
    {
      title: <div className={cx("column-title")}>Art Picture</div>,
      dataIndex: "art_picture",
      key: "art_picture",
      render: (image) => (
        <img src={image} alt="art-pic" className={cx("art-picture")} />
      ),
      width: 150,
    },
    {
      title: <div className={cx("column-title")}>Art Title</div>,
      dataIndex: "art_title",
      key: "art_title",
      render: (artTitle) => <div className={cx("art-title")}>{artTitle}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Creator</div>,
      dataIndex: "creator",
      key: "creator",
      render: (creator) => <div className={cx("text")}>{creator}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Report Title</div>,
      dataIndex: "report_title",
      key: "report_title",
      render: (title) => <div className={cx("text")}>{title}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Report Description</div>,
      dataIndex: "report_description",
      key: "report_description",
      render: (desc) => <div className={cx("text-desc")}>{desc}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Reporter</div>,
      dataIndex: "reporter",
      key: "reporter",
      render: (createdAt) => <div className={cx("text")}>{createdAt}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Created At</div>,
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt) => <div className={cx("text")}>{createdAt}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Action</div>,
      key: "action",
      render: (_, record) => (
        <>
          {record.status ? (
            <Button
              className={cx("btn-warning")}
              onClick={() => handleSendWarning(record)}
            >
              <i className={cx("fa-solid fa-triangle-exclamation", "icon")}></i>
            </Button>
          ) : (
            <Button className={cx("btn-check")} disabled={true}>
              <i className={cx("fa-solid fa-check", "icon")}></i>
            </Button>
          )}
        </>
      ),
      width: 150,
    },
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getReport = async () => {
      try {
        const reports = await api.get("/report/getListReport");
        const enhancedReports = await Promise.all(
          reports.data.map(async (report) => {
            const artResponse = await api.get(
              `/art/getArtworkByIdV2/${report.artID}`
            );
            const userResponse = await api.get(
              `/user/getUserById/${artResponse.data.userId}`
            );
            const reporterResponse = await api.get(
              `/user/getUserById/${report.userID}`
            );
            const createdAt = new Date(report.createdAt).toLocaleString(
              "en-GB",
              {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
            return {
              ...report,
              reporter: reporterResponse.data,
              user: userResponse.data,
              art: artResponse.data,
              createdAt,
            };
          })
        );
        const transformedData = enhancedReports.map((report) => ({
          key: report._id,
          art_id: report.art._id,
          art_picture: report.art.url,
          art_title: report.art.title,
          report_title: report.reportTitle,
          report_description: report.reportDescription,
          reporter: report.reporter.userName,
          creator_id: report.user._id,
          creator: report.user.userName
            ? report.user.userName
            : report.user.firstName + " " + report.user.lastName,
          created_at: report.createdAt,
          status: report.reportStatus,
        }));
        setLoading(false);
        setData(transformedData);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching reports:", error);
      }
    };
    getReport();
  }, []);

  const handleSendWarning = async (record) => {
    try {
      const reportResponse = await api.post("/report/sendWarning", record);
      toast.success("Send Warning Successfully", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setData((prevUserData) => {
        return prevUserData.map((report) => {
          if (report.key === reportResponse.data._id) {
            return { ...report, status: reportResponse.data.reportStatus };
          }
          return report;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {authorize ? (
        <NotFound />
      ) : (
        <div className={cx("report-management-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("report-management-container")}>
            <SideBar />
            <div className={cx("report-management-main")}>
              <div className={cx("report-management-content")}>
                <div className={cx("report-management-heading")}>
                  <div className={cx("head-text")}>Report Management</div>
                </div>
                {loading ? (
                  <div className={cx("report-management-loading")}>
                    <ClipLoader
                      size={40}
                      color="#e60023"
                      className={cx("loading-spinner")}
                    />
                  </div>
                ) : (
                  <div className={cx("report-management-table")}>
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={{ pageSize: 5, total: data.length }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportManagement;
