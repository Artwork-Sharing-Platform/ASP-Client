import React from "react";
import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import styles from "./UserManagement.module.scss";
const cx = classNames.bind(styles);
function UserManagement({ onLogout }) {
  return (
    <div className={cx("user-management-wrapper")}>
      <MainHeader onLogout={onLogout} type="Admin" />
      <div className={cx("user-management-container")}>
        <SideBar />
      </div>
    </div>
  );
}

export default UserManagement;
