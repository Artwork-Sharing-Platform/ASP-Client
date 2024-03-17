import classNames from "classnames/bind";

import styles from "./Widget.module.scss";

const cx = classNames.bind(styles);

function Widget({ widget, setIndex }) {
  const styleIcon = (type) => {
    if (type === "Revenue") {
      return {
        color: "#30D003",
      };
    } else if (type === "Artwork") {
      return {
        color: "#EC4A68",
      };
    } else if (type === "User") {
      return {
        color: "#448DFB",
      };
    } else {
      return {
        color: "#30E3CD",
      };
    }
  };

  const styleBackgroundIcon = (type) => {
    if (type === "Revenue") {
      return {
        backgroundColor: "#D6F6D7",
      };
    } else if (type === "Artwork") {
      return {
        backgroundColor: "#FCDBE1",
      };
    } else if (type === "User") {
      return {
        backgroundColor: "#DAE8FF",
      };
    } else {
      return {
        backgroundColor: "#C2F7F1",
      };
    }
  };
  return (
    <>
      <div
        className={cx("widget_container")}
        onClick={() => setIndex(widget.id)}
      >
        <div className={cx("widget_header")}>
          <div
            className={cx("icon-widget")}
            style={styleBackgroundIcon(widget.type)}
          >
            <i className={cx(widget.icon)} style={styleIcon(widget.type)}></i>
          </div>
          <div className={cx("text-widget")}>{widget.type}</div>
        </div>
        <div className={cx("widget_content")}>
          {widget.isMoney && "$"}
          {(() => {
            var formattedNumber = widget.data.toLocaleString();
            return formattedNumber;
          })()}
        </div>
        <div className={cx("widget_footer")}>
          <div className={cx("today-text")}>{widget.title}</div>

          <div
            className={
              widget.changeData > 0 ? cx("up-detail") : cx("down-detail")
            }
          >
            {widget.changeData > 0 ? "+" : ""}
            {widget.isMoney && "$"}
            {(() => {
              var formattedNumber = widget.changeData.toLocaleString();
              return formattedNumber;
            })()}
          </div>
          <div
            className={
              widget.changePercent > 0 ? cx("up-percent") : cx("down-percent")
            }
          >
            {widget.changePercent > 0 ? "+" : ""}
            {widget.changePercent}%
          </div>
        </div>
      </div>
    </>
  );
}

export default Widget;
