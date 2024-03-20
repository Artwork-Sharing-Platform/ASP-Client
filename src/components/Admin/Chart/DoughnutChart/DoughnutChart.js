import classNames from "classnames/bind";
import Chart from "react-apexcharts";

import styles from "./DoughnutChart.module.scss";
const cx = classNames.bind(styles);

function DoughnutChart({ packageData }) {
  const options = {
    labels: ["Enterprise", "Business", "Free"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              fontSize: 22,
              fontWeight: "bold",
              color: "#000",
            },
            value: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      },
    },

    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "16px",
      markers: {
        width: 15,
        height: 15,
      },
      offsetY: 6,
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
  };
  return (
    <div className={cx("chart-donut")}>
      <Chart
        type="donut"
        width="500"
        height="450"
        series={packageData}
        options={options}
      />
    </div>
  );
}

export default DoughnutChart;
