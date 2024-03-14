import React from "react";
import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import styles from "./Settings.module.scss";
const cx = classNames.bind(styles);
function Settings({ onLogout }) {
  return (
    <div className={cx("setting-wrapper")}>
      <MainHeader onLogout={onLogout} type="Admin" />
      <div className={cx("setting-container")}>
        <SideBar />
      </div>
    </div>
  );
}

export default Settings;
