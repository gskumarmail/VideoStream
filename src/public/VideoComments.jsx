// src/public/components/VideoComments.jsx
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Form,
  Button,
  Input,
  List,
  Tooltip,
  Typography,
} from "antd";
import { LikeOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { Text } = Typography;

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${videoId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  const handleSubmit = async () => {
    if (!value) return;
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/comments", {
        videoId,
        text: value,
        author: "User", // Replace with actual user
      });
      setValue("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`http://localhost:5000/api/comments/${commentId}/like`);
      fetchComments();
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <Form.Item>
        <TextArea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a comment..."
        />
      </Form.Item>
      <Form.Item style={{ textAlign: "right" }}>
        <Button size="small" type="primary" loading={submitting} onClick={handleSubmit}>
            Add Comment
        </Button>
      </Form.Item>

      <List
        dataSource={comments}
        header={`${comments.length} ${comments.length === 1 ? "Comment" : "Comments"}`}
        itemLayout="horizontal"
        renderItem={(item) => (
          <List.Item
            actions={[
              <span onClick={() => handleLike(item.id)} style={{ cursor: "pointer" }}>
                <LikeOutlined /> {item.likes || 0}
              </span>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.author}`} />
              }
              title={item.author}
              description={
                <>
                  <Text>{item.text}</Text>
                  <br />
                  <Tooltip title={new Date(item.date).toLocaleString()}>
                    <Text type="secondary">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </Tooltip>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default VideoComments;
