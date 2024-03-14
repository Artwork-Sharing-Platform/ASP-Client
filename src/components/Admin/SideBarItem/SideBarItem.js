import classNames from "classnames/bind";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./SideBarItem.module.scss";
const cx = classNames.bind(styles);
function SideBarItem({ item }) {
  const location = useLocation();
  return (
    <div className={cx("sidebar-item-wrapper")}>
      {item.path ? (
        <NavLink
          to={item.path}
          className={cx("sidebar-item-container", {
            "sidebar-item-container-active": location.pathname === item.path,
          })}
        >
          <div className={cx("sidebar-item-content")}>
            <div className={cx("item-icon")}>
              <i className={cx(item.icon, "icon")}></i>
            </div>
            <div className={cx("item-title")}>{item.title}</div>
          </div>
        </NavLink>
      ) : (
        <div className={cx("sidebar-item-container")}>
          <div className={cx("sidebar-item-content")}>
            <div className={cx("item-icon")}>
              <i className={cx(item.icon, "icon")}></i>
            </div>
            <div className={cx("item-title")}>{item.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBarItem;
