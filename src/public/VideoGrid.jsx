// src/public/VideoGrid.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Modal, Typography, Skeleton } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";



const { Title, Paragraph } = Typography;

const VideoGrid = ({ videos, category, isLoading = false }) => {
 console.log('Grid Data', videos);
  const navigate = useNavigate();
  const [previewVideo, setPreviewVideo] = useState(null);

  const handlePreview = (video) => {
    setPreviewVideo(video);
  };

  return (
    <>

    {isLoading ? (
  <Row gutter={[16, 16]}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Col key={index} xs={24} sm={12} md={8}>
        <Card>
          <Skeleton.Image style={{ width: "100%", height: 200 }} active />
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </Col>
    ))}
  </Row>
) : videos.length === 0 ? (
  <div style={{ textAlign: "center", marginTop: 48 }}>
    <h3>No videos found</h3>
    <p>Please check back later or upload a new video.</p>
  </div>
) : (
      <Row gutter={[16, 16]}>
        {videos.map((video) => (
          <Col key={video.filename} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div loading="lazy"
                  style={{
                    position: "relative",
                    height: 200,
                    overflow: "hidden",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => handlePreview(video)}
                >
                  <video
                    width="100%"
                    height="200"
                    muted
                    style={{ objectFit: "cover" }}
                  >
                    <source src={`${video.url}?t=${Date.now()}`} type="video/mp4" />
                  </video>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.79 5.093a.5.5 0 0 1 .682-.183l4 2.5a.5.5 0 0 1 0 .86l-4 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .79-.407z" />
                    </svg>
                  </div>
                </div>
              }
            >
          
            
        <Card.Meta
  title={video.title}
  description={
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      {/* Left: Video Description */}
      <div>
        <div>{video.description}</div>
        <small>Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}</small>
        <br />
        <small>Views: {video.views || 0}</small>
      </div>

      {/* Right: Gallery View Button */}
      <button
        onClick={() =>
          navigate(`/videos/${video.category}`, { state: { video } })
        }
        style={{
          marginLeft: 16,
          padding: "4px 12px",
          fontSize: 12,
          backgroundColor: "#1890ff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Gallery View
      </button>
    </div>
  }
/>

        </Card>


        </Col>
        ))}
      </Row>
    )}
   {previewVideo && (
  <Modal
    open={true}
    title={<Title level={4} style={{ margin: 0 }}>{previewVideo.title}</Title>}
    onCancel={() => setPreviewVideo(null)}
    footer={null}
    width="100%"
    style={{ top: 0, right: 0, maxWidth: '960px', marginLeft: 'auto', height: '100vh' }}
    bodyStyle={{ height: '100%', overflow: 'auto', padding: 24 }}
  >
    <video
      width="100%"
      height="480"
      controls
      preload="metadata"
      autoPlay
      style={{ borderRadius: 8, marginBottom: 16 }}
    >
      <source src={`${previewVideo.url}?t=${Date.now()}`} type="video/mp4" />
    </video>

    <Paragraph>{previewVideo.description}</Paragraph>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
      <div>
        <button style={{
          backgroundColor: '#f0f0f0',
          border: 'none',
          color: '#555',
          padding: '8px 12px',
          fontSize: 14,
          borderRadius: 4,
          cursor: 'pointer',
          marginRight: 8
        }}>
          <LikeOutlined /> Like
        </button>
        <button style={{
          backgroundColor: '#f0f0f0',
          border: 'none',
          color: '#555',
          padding: '8px 12px',
          fontSize: 14,
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          <DislikeOutlined /> Dislike
        </button>
      </div>

      <button
        onClick={() => document.querySelector('video')?.requestFullscreen()}
        style={{
          backgroundColor: '#1890ff',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          fontSize: 14,
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        ⛶ Fullscreen
      </button>
    </div>
  </Modal>
)}


    </>
  );
};

export default VideoGrid;
