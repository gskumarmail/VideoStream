import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Row, Col, List, Typography, Card, Tooltip, message, Button } from "antd";
import { CopyOutlined, LinkOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import VideoComments from "./VideoComments";

const { Title } = Typography;

const VideoGallery = () => {
  const { category } = useParams(); // cash, trade, fx
  const location = useLocation(); // to receive selected video
  const selectedVideoFromLink = location.state?.video;

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/videos/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        const defaultVideo =
          selectedVideoFromLink ||
          data.find((v) => v.filename === selectedVideoFromLink?.filename) ||
          data[0];
        setCurrentVideo(defaultVideo);
      })
      .catch(console.error);
  }, [category, selectedVideoFromLink]);

  const handleSelect = (video) => {
    setCurrentVideo(video);
  };

  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      {/* Left column: Related videos list */}
       <Col xs={24} md={16}>
        {currentVideo && (
          <Card bordered style={{ borderRadius: 8 }}>
            <video
              key={currentVideo.filename}
              width="100%"
              height="480"
              controls
              autoPlay
              style={{ borderRadius: 8 }}
            >
              <source
                src={`http://localhost:5000/api/videos/stream/${currentVideo.category}/${currentVideo.filename}?t=${Date.now()}`}
                type="video/mp4"
              />
            </video>
            {/* Title + Description */}
            <div style={{ marginTop: 12 }}>
              <Title level={4}>{currentVideo.title}</Title>
              <p>{currentVideo.description}</p>
            </div>
             {/* Icons Below Video */}
            <div style={{
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    flexWrap: "wrap",
  }}>
 
 {/* Like Button */}
  <Tooltip title="Like this video">
    <Button
      icon={<LikeOutlined />}
      onClick={() => message.success("You liked the video")}
    >
      Like
    </Button>
  </Tooltip>

  {/* Dislike Button */}
  <Tooltip title="Dislike this video">
    <Button
      icon={<DislikeOutlined />}
      onClick={() => message.info("You disliked the video")}
    >
      Dislike
    </Button>
  </Tooltip>

  {/* Copy URL */}
  <Tooltip title="Copy video URL">
    <Button
      icon={<CopyOutlined />}
      onClick={() => {
        const url = `http://localhost:5000/api/videos/stream/${currentVideo.category}/${currentVideo.filename}?t=${Date.now()}`;
        navigator.clipboard.writeText(url);
        message.success("Copied video URL to clipboard");
      }}
    >
      Copy URL
    </Button>
  </Tooltip>

  {/* Open in New Tab */}
  <Tooltip title="Open video in a new tab">
    <Button
      icon={<LinkOutlined />}
      onClick={() => {
        const url = `http://localhost:5000/api/videos/stream/${currentVideo.category}/${currentVideo.filename}?t=${Date.now()}`;
        window.open(url, "_blank");
      }}
      type="default"
    >
      Open in Tab
    </Button>
  </Tooltip>
</div>

          </Card>
        )}
        <VideoComments videoId={currentVideo?.filename} />
      </Col>

      {/* Right column: Main video */}
      <Col xs={24} md={8}>
        <Title level={4} style={{textTransform: "capitalize" }}>Related {category} Videos</Title>
        <List
          itemLayout="horizontal"
          dataSource={videos}
          renderItem={(video) => (
            <List.Item
              style={{
                cursor: "pointer",
                backgroundColor:
                  currentVideo?.filename === video.filename
                    ? "#f0f0f0"
                    : "transparent",
                padding: "8px",
                borderRadius: 6,
              }}
              onClick={() => handleSelect(video)}
            >
              <List.Item.Meta
                avatar={
                  <video width={64} height={48} muted>
                    <source
                      src={`http://localhost:5000/api/videos/stream/${video.category}/${video.filename}?t=${Date.now()}`}
                      type="video/mp4"
                    />
                  </video>
                }
                title={video.title}
                description={video.description?.slice(0, 60) + "..."}
              />
            </List.Item>
          )}
        />
      </Col>

     
    </Row>
  );
};

export default VideoGallery;
