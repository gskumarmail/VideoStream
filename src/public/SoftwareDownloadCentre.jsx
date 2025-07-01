// src/public/SoftwareDownloadCentre.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, message, Typography } from "antd";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SoftwareDownloadCentre = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSoftwareList = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/software");
      setSoftwareList(res.data);
    } catch (err) {
      message.error("Failed to fetch software list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftwareList();
  }, []);

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Description",
      dataIndex: "fileDesc",
      key: "fileDesc",
    },
    {
      title: "Size",
      dataIndex: "fileSize",
      key: "fileSize",
    },
    {
      title: "Version",
      dataIndex: "fileVersion",
      key: "fileVersion",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          href={record.downloadURL}
          target="_blank"
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Software Download Centre</Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={softwareList}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default SoftwareDownloadCentre;
