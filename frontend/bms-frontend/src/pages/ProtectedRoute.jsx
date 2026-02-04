import React, { useEffect } from "react";
import { getCurrentUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
    },
    {
      key: "user",
      label: user?.name || "",
      icon: <UserOutlined />,
      children: [
        {
          key: "profile",
          label: (
            <span
              className="cursor-pointer"
              onClick={() => {
                if (user?.isAdmin) navigate("/admin");
                else if (user?.isPartner) navigate("/partner");
                else navigate("/profile");
              }}
            >
              My Profile
            </span>
          ),
          icon: <ProfileOutlined />,
        },
        {
          key: "logout",
          label: (
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem("token");
              }}
              className="text-red-500 hover:text-red-600"
            >
              Log Out
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await getCurrentUser();
      dispatch(setUser(response.user));
      dispatch(hideLoading());
    } catch (error) {
      dispatch(setUser(null));
      dispatch(hideLoading());
      message.error(error.message || "Session expired");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    user && (
      <Layout className="min-h-screen bg-gray-100">
        {/* Header */}
        <Layout.Header className="sticky top-0 z-50 flex items-center justify-between bg-gray-800 px-6">
          <h3 className="text-white text-lg font-bold">Book My Show</h3>
          <Menu theme="dark" mode="horizontal" items={navItems} />
        </Layout.Header>

        {/* Content */}
        <Layout.Content className="p-6 bg-white min-h-[calc(100vh-64px)]">
          {children}
        </Layout.Content>
      </Layout>
    )
  );
}

export default ProtectedRoute;