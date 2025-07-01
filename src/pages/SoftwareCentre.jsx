// src/pages/SoftwareCentre.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";

const SoftwareCentre = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/software");
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      message.error("Failed to fetch software data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const onFinish = async (values) => {
    try {
      if (editingRecord) {
        await axios.put(
          `http://localhost:5000/api/software/${editingRecord.id}`,
          values
        );
        message.success("Updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/software", values);
        message.success("Added successfully");
      }
      setModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Operation failed");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/software/${id}`);
      message.success("Deleted successfully");
      fetchData();
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleDownload = (downloadURL) => {
      window.open(downloadURL, '_blank');
  }
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Software List");
    XLSX.writeFile(workbook, "software_centre.xlsx");
  };

  const columns = [
    { title: "File Name", dataIndex: "fileName", key: "fileName" },
    { title: "File Description", dataIndex: "fileDesc", key: "fileDesc" },
    { title: "File Size", dataIndex: "fileSize", key: "fileSize" },
    { title: "File Version", dataIndex: "fileVersion", key: "fileVersion" },
    {
      title: "Download URL",
      dataIndex: "downloadURL",
      key: "downloadURL",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button color="primary" variant="outlined" icon={<DownloadOutlined />} />
              
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure delete this item?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const modalStyles = {
    header: {
      borderBottom: "1px solid #f5f5f5 ",
      borderRadius: 0,
      paddingInlineStart: 5,
      paddingBottom: 10
    }
}

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Software Centre</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Search by file name"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingRecord(null);
            form.resetFields();
            setModalVisible(true);
          }}>
            Add New File
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
      />

      <Modal
        title={editingRecord ? "Edit File" : "Add New File"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
        styles={modalStyles}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fileName"
            label="File Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="fileDesc" label="File Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fileSize" label="File Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fileVersion" label="File Version" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="downloadURL" label="File Download URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SoftwareCentre;
