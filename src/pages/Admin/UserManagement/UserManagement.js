import { Button, Table, Tag } from "antd";
import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

import api from "~/services/apiService";
import { AuthContext } from "~/contexts/AuthContext";
import { fetchUserDataV2 } from "~/services/userService";

import SideBar from "~/components/Admin/SideBar";
import MainHeader from "~/layouts/MainHeader";
import NotFound from "~/components/NotFound";

import styles from "./UserManagement.module.scss";

const cx = classNames.bind(styles);

function UserManagement({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const [authorize, setAuthorize] = useState(false);

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
        if (userData && userData.type !== "Admin") {
          setAuthorize(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);
  const columns = [
    {
      title: <div className={cx("column-title")}>Avatar</div>,
      dataIndex: "avatar",
      key: "avatar",
      render: (image) => (
        <img src={image} alt="avatar" className={cx("avatar")} />
      ),
      width: 50,
    },
    {
      title: <div className={cx("column-title")}>Type</div>,
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "Admin"
              ? "red"
              : type === "Partnership"
              ? "green"
              : "geekblue"
          }
          className={cx("type")}
        >
          {type}
        </Tag>
      ),
      sorter: (a, b) => a.type.localeCompare(b.type),
      defaultSortOrder: "ascend",
      width: 70,
    },
    {
      title: <div className={cx("column-title")}>Full Name</div>,
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName) => <div className={cx("text")}>{fullName}</div>,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      defaultSortOrder: "ascend",
      width: 170,
    },
    {
      title: <div className={cx("column-title")}>User Name</div>,
      dataIndex: "userName",
      key: "userName",
      render: (userName) => <div className={cx("text")}>{userName}</div>,
      width: 170,
    },
    {
      title: <div className={cx("column-title")}>Email</div>,
      dataIndex: "email",
      key: "email",
      render: (email) => <div className={cx("text")}>{email}</div>,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      width: 100,
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
      width: 50,
    },
    {
      title: <div className={cx("column-title")}>Action</div>,
      key: "action",
      render: (_, record) => (
        <>
          {record.status ? (
            <Button
              onClick={() => handleLock(record.key)}
              className={cx("btn-lock")}
            >
              Lock
            </Button>
          ) : (
            <Button
              onClick={() => handleUnlock(record.key)}
              className={cx("btn-unlock")}
            >
              UnLock
            </Button>
          )}
        </>
      ),
      width: 150,
    },
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const users = await api.get("/user/getListUser");
        const transformedData = users.data
          .filter((user) => user._id !== userData._id)
          .map((user) => ({
            key: user._id,
            avatar: user.avatar,
            fullName: `${user.firstName} ${user.lastName}`,
            type: user.type,
            userName: user.userName
              ? user.userName
              : user.firstName + " " + user.lastName,
            email: user.email,
            status: user.status,
          }));
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getUser();
  }, [userData._id]);

  const handleUnlock = async (key) => {
    const userId = key;
    const updateData = {
      status: true,
    };
    try {
      const updatedUser = await api.post(
        `/user/updateStatusUser/${userId}`,
        updateData
      );
      setData((prevUserData) => {
        return prevUserData.map((user) => {
          if (user.key === updatedUser.data._id) {
            return { ...user, status: updatedUser.data.status };
          }
          return user;
        });
      });
      console.log("UnLock:", key);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLock = async (key) => {
    const userId = key;
    const updateData = {
      status: false,
    };
    try {
      const updatedUser = await api.post(
        `/user/updateStatusUser/${userId}`,
        updateData
      );
      setData((prevUserData) => {
        return prevUserData.map((user) => {
          if (user.key === updatedUser.data._id) {
            return { ...user, status: updatedUser.data.status };
          }
          return user;
        });
      });
      console.log("Lock:", key);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {authorize ? (
        <NotFound />
      ) : (
        <div className={cx("user-management-wrapper")}>
          <MainHeader onLogout={onLogout} type="Admin" />
          <div className={cx("user-management-container")}>
            <SideBar />
            <div className={cx("user-management-main")}>
              <div className={cx("user-management-content")}>
                <div className={cx("user-management-heading")}>
                  <div className={cx("head-text")}>User Management</div>
                </div>
                {loading ? (
                  <div className={cx("user-management-loading")}>
                    <ClipLoader
                      size={40}
                      color="#e60023"
                      className={cx("loading-spinner")}
                    />
                  </div>
                ) : (
                  <div className={cx("user-management-table")}>
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={{ pageSize: 8, total: data.length }}
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

export default UserManagement;
