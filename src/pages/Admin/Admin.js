import classNames from "classnames/bind";
import SideBar from "~/components/Admin/SideBar";
import MainHeader from "~/layouts/MainHeader";
import styles from "./Admin.module.scss";
const cx = classNames.bind(styles);
function Admin({ onLogout }) {
  return (
    <>
      <div className={cx("admin-wrapper")}>
        <MainHeader onLogout={onLogout} type="Admin" />
        <div className={cx("admin-container")}>
          <SideBar />
        </div>
      </div>
    </>
  );
}

export default Admin;
