import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "~/contexts/AuthContext";

import SideBar from "~/components/Admin/SideBar";
import MainHeader from "~/layouts/MainHeader";
import NotFound from "~/components/NotFound";

import styles from "./Admin.module.scss";
const cx = classNames.bind(styles);
function Admin({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const [authorize, setAuthorize] = useState(false);

  useEffect(() => {
    if (userData.type !== "Admin") {
      setAuthorize(true);
    }
  }, [userData.type]);

  return (
    <>
      {authorize ? (
        <NotFound />
      ) : (
        <div className={cx("admin-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("admin-container")}>
            <SideBar />
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
