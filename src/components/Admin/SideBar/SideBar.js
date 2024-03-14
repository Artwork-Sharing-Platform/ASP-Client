import React from "react";
import classNames from "classnames/bind";
import { SideBarData } from "~/datas/sideBarAdminDatas";
import SideBarItem from "../SideBarItem";
import styles from "./SideBar.module.scss";
const cx = classNames.bind(styles);
function SideBar() {
  return (
    <div className={cx("sidebar-wrapper")}>
      <div className={cx("sidebar-container")}>
        {SideBarData.map((data) => (
          <SideBarItem key={data.id} item={data} />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
