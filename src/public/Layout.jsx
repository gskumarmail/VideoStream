// src/public/Layout.jsx
import React, { useState } from "react";
import { Layout, Menu, Input, Switch, ConfigProvider, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  DollarOutlined,
  SwapOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const PublicLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const selectedKey = location.pathname.split("/").pop();

  const [collapsed, setCollapsed] = useState(false);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {/* Full-width header */}
      <Header
        style={{
          width: "100%",
          background: isDarkMode ? "blue" : "#fff",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 18 }}>
            <span
            style={{
              fontSize: 20,
              color: "#000",
              cursor: "pointer",
              marginRight: 10
            }}
            onClick={toggleSider}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
            MyPublicSite
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Input.Search placeholder="Search videos..." style={{ maxWidth: 300 }} />
          <Switch
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
        </div>
      </Header>

      {/* Below header layout */}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={200}
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: isDarkMode ? "#1f1f1f" : "#fff" }}
          collapsible collapsed={collapsed} trigger={null}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/home">Home</Link>
            </Menu.Item>

            <Menu.Item key="cash" icon={<DollarOutlined />}>
              <Link to="/cash">Cash</Link>
            </Menu.Item>
            <Menu.Item key="trade" icon={<SwapOutlined />}>
              <Link to="/trade">Trade</Link>
            </Menu.Item>
            <Menu.Item key="fx" icon={<VideoCameraOutlined />}>
              <Link to="/fx">FX</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content style={{ marginBottom: 20 }}>
            <Outlet />
          </Content>

          <Footer style={{ textAlign: "center" }}>
            © 2025 Public Video Portal
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default PublicLayout;
