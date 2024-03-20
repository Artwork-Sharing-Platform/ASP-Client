import { Select } from "antd";
import axios from "axios";
import classNames from "classnames/bind";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 } from "uuid";
import { storage } from "~/configs/firebase";

import { AuthContext } from "~/contexts/AuthContext";
import { PackageContext } from "~/contexts/PackageContext";
import useDebounce from "~/hooks/useDebounce";
import api from "~/services/apiService";

import MoreOptions from "~/components/Create/MoreOptions";
import SearchTag from "~/components/Create/SearchTag";
import MainHeader from "~/layouts/MainHeader";
import NoPackagePopup from "~/components/Popup/NoPackagePopup";
import ExtendPackagePopup from "~/components/Popup/ExtendPackagePopup";
import LoadingSpinner from "~/components/LoadingSpinner";

import styles from "./Create.module.scss";
import UpgradePackagePopup from "~/components/Popup/UpgradePackagePopup";

const cx = classNames.bind(styles);
function Create({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const { feature } = useContext(PackageContext);

  const fileInputImageRef = useRef();
  const textareaRef = useRef(null);

  const [artWorkData, setArtWorkData] = useState({
    access: "public",
    url: "",
    title: "",
    description: "",
    link: "",
    isCheckedAds: false,
    isCheckedComment: true,
    isCheckedSimilar: true,
  });

  const [uploadImagePreview, setUploadImagePreview] = useState(null);
  const [fileImageUpload, setFileImageUpload] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [searchTagValue, setSearchTagValue] = useState("");
  const [searchTagResult, setSearchTagResult] = useState([]);

  const [showMoreOptions, setShowMoreOptions] = useState(true);
  const [showUploadInformation, setShowUploadInformation] = useState(false);
  const [showPublishBtn, setShowPublishBtn] = useState(false);
  const [showSearchTag, setShowSearchTag] = useState(false);
  const [showNoPackage, setShowNoPackage] = useState(false);
  const [showExtendPackage, setShowExtendPackage] = useState(false);
  const [showUpgradePackage, setShowUpgradePackage] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [extendPackageType, setExtendPackageType] = useState(
    "posting artwork with private"
  );

  const [loading, setLoading] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);

  const [textareaRows, setTextareaRows] = useState(1);

  const debouncedValue = useDebounce(searchTagValue, 300);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchTagResult([]);
      return;
    }

    const fetchAPI = async () => {
      api
        .get(`/category/search/${debouncedValue}`)
        .then((response) => {
          setShowSearchTag(true);
          setSearchTagResult(response.data);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    };
    fetchAPI();
  }, [debouncedValue]);

  useEffect(() => {
    // Automatically resize the textarea when the content is changed
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
    // Calculate the number of rows based on scrollHeight and clientHeight
    const extraLines =
      (textareaRef.current.scrollHeight - textareaRef.current.clientHeight) /
      20;
    const calculatedRows = Math.max(1, Math.ceil(extraLines));
    setTextareaRows(calculatedRows);
  }, [artWorkData.description]);

  const handleClickUploadImage = () => {
    fileInputImageRef.current.click();
  };

  const handleChangeUploadImage = async (e) => {
    let file = null;
    let url;

    if (e.target.files.length === 1) {
      file = e.target.files[0];
      url = URL.createObjectURL(file);

      if (uploadImagePreview) {
        URL.revokeObjectURL(uploadImagePreview);
      }
      setFileImageUpload(file);
      setUploadImagePreview(url);
      setShowUploadInformation(true);
      setShowPublishBtn(true);
    }
  };

  const handleDeleteUploadImage = async () => {
    setUploadImagePreview(null);
    setShowUploadInformation(false);
    setShowPublishBtn(false);
  };

  const handleChangeAccess = (value) => {
    setArtWorkData({ ...artWorkData, access: value });
  };

  const handleChangeTitle = (e) => {
    setArtWorkData({ ...artWorkData, title: e.target.value });
  };

  const handleChangeDescription = (e) => {
    setArtWorkData({ ...artWorkData, description: e.target.value });
  };

  const handleChangeLink = (e) => {
    setArtWorkData({ ...artWorkData, link: e.target.value });
  };

  const handleChangeTag = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchTagValue(searchValue);
      setSearchValue(searchValue);
    }
    if (searchValue === "") {
      setShowSearchTag(false);
    }
  };

  const handlePublishPin = async () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    setLoadingPublish(true);
    if (
      (artWorkData.access === "private" || artWorkData.isCheckedAds) &&
      !userData.packageId
    ) {
      setLoadingPublish(false);
      setShowNoPackage(true);
    } else if (
      artWorkData.access === "private" &&
      feature.countPostPrivate < 1
    ) {
      setLoadingPublish(false);
      setShowExtendPackage(true);
    } else if (artWorkData.isCheckedAds && feature.countAds < 1) {
      setExtendPackageType("posting artwork with advertise");
      setLoadingPublish(false);
      setShowExtendPackage(true);
    } else {
      let postArtworkData = {};
      try {
        //Moderation Art
        const formData = new FormData();
        formData.append("file", fileImageUpload);
        formData.append("key", "ae8e0d930c8fc3f3bf9773d0ea19affd");

        const response = await axios.post(
          process.env.REACT_APP_MODERATION_URL,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const moderateContent = response.data.predictions;
        if (moderateContent.adult > 50) {
          setArtWorkData({
            access: "public",
            url: "",
            title: "",
            description: "",
            link: "",
            isCheckedAds: false,
            isCheckedComment: true,
            isCheckedSimilar: true,
          });
          setSearchValue("");
          setUploadImagePreview(null);
          setShowUploadInformation(false);
          setShowPublishBtn(false);
          setLoadingPublish(false);

          toast.error("Artwork censors invalid content", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          //Upload User Art to Firebase
          const userAvatarRef = ref(
            storage,
            `artWork/${userData._id}/${fileImageUpload.name + v4()}`
          );
          try {
            await uploadBytes(userAvatarRef, fileImageUpload);
            const downloadURL = await getDownloadURL(userAvatarRef);
            postArtworkData = {
              userId: userData._id,
              access: artWorkData.access,
              url: downloadURL,
              title: artWorkData.title,
              description: artWorkData.description,
              link: artWorkData.link,
              tag: searchValue,
              isCheckedAds: artWorkData.isCheckedAds,
              isCheckedComment: artWorkData.isCheckedComment,
              isCheckedSimilar: artWorkData.isCheckedSimilar,
            };
            api
              .post("/art/postArtwork", postArtworkData)
              .then((response) => {
                toast.success("Post artwork successfully!", {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                setArtWorkData({
                  access: "public",
                  url: "",
                  title: "",
                  description: "",
                  link: "",
                  isCheckedAds: false,
                  isCheckedComment: true,
                  isCheckedSimilar: true,
                });
                setLoadingPublish(false);
                setSearchValue("");
                setShowUploadInformation(false);
                setShowPublishBtn(false);
                setUploadImagePreview(null);
              })
              .catch((error) => {
                setLoadingPublish(false);
                setErrorMessage(error.response.data.message);
              });
          } catch (error) {
            setLoadingPublish(false);
            console.error("Error uploading file:", error.message);
          }
        }
      } catch (error) {
        setLoadingPublish(false);
        console.error("Error moderating image:", error);
      }
    }
  };

  const handleShowMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  return (
    <>
      {loading && <LoadingSpinner loading={loading} />}
      {showNoPackage && (
        <NoPackagePopup
          setShowNotifyNoPackage={setShowNoPackage}
          type={"post this artwork"}
        />
      )}
      {showExtendPackage && (
        <ExtendPackagePopup
          setShowNotifyUpgradePackage={setShowExtendPackage}
          setShowUpgradePackage={setShowUpgradePackage}
          type={extendPackageType}
          descType={"posting artwork"}
        />
      )}
      {showUpgradePackage && (
        <UpgradePackagePopup
          setShowUpgradePackage={setShowUpgradePackage}
          setLoading={setLoading}
        />
      )}
      <div className={cx("create-wrapper")}>
        <MainHeader onLogout={onLogout} />
        <div className={cx("create-container")}>
          <div className={cx("create-nav")}>
            <div className={cx("open")}>
              <div className={cx("open-icon")}>
                <i className={cx("fa-solid fa-chevrons-right", "icon")}></i>
              </div>
            </div>
            <div className={cx("plus")}>
              <div className={cx("plus-icon")}>
                <i className={cx("fa-solid fa-plus", "icon")}></i>
              </div>
            </div>
          </div>
          <div className={cx("create-content")}>
            <div className={cx("content-top")}>
              <div className={cx("content-left")}>
                <div className={cx("title")}>Create Pin</div>
              </div>
              <div className={cx("content-right")}>
                {errorMessage && (
                  <div className={cx("error-msg")}>{errorMessage}</div>
                )}
                {showPublishBtn && (
                  <div
                    className={
                      searchTagValue === ""
                        ? cx("publish-action", "publish-action-disabled")
                        : cx("publish-action")
                    }
                  >
                    <button
                      className={cx("publish-btn")}
                      onClick={handlePublishPin}
                      disabled={searchTagValue === ""}
                    >
                      Publish
                    </button>
                    {loadingPublish && (
                      <div className={cx("publish-loading")}>
                        <ClipLoader
                          size={30}
                          color="#fff"
                          className={cx("loading-spinner")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={cx("content-container")}>
              <div className={cx("container-main")}>
                <div className={cx("upload-image-container")}>
                  {uploadImagePreview ? (
                    <div className={cx("upload-image-preview")}>
                      <img
                        src={uploadImagePreview}
                        alt="upload-img-preview"
                        className={cx("image-upload")}
                      />
                      <div
                        className={cx("delete-upload-image")}
                        onClick={handleDeleteUploadImage}
                      >
                        <i className={cx("fa-solid fa-trash", "icon")}></i>
                      </div>
                    </div>
                  ) : (
                    <div className={cx("upload-image-main")}>
                      <div
                        className={cx("upload-content")}
                        onClick={handleClickUploadImage}
                      >
                        <div className={cx("main")}>
                          <i
                            className={cx(
                              "fa-sharp fa-solid fa-circle-up",
                              "icon"
                            )}
                          ></i>
                          <div className={cx("text")}>
                            Choose a file or drag and drop it here
                          </div>
                        </div>
                        <div className={cx("sub")}>
                          <div className={cx("text")}>
                            We recommend using high quality .jpg files less than
                            20MB.
                          </div>
                        </div>
                        <input
                          ref={fileInputImageRef}
                          type="file"
                          accept="image/*"
                          name="img"
                          className={cx("image-input")}
                          style={{ display: "none" }}
                          onChange={handleChangeUploadImage}
                        />
                      </div>
                      <div className={cx("upload-url")}>
                        <button className={cx("save-url-btn")}>
                          Save from URL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={
                    showUploadInformation
                      ? cx("upload-information-container")
                      : cx(
                          "upload-information-container",
                          "upload-information-container-disabled"
                        )
                  }
                >
                  {/* Access */}
                  <div className={cx("access-content")}>
                    <div className={cx("title")}>Access</div>
                    <div className={cx("access-input")}>
                      <Select
                        value={artWorkData.access}
                        className={cx("custom-select")}
                        size="large"
                        placeholder="Add access"
                        style={{ width: "100%", borderColor: "#e60023" }}
                        onChange={handleChangeAccess}
                        options={[
                          { value: "public", label: "Public" },
                          { value: "private", label: "Private" },
                        ]}
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <div className={cx("title-content")}>
                    <div className={cx("title")}>Title</div>
                    <div className={cx("title-input")}>
                      <input
                        type="text"
                        placeholder="Add a title"
                        value={artWorkData.title}
                        spellCheck={false}
                        autoFocus={false}
                        className={cx("input")}
                        onChange={handleChangeTitle}
                      />
                    </div>
                  </div>
                  {/* Description */}
                  <div className={cx("desc-content")}>
                    <div className={cx("title")}>Description</div>
                    <div className={cx("desc-input")}>
                      <textarea
                        className={cx("input")}
                        placeholder="Add a detailed description"
                        onChange={handleChangeDescription}
                        value={artWorkData.description}
                        rows={textareaRows}
                        ref={textareaRef}
                        autoFocus={true}
                      ></textarea>
                    </div>
                  </div>
                  {/* Link */}
                  <div className={cx("link-content")}>
                    <div className={cx("title")}>Link</div>
                    <div className={cx("link-input")}>
                      <input
                        type="text"
                        placeholder="Add a link"
                        value={artWorkData.link}
                        spellCheck={false}
                        autoFocus={false}
                        className={cx("input")}
                        onChange={handleChangeLink}
                      />
                    </div>
                  </div>
                  {/* Tag */}
                  <div className={cx("tag-content")}>
                    <div className={cx("title")}>Tagged topic</div>
                    <div className={cx("tag-input")}>
                      <input
                        type="text"
                        placeholder="Search for a tag"
                        value={searchValue}
                        spellCheck={false}
                        autoFocus={false}
                        className={cx("input")}
                        onChange={handleChangeTag}
                      />
                    </div>

                    {/* Search Tag */}
                    {showSearchTag && (
                      <SearchTag
                        setShowSearchTag={setShowSearchTag}
                        searchTagResult={searchTagResult}
                        setSearchValue={setSearchValue}
                      />
                    )}
                  </div>
                  {/* More options */}
                  <div
                    className={
                      showMoreOptions
                        ? cx("more-options", "more-options-show")
                        : cx("more-options")
                    }
                    onClick={handleShowMoreOptions}
                  >
                    <div className={cx("text")}>More options</div>
                    <i className={cx("fa-solid fa-chevron-down", "icon")}></i>
                  </div>
                  {/* Show more options */}
                  {showMoreOptions && (
                    <MoreOptions
                      artWorkData={artWorkData}
                      setArtWorkData={setArtWorkData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Create;
