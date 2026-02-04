import React, { useEffect } from "react";
import { getCurrentUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Header } from "antd/es/layout/layout";
import {
    HomeOutlined,
    LogoutOutlined,
    ProfileOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
    const {user} = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log({ user })

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
                        onClick={() => {
                            if (user?.isAdmin) {
                                navigate("/admin");
                            } else if (user?.isPartner) {
                                navigate("/partner");
                            } else {
                                navigate("/profile");
                            }
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
            //Before fetching, turn loading on 
            dispatch(showLoading());
            const response = await getCurrentUser();
            console.log(response)
            dispatch(setUser(response.user));
            dispatch(hideLoading());
            // Hide Loader
        } catch (error) {
            dispatch(setUser(null));
            dispatch(hideLoading());
            message.error(error.message || "Session expired");
            navigate("/login");
        }
    };

    useEffect(() => {
        // If there is no token, no need to make any API call
        // Simply redirect back to the login page
        if (localStorage.getItem("token")) {
            getValidUser();
        } else {
            navigate("/login");
        }
    }, [navigate]);
    //"d-flex justify-content-between"
    return (
        user && (
            <Layout>
                <Header
                    className='justify-between'
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h3 className="text-white m-0">
                        Book My Show
                    </h3>
                    <Menu theme="dark" mode="horizontal" items={navItems} />
                </Header>
                <div className="p-6 min-h-95 bg-white">
                    {children}
                </div>
            </Layout>
        )
    );
}

export default ProtectedRoute;