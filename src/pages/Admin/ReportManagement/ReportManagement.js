import React from "react";
import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import styles from "./ReportManagement.module.scss";
const cx = classNames.bind(styles);
function ReportManagement({ onLogout }) {
  return (
    <div className={cx("report-management-wrapper")}>
      <MainHeader onLogout={onLogout} type="Admin" />
      <div className={cx("report-management-container")}>
        <SideBar />
      </div>
    </div>
  );
}

export default ReportManagement;
