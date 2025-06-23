// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, message } from "antd";
import axios from "axios";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    cash: 0,
    trade: 0,
    fx: 0,
  });

  const fetchCounts = async () => {
    try {
      const [cashRes, tradeRes, fxRes] = await Promise.all([
        axios.get("http://localhost:5000/videos/cash"),
        axios.get("http://localhost:5000/videos/trade"),
        axios.get("http://localhost:5000/videos/fx"),
      ]);
      setCounts({
        cash: cashRes.data.length,
        trade: tradeRes.data.length,
        fx: fxRes.data.length,
      });
    } catch (error) {
      message.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Cash Videos"
              value={counts.cash}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Trade Videos"
              value={counts.trade}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="FX Videos"
              value={counts.fx}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
