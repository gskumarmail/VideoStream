// src/components/VideoPreviewModal.jsx
import React from "react";
import { Modal, Typography } from "antd";

const { Title, Paragraph } = Typography;

const VideoPreviewModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <Modal
      open={!!video}
      title={video.title}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <video width="100%" controls>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ marginTop: 16 }}>
        <Title level={5}>Description</Title>
        <Paragraph>{video.description || "No description provided."}</Paragraph>
      </div>
    </Modal>
  );
};

export default VideoPreviewModal;
