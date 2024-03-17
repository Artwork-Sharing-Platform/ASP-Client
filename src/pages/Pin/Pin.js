import classNames from "classnames/bind";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { fetchPinInformationById } from "~/services/artService";
import { AuthContext } from "~/contexts/AuthContext";

import MainHeader from "~/layouts/MainHeader";
import PinDetail from "~/components/Pin/PinDetail";
import PinRelated from "~/components/Pin/PinRelated";
import ReportPin from "~/components/Pin/PinDetail/Top/MoreOptionsPin/ReportPin";
import LoadingSpinner from "~/components/LoadingSpinner";
import NoPackagePopup from "~/components/Popup/NoPackagePopup";
import ExtendPackagePopup from "~/components/Popup/ExtendPackagePopup";
import UpgradePackagePopup from "~/components/Popup/UpgradePackagePopup";

import styles from "./Pin.module.scss";
import AccessPrivatePopup from "~/components/Popup/AccessPrivatePopup";
import { ClipLoader } from "react-spinners";
const cx = classNames.bind(styles);
function Pin({ onLogout }) {
  const location = useLocation();
  const { id } = useParams();
  const { userData } = useContext(AuthContext);

  const [pinInformation, setPinInformation] = useState();
  const [packageType, setPackageType] = useState("download count");
  const [packageDescType, setPackageDescType] = useState("downloading images");
  const [showReportPin, setShowReportPin] = useState(false);
  const [showNotifyNoPackage, setShowNotifyNoPackage] = useState(false);
  const [showNotifyUpgradePackage, setShowNotifyUpgradePackage] =
    useState(false);
  const [showUpgradePackage, setShowUpgradePackage] = useState(false);
  const [showAccessPrivate, setShowAccessPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingShowPinInformation, setLoadingShowPinInformation] =
    useState(false);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, [location]);

  useEffect(() => {
    setLoadingShowPinInformation(true);
    if (id) {
      const fetchData = async () => {
        try {
          const pinData = await fetchPinInformationById(id);
          setPinInformation(pinData);
          setLoadingShowPinInformation(false);
        } catch (error) {
          console.error("Error fetching pin information:", error);
          setLoadingShowPinInformation(false);
        }
      };

      fetchData();
    }
  }, [id]);

  return (
    <>
      {loading && <LoadingSpinner loading={loading} />}
      {showReportPin && (
        <ReportPin
          userData={userData}
          pinInformation={pinInformation}
          setShowReportPin={setShowReportPin}
        />
      )}
      {showNotifyNoPackage && (
        <NoPackagePopup
          setShowNotifyNoPackage={setShowNotifyNoPackage}
          type={"download this image"}
        />
      )}
      {showNotifyUpgradePackage && (
        <ExtendPackagePopup
          setShowNotifyUpgradePackage={setShowNotifyUpgradePackage}
          setShowUpgradePackage={setShowUpgradePackage}
          type={packageType}
          descType={packageDescType}
        />
      )}
      {showUpgradePackage && (
        <UpgradePackagePopup
          setShowUpgradePackage={setShowUpgradePackage}
          setLoading={setLoading}
        />
      )}
      {showAccessPrivate && (
        <AccessPrivatePopup
          userData={userData}
          pinInformation={pinInformation}
          setShowAccessPrivate={setShowAccessPrivate}
        />
      )}
      <div className={cx("pin-wrapper")}>
        <MainHeader onLogout={onLogout} />
        {loadingShowPinInformation ? (
          <div className={cx("loading-pin")}>
            <ClipLoader
              size={40}
              color="#e60023"
              className={cx("loading-spinner")}
            />
          </div>
        ) : (
          <div className={cx("pin-container")}>
            <div className={cx("pin-content-main")}>
              <PinDetail
                userData={userData}
                setShowReportPin={setShowReportPin}
                setShowNotifyNoPackage={setShowNotifyNoPackage}
                setShowNotifyUpgradePackage={setShowNotifyUpgradePackage}
                setShowPrivate={setShowAccessPrivate}
                pinInformation={pinInformation}
                setPackageType={setPackageType}
                setPackageDescType={setPackageDescType}
              />
            </div>
            <div className={cx("pin-related-main")}>
              {pinInformation?.isCheckedSimilar && (
                <PinRelated pinInformation={pinInformation && pinInformation} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Pin;
