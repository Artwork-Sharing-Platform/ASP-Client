import React from "react";
import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import styles from "./TransactionManagement.module.scss";
const cx = classNames.bind(styles);
function TransactionManagement({ onLogout }) {
  return (
    <div className={cx("transaction-management-wrapper")}>
      <MainHeader onLogout={onLogout} type="Admin" />
      <div className={cx("transaction-management-container")}>
        <SideBar />
      </div>
    </div>
  );
}

export default TransactionManagement;
