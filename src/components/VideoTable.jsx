// src/components/VideoTable.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Modal, Form, Input, Row, Col, Tooltip, Space, Upload } from "antd";
import axios from "axios";
import VideoPreviewModal from "./VideoPreviewModal";
import UploadForm from "./UploadForm";

import { CopyOutlined, EditOutlined, DeleteOutlined, LinkOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";

const VideoTable = ({ category, refreshTrigger }) => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [editForm] = Form.useForm();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadRefreshKey, setUploadRefreshKey] = useState(0);
  const [updateRefreshKey, setUpdateRefreshKey] = useState(0);
  const [copiedVideoId, setCopiedVideoId] = useState(null);
  const [file, setFile] = useState(null);

  const fetchVideos = async () => {
    console.log("Fetchingvideos...");
    try {
      const res = await axios.get(`http://localhost:5000/videos/${category}`);
      console.log("Fetching videos...", res.data);
      setVideos(res.data);
      // setVideos([...res.data]); 
    } catch (err) {
      message.error("Failed to fetch videos");
    }
  };

  const deleteVideo = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${category}/${filename}`);
      message.success("Video deleted successfully");
      fetchVideos();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleEdit = (record) => {
    setEditingVideo(record);
    editForm.setFieldsValue({ title: record.title });
  };

 const saveEdit = async (values) => {

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    console.log('filename', file);
    if (file) {
        formData.append("file", file);
    }

  try {
    const res = await axios.put(
      `http://localhost:5000/api/videos/edit/${category}/${editingVideo.filename}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    message.success("Video updated successfully");
    setEditingVideo(null);
    setUpdateRefreshKey((prev) => prev + 1); // trigger reload
  } catch (err) {
    console.error("Edit failed", err);
    message.error("Failed to update video");
  }
};


  const handleCopy = (video) => {
    const streamUrl = `http://localhost:5000/api/videos/stream/${video.category}/${video.filename}?t=${Date.now()}`;
    navigator.clipboard.writeText(streamUrl)
      .then(() => {
        setCopiedVideoId(video.filename);
        message.success("Video URL copied!");
        setTimeout(() => setCopiedVideoId(null), 2000); // clear after 2s
      })
      .catch(() => {
        message.error("Failed to copy URL.");
      });
  };

  useEffect(() => {
    fetchVideos();
  }, [category, refreshTrigger, updateRefreshKey]);

  const columns = [
    {
      title: "Video",
      dataIndex: "url",
      key: "thumbnail",
      render: (url, record) => (
        <div
          onClick={() => setPreviewVideo(record)}
          style={{
            position: "relative",
            width: "160px",
            height: "90px",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
        >
        <video
            width="160"
            height="90"
            muted
            style={{
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                objectFit: "cover",
                cursor: "pointer",
            }}
            onClick={() => setPreviewVideo(record)}
        >
            <source src={`${url}?t=${Date.now()}`} type="video/mp4" />
        </video>
         <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M6.79 5.093a.5.5 0 0 1 .682-.183l4 2.5a.5.5 0 0 1 0 .86l-4 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .79-.407z" />
            </svg>
          </div>
        </div>
      ),
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const streamUrl = `http://localhost:5000/api/videos/stream/${record.category}/${record.filename}?t=${Date.now()}`;
        return (<Space>
        
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewVideo(record)}>View</Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteVideo(record.filename)}>
            <Button
              icon={<DeleteOutlined />}
             >Delete</Button>
          </Popconfirm>
          <Tooltip
            title={
              copiedVideoId === record.filename
                ? "Copied!"
                : "Copy video URL"
            }
          >
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="Open video in new tab">
          <Button
            icon={<LinkOutlined />}
            onClick={() => window.open(streamUrl, "_blank")}
          />
        </Tooltip>
        </Space>
      );
    },
    },
  ];

  return (
    <>
      <div style={{ fontWeight: "bold", fontSize: 18,  textTransform: "capitalize"}}>📊 {category}</div>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={() => setUploadModalVisible(true)}>
            Add Video
          </Button>
        </Col>
      </Row>

      <Table key={updateRefreshKey} rowKey="filename" dataSource={videos} columns={columns} pagination={{ pageSize: 5 }} />
{/* Edit Video Form */}
      <Modal
  title="Edit Video"
  open={!!editingVideo}
  onOk={editForm.submit}
  onCancel={() => setEditingVideo(null)}
  okText="Save"
>
  <Form
    form={editForm}
    layout="vertical"
    initialValues={{
      title: editingVideo?.title,
      description: editingVideo?.description,
    }}
    onFinish={(values) => saveEdit(values)}
    encType="multipart/form-data"
  >
    <Form.Item
      name="title"
      label="Title"
      rules={[{ required: true, message: "Title is required" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true, message: "Description is required" }]}
    >
      <Input.TextArea rows={3} />
    </Form.Item>

    <Form.Item name="file" label="Replace Video (optional)">
      <Upload beforeUpload={(file) => { setFile(file); return false; }} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select Video</Button>
      </Upload>
    </Form.Item>
  </Form>
</Modal>


      {previewVideo && (
        <VideoPreviewModal
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}

      <Modal
        title="Upload Video"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <UploadForm
          category={category}
          onUploadSuccess={() => {
            setUploadModalVisible(false);
            setUploadRefreshKey((prev) => prev + 1);
          }}
        />
      </Modal>
    </>
  );
};

export default VideoTable;
