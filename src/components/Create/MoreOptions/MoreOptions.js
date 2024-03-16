import { Switch } from "antd";
import classNames from "classnames/bind";

import styles from "./MoreOptions.module.scss";
const cx = classNames.bind(styles);
function MoreOptions({ type = "Normal", artWorkData, setArtWorkData }) {
  const handleChangeAds = (checked) => {
    setArtWorkData({ ...artWorkData, isCheckedAds: checked });
  };
  const handleChangeComment = (checked) => {
    setArtWorkData({ ...artWorkData, isCheckedComment: checked });
  };
  const handleChangeSimilar = (checked) => {
    setArtWorkData({ ...artWorkData, isCheckedSimilar: checked });
  };
  return (
    <div className={cx("more-options-content")}>
      {type === "Normal" && (
        <div className={cx("option-ads")}>
          <Switch
            checked={artWorkData.isCheckedAds}
            onChange={handleChangeAds}
            style={{
              background: artWorkData.isCheckedAds ? "#e60023" : "#efefef",
            }}
          />
          <div className={cx("text")}>Allow ads</div>
        </div>
      )}
      <div className={cx("option-comment")}>
        <Switch
          checked={artWorkData.isCheckedComment}
          onChange={handleChangeComment}
          style={{
            background: artWorkData.isCheckedComment ? "#e60023" : "#efefef",
          }}
        />
        <div className={cx("text")}>Allow people to comment</div>
      </div>
      <div className={cx("option-show-similar")}>
        <Switch
          checked={artWorkData.isCheckedSimilar}
          onChange={handleChangeSimilar}
          style={{
            background: artWorkData.isCheckedSimilar ? "#e60023" : "#efefef",
          }}
        />
        <div className={cx("content")}>
          <div className={cx("main-text")}>Show similar products</div>
          <div className={cx("sub-text")}>
            <div className={cx("text")}>
              People can shop products similar to what's shown in this Pin using
              visual search
            </div>
            <div className={cx("text")}>
              Shopping recommendations aren't available for Idea ads and Pins
              with tagged products or paid partnership label
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoreOptions;
