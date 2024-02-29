import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "~/configs/firebase";
import { v4 } from "uuid";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "~/contexts/AuthContext";
import useDebounce from "~/hooks/useDebounce";
import api from "~/services/apiService";

import MainHeader from "~/layouts/MainHeader";
import MoreOptions from "~/components/Create/MoreOptions";
import SearchTag from "~/components/Create/SearchTag";

import styles from "./Create.module.scss";

const cx = classNames.bind(styles);
function Create({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const fileInputImageRef = useRef();
  const textareaRef = useRef(null);

  const [artWorkData, setArtWorkData] = useState({
    url: "",
    title: "",
    description: "",
    link: "",
    isCheckedAds: true,
    isCheckedComment: true,
    isCheckedSimilar: true,
  });

  const [uploadImagePreview, setUploadImagePreview] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTagValue, setSearchTagValue] = useState("");
  const [searchTagResult, setSearchTagResult] = useState([]);

  const [showMoreOptions, setShowMoreOptions] = useState(true);
  const [showUploadInformation, setShowUploadInformation] = useState(false);
  const [showPublishBtn, setShowPublishBtn] = useState(false);
  const [showSearchTag, setShowSearchTag] = useState(false);
  const [loadingUploadImage, setLoadingUploadImage] = useState(false);
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
    setLoadingUploadImage(true);
    let file = null;
    let url;

    if (e.target.files.length === 1) {
      file = e.target.files[0];
      url = URL.createObjectURL(file);

      if (uploadImagePreview) {
        URL.revokeObjectURL(uploadImagePreview);
      }

      setUploadImagePreview(url);
      //Moderation Art
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("key", "ae8e0d930c8fc3f3bf9773d0ea19affd");

        const response = await axios.post(
          "https://api.moderatecontent.com/moderate/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const moderateContent = response.data.predictions;
        if (moderateContent.adult > 40) {
          setLoadingUploadImage(false);
          setUploadImagePreview(null);

          // Show Toastify notification
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
            `artWork/${userData._id}/${file.name + v4()}`
          );
          try {
            await uploadBytes(userAvatarRef, file);
            const downloadURL = await getDownloadURL(userAvatarRef);
            // console.log(moderateContent);
            setArtWorkData({ ...artWorkData, url: downloadURL });
            setLoadingUploadImage(false);
            setShowUploadInformation(true);
            setShowPublishBtn(true);
            console.log("Artwork uploaded successfully");
          } catch (error) {
            console.error("Error uploading file:", error.message);
          }
        }
      } catch (error) {
        console.error("Error moderating image:", error);
      }
    }
  };

  const handleDeleteUploadImage = async () => {
    setLoadingUploadImage(true);
    //Delete image from firebase
    try {
      // Extracting the image path from the URL
      const parsedUrl = new URL(artWorkData.url);
      const pathWithoutLeadingSlash = parsedUrl.pathname.substring(1);
      const imagePath = pathWithoutLeadingSlash.split("o/")[1];
      const decodedImagePath = decodeURIComponent(imagePath);
      // Creating a reference to the image in Firebase Storage
      const imageToDeleteRef = ref(storage, decodedImagePath);
      // Deleting the image
      await deleteObject(imageToDeleteRef);

      // Update state or perform any additional actions after deletion
      setArtWorkData({ ...artWorkData, url: "" });
      setUploadImagePreview(null);
      setShowUploadInformation(false);
      setShowPublishBtn(false);
      setLoadingUploadImage(false);
      console.log("Artwork deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error.message);
    }
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

  const handlePublishPin = () => {
    const postArtworkData = {
      userId: userData._id,
      url: artWorkData.url,
      title: artWorkData.title,
      description: artWorkData.description,
      link: artWorkData.link,
      tag: searchValue,
      isCheckedAds: artWorkData.isCheckedAds,
      isCheckedComment: artWorkData.isCheckedComment,
      isCheckedSimilar: artWorkData.isCheckedSimilar,
    };

    setLoadingPublish(true);

    api
      .post("/art/postArtwork", postArtworkData)
      .then((response) => {
        setArtWorkData({
          url: "",
          title: "",
          description: "",
          link: "",
          isCheckedAds: true,
          isCheckedComment: true,
          isCheckedSimilar: true,
        });
        setSearchValue("");
        setShowUploadInformation(false);
        setShowPublishBtn(false);
        setUploadImagePreview(null);
        setLoadingPublish(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  return (
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
              {showPublishBtn && (
                <div className={cx("publish-action")}>
                  <button
                    className={cx("publish-btn")}
                    onClick={handlePublishPin}
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
                    {loadingUploadImage && (
                      <div className={cx("image-loading")}>
                        <ClipLoader
                          size={40}
                          color="#e60023"
                          className={cx("loading-spinner")}
                        />
                      </div>
                    )}
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
                        multiple
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
  );
}

export default Create;
