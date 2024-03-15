import React, { useState } from "react";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "~/services/apiService";
import { reportDatas } from "~/datas/reportDatas";

import styles from "./ReportPin.module.scss";
const cx = classNames.bind(styles);
function ReportPin({ userData, pinInformation, setShowReportPin }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [report, setReport] = useState();

  const handleRadioChange = (reportId, report) => {
    setSelectedReport(reportId);
    setReport(report);
  };

  const handleSave = () => {
    const reportData = {
      userID: userData._id,
      artID: pinInformation._id,
      reportTitle: report.title,
      reportDescription: report.desc,
      reportType: "Artwork",
      reportStatus: true,
    };

    api
      .post("/report/createReport", reportData)
      .then((response) => {
        setShowReportPin(false);
        // Show Toastify notification
        toast.success("Report Successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setShowReportPin(false);
  };
  return (
    <div
      className={cx("report-pin-wrapper")}
      onClick={() => setShowReportPin(false)}
    >
      <div
        className={cx("report-pin-container")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx("report-pin-heading")}>
          <div className={cx("heading-text")}>Report Pin</div>
        </div>
        <div className={cx("report-pin-content")}>
          <div className={cx("report-pin-main")}>
            <div className={cx("report-item-main")}>
              {reportDatas.map((report) => (
                <div className={cx("report-item")} key={report.id}>
                  <div className={cx("select-report")}>
                    <input
                      type="radio"
                      id={`select-rp-${report.id}`}
                      name="reportGroup"
                      className={cx("input-report")}
                      checked={selectedReport === report.id}
                      onChange={() => handleRadioChange(report.id, report)}
                    />
                  </div>
                  <div className={cx("report-content")}>
                    <label
                      htmlFor={`select-rp-${report.id}`}
                      className={cx("report-title")}
                    >
                      {report.title}
                    </label>
                    <div className={cx("report-desc")}>{report.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={cx("report-pin-footer")}>
          <div className={cx("report-pin-action")}>
            <button className={cx("cancel-action")} onClick={handleCancel}>
              <span className={cx("text")}>Cancel</span>
            </button>
            <button
              className={cx("save-action")}
              disabled={selectedReport === null}
              onClick={handleSave}
            >
              <span className={cx("text")}>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPin;
