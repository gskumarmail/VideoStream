// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Typography, Card, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleFinish = async (values) => {
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", values);
      localStorage.setItem("user", JSON.stringify(res.data));
      // onLogin(res.data); // store user and redirect
      navigate("/app");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card
        bordered={false}
        style={{
          width: 400,
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      >
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 12 }} />
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Admin Login
            </Title>
          </Col>
        </Row>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
