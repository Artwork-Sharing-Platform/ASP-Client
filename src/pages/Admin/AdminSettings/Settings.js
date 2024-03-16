import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";

import { AuthContext } from "~/contexts/AuthContext";

import MainHeader from "~/layouts/MainHeader";
import SideBar from "~/components/Admin/SideBar";
import NotFound from "~/components/NotFound";

import styles from "./Settings.module.scss";
const cx = classNames.bind(styles);
function Settings({ onLogout }) {
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
        <div className={cx("setting-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("setting-container")}>
            <SideBar />
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
