import classNames from "classnames/bind";

import RevenueChart from "./RevenueChart";
import UserChart from "./UserChart";
import ArtworkChart from "./ArtworkChart";
import Comment from "./CommentChart";
import styles from "./OverViewChart.module.scss";

const cx = classNames.bind(styles);

function OverViewChart({ dataChart }) {
  return (
    <div className={cx("chart")}>
      {dataChart.type === "Revenue" && <RevenueChart dataChart={dataChart} />}
      {dataChart.type === "User" && <UserChart dataChart={dataChart} />}
      {dataChart.type === "Artwork" && <ArtworkChart dataChart={dataChart} />}
      {dataChart.type === "Comment" && <Comment dataChart={dataChart} />}
    </div>
  );
}

export default OverViewChart;
