import React from "react";
import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import styles from "./ArtworkManagement.module.scss";
const cx = classNames.bind(styles);
function ArtworkManagement({ onLogout }) {
  return (
    <div className={cx("artwork-management-wrapper")}>
      <MainHeader onLogout={onLogout} type="Admin" />
      <div className={cx("artwork-management-container")}>
        <SideBar />
      </div>
    </div>
  );
}

export default ArtworkManagement;
