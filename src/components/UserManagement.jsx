// src/components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
  Popconfirm,
  Row, 
  Col,
  Avatar,
  Select,
  Tooltip
} from "antd";
import { DeleteOutlined, LoginOutlined, LogoutOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { "x-user-role": "superadmin" },
      });
      console.log(res.data);
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    }
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:5000/api/users", values, {
        headers: { "x-user-role": "superadmin" },
      });
      message.success("Admin created successfully");
      form.resetFields();
      setFormVisible(false);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Failed to add admin");
    }
  };

  const handleDelete = async (email) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/${email}`, {
      headers: { "x-user-role": "superadmin" },
    });
    message.success("Admin deleted");
    fetchAdmins();
  } catch (err) {
    message.error(err.response?.data?.error || "Delete failed");
  }
};

const handleToggle = async (email) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/users/${email}/toggle`,
      {},
      { headers: { "x-user-role": "superadmin" } }
    );
    message.success(res.data.message);
    fetchAdmins();
  } catch (err) {
    message.error(err.response?.data?.error || "Status update failed");
  }
};

  const filteredUsers = admins.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar icon={<UserOutlined />} />
            <Title level={4} style={{ margin: 0 }}>Admin User Management</Title>
          </div>
        </Col>
        <Col>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Input
              placeholder="Search admin..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" onClick={() => setFormVisible(true)}>
              Add Admin
            </Button>
         </div>
          
        </Col>
    </Row>
      <Table
        rowKey={(record) => record.email}
        dataSource={filteredUsers}
        columns={[
          { title: "Username", dataIndex: "username" },
          { title: "Email", dataIndex: "email" },
          { title: "Role", dataIndex: "role" },
          {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
              <Space>
                <Popconfirm title="Are you sure you want to Delete this admin user?" onConfirm={() => handleDelete(record.email)}>
                  <Tooltip title="Delete User">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Tooltip>
                </Popconfirm>
                <Popconfirm title={record.status
      ? "Are you sure you want to Deactivate this admin user?"
      : "Are you sure you want to Reactivate this admin user?"} onConfirm={() => handleToggle(record.email)}>
         <Tooltip title={ record.status === "active" ? "Active User" : "In Active User" }>
                  <Button 
                    // onClick={() => handleToggle(record.email, record.status)}
                    icon={ record.status === "active" ? <LogoutOutlined /> : <LoginOutlined /> }
                    size="small"
                  />
            </Tooltip>
                </Popconfirm>
              </Space>
            )
          }

        ]}
      />

      <Modal
        title="Add Admin User"
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        onOk={handleAdd}
        okText="Create"
      >
      
        <Form form={form} layout="vertical">
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select a role" name="role" >
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Super Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
