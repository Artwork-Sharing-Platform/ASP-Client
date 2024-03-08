import classNames from "classnames/bind";
import { useState } from "react";
import { Watermark } from "antd";
import Bottom from "./Bottom";
import Middle from "./Middle";
import Top from "./Top";

import { ClipLoader } from "react-spinners";
import styles from "./PinDetail.module.scss";
const cx = classNames.bind(styles);

function PinDetail({
  userData,
  setShowReportPin,
  setShowNotifyNoPackage,
  setShowNotifyUpgradePackage,
  pinInformation,
  feature,
  setFeature,
  loadingShowPinInformation,
}) {
  const [listComments, setListComments] = useState([]);
  const [countComment, setCountComment] = useState(0);
  const [loadingShowListComment, setLoadingShowListComment] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {pinInformation && (
        <div className={cx("pin-detail")}>
          {/* Image */}
          <div className={cx("pin-image")}>
            {feature && feature.isWatermark === true ? (
              <img
                src={pinInformation.url}
                alt="pin-img"
                className={cx("image")}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
              />
            ) : (
              <Watermark
                content="Pesterin"
                font={{
                  color: "#e9e9e9",
                  fontSize: 20,
                }}
                zIndex={10}
                gap={[60, 70]}
              >
                <img
                  src={pinInformation.url}
                  alt="pin-img"
                  className={cx("image")}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                />
              </Watermark>
            )}
          </div>
          {/* Content */}
          {loadingShowPinInformation ? (
            <div className={cx("pin-loading")}>
              <ClipLoader
                size={40}
                color="#e60023"
                className={cx("loading-spinner")}
              />
            </div>
          ) : (
            <div className={cx("pin-detail-information")}>
              {/* Top */}
              <Top
                userData={userData}
                pinInformation={pinInformation}
                feature={feature && feature}
                setFeature={setFeature}
                setShowReportPin={setShowReportPin}
                setShowNotifyNoPackage={setShowNotifyNoPackage}
                setShowNotifyUpgradePackage={setShowNotifyUpgradePackage}
              />
              {/* Middle */}
              <Middle
                userData={userData}
                pinInformation={pinInformation}
                listComments={listComments}
                setListComments={setListComments}
                loadingShowListComment={loadingShowListComment}
                setLoadingShowListComment={setLoadingShowListComment}
                setCountComment={setCountComment}
              />
              {/* Bottom */}
              <Bottom
                userData={userData}
                pinInformation={pinInformation}
                setListComments={setListComments}
                setLoadingShowListComment={setLoadingShowListComment}
                countComment={countComment}
                setCountComment={setCountComment}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PinDetail;
