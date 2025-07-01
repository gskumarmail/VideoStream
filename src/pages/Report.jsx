import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Select, Space, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const { Title } = Typography;
const { Option } = Select;

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");


  const exportToExcel = () => {
    if (!reportData.length) {
        return message.warning("No data to export");
    }

    const worksheetData = reportData.map((item) => ({
        Category: item.category,
        "Total Videos": item.totalVideos,
        "Total Likes": item.totalLikes,
        "Total Views": item.totalViews,
        "Total Comments": item.totalComments,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Video Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "VideoReport.xlsx");
  };


  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos/report");
        setReportData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch report", err);
      }
    };
    fetchReport();
  }, []);

  const categoryData = selectedCategory === "all"
    ? reportData
    : reportData.filter(item => item.category === selectedCategory);

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4}>📈 Video Analytics Report</Title>
        <Space>
            <Select value={selectedCategory} onChange={setSelectedCategory} style={{ width: 200 }}>
            <Option value="all">All Categories</Option>
            {reportData.map(r => (
                <Option key={r.category} value={r.category} style={{textTransform: "capitalize"}}>{r.category}</Option>
            ))}
            </Select>
            <Button color="primary" variant="outlined" icon={<DownloadOutlined />} onClick={exportToExcel}>
                Export to Excel
            </Button>
        </Space>
     </Row>


      <Row gutter={[16, 16]}>
        {categoryData?.map((stat) => (
          <Col xs={24} sm={12} md={6} key={stat.category}>
            <Card title={stat?.category?.toUpperCase() || "Title"} bordered>
              <Statistic title="Total Videos" value={stat?.totalViews || 0} />
              <Statistic title="Total Likes" value={stat?.totalLikes || 0} />
              <Statistic title="Total Views" value={stat?.totalViews || 0} />
              <Statistic title="Total Comments" value={stat?.totalComments || 0} />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 40 }}>
        <Title level={4}>Views Over Time</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalViews" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Report;
