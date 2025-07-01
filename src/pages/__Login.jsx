// src/pages/Login.jsx
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
// import '../styles/theme.css';

const Login = () => {
  const navigate = useNavigate();

 /* const [users, setUsers] = useState([]);
  
useEffect(() => {
    axios.get("http://localhost:5000/api/admin").then((res) => setUsers(res.data));

    axios.get("/api/users", {
    headers: {
        "x-user-role": "superadmin"
    }
    });


}, []); */

  const onFinish = (values) => {
    const { username, password } = values;

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("auth", "true");
      message.success("Login successful");
      navigate("/app");
    } else {
      message.error("Invalid credentials");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card title="Admin Login" style={{ width: 300 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="Enter admin username" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
