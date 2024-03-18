import { Button, Table, Tag } from "antd";
import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import { fetchUserDataV2 } from "~/services/userService";
import { AuthContext } from "~/contexts/AuthContext";
import api from "~/services/apiService";

import SideBar from "~/components/Admin/SideBar";
import NotFound from "~/components/NotFound";
import MainHeader from "~/layouts/MainHeader";

import styles from "./ArtworkManagement.module.scss";
const cx = classNames.bind(styles);
function ArtworkManagement({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const columns = [
    {
      title: <div className={cx("column-title")}>Art Picture</div>,
      dataIndex: "art_picture",
      key: "art_picture",
      render: (image) => (
        <img src={image} alt="art-pic" className={cx("art_picture")} />
      ),
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Art Title</div>,
      dataIndex: "art_title",
      key: "art_title",
      render: (art_title) => <div className={cx("text")}>{art_title}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Art Description</div>,
      dataIndex: "art_desc",
      key: "art_desc",
      render: (artDesc) => <div className={cx("text")}>{artDesc}</div>,
      width: 200,
    },
    {
      title: <div className={cx("column-title")}>Creator</div>,
      dataIndex: "creator",
      key: "creator",
      render: (creator) => <div className={cx("text")}>{creator}</div>,
      width: 150,
    },
    {
      title: <div className={cx("column-title")}>Created At</div>,
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt) => <div className={cx("text")}>{createdAt}</div>,
      width: 150,
    },
    {
      title: <div className={cx("column-title")}>Status</div>,
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"} className={cx("status")}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
      sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1),
      defaultSortOrder: "descend",
      width: 100,
    },
    {
      title: <div className={cx("column-title")}>Action</div>,
      key: "action",
      render: (_, record) => (
        <>
          {record.status ? (
            <Button className={cx("btn-check")} disabled={true}>
              <i className={cx("fa-solid fa-check", "icon")}></i>
            </Button>
          ) : (
            <Button
              className={cx("btn-unlock")}
              onClick={() => handleUnlock(record)}
            >
              UnLock
            </Button>
          )}
        </>
      ),
      width: 100,
    },
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorize, setAuthorize] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        if (!storedToken) {
          throw new Error("Access token not found in localStorage");
        }
        const decodeAccessToken = jwtDecode(storedToken);
        const userId = decodeAccessToken.userId;
        if (!userId) {
          throw new Error("User ID not found in token");
        }
        const userData = await fetchUserDataV2(userId);
        if (userData && userData.type === "Admin") {
          setAuthorize(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getArt = async () => {
      try {
        const arts = await api.get("/art/getArtwork");
        const enhancedArts = await Promise.all(
          arts.data.map(async (art) => {
            const userResponse = await api.get(
              `/user/getUserById/${art.userId}`
            );
            const createdAt = new Date(art.createdAt).toLocaleString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return {
              ...art,
              user: userResponse.data,
              createdAt,
            };
          })
        );
        const transformedData = enhancedArts.map((art) => ({
          key: art._id,
          art_picture: art.url,
          art_title: art.title,
          art_desc: art.description,
          creator_id: art.user._id,
          creator: art.user.userName
            ? art.user.userName
            : art.user.firstName + " " + art.user.lastName,
          created_at: art.createdAt,
          status: art.status,
        }));
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getArt();
  }, []);

  const handleUnlock = async (art) => {
    try {
      const updatedArt = await api.post(`/art/updateArtworkStatus`, art);
      toast.success("Update Successfully", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setData((prevArtData) => {
        return prevArtData.map((art) => {
          if (art.key === updatedArt.data._id) {
            return { ...art, status: updatedArt.data.status };
          }
          return art;
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {authorize ? (
        <div>{userData.type !== "Admin" && <NotFound />}</div>
      ) : (
        <div className={cx("artwork-management-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("artwork-management-container")}>
            <SideBar />
            <div className={cx("artwork-management-main")}>
              <div className={cx("artwork-management-content")}>
                <div className={cx("artwork-management-heading")}>
                  <div className={cx("head-text")}>Artwork Management</div>
                </div>
                {loading ? (
                  <div className={cx("artwork-management-loading")}>
                    <ClipLoader
                      size={40}
                      color="#e60023"
                      className={cx("loading-spinner")}
                    />
                  </div>
                ) : (
                  <div className={cx("artwork-management-table")}>
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={{ pageSize: 5, total: data.length }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArtworkManagement;
