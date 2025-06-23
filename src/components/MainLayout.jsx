// src/components/MainLayout.jsx
import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  VideoCameraOutlined,
  DollarOutlined,
  SwapOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split("/").pop();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("auth");
      navigate("/login");
    }
  };


  const SettingsMenu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="profile" icon={<UserOutlined />} >Profile</Menu.Item>
    <Menu.Item key="webview" icon={<GlobalOutlined />}>
  <a href="/home" target="_blank" rel="noopener noreferrer">
    Web View
  </a>
</Menu.Item>

    <Menu.Item key="logout" icon={<LogoutOutlined />} >Logout</Menu.Item>
  </Menu>
);


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" style={{ color: "white", padding: "16px", textAlign: "left", fontWeight: "bold" }}>
            Video CMS Admin <Avatar icon={<UserOutlined />} />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} onClick={(e) => navigate(`/app/${e.key}`)}>

            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>

          <Menu.Item key="cash" icon={<DollarOutlined />}>
            Cash
          </Menu.Item>
          <Menu.Item key="trade" icon={<SwapOutlined />}>
            Trade
          </Menu.Item>
          <Menu.Item key="fx" icon={<VideoCameraOutlined />}>
            FX
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>Admin Panel</div>
            <Dropdown overlay={SettingsMenu} placement="bottomRight">
              <Avatar icon={<SettingOutlined />} style={{ cursor: "pointer" }} />
            </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px" }}>
          <Outlet />
        </Content>
        {/* Footer */}
          <Footer style={{ textAlign: "center" }}>
            © 2025 Admin Dashboard. All Rights Reserved.
          </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
