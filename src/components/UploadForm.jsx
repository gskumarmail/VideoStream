import React, { useRef, useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
// import VideoTable from "./VideoTable";

const UploadForm = ({ category,  onUploadSuccess}) => {
  const [file, setFile] = useState(null);
 const [refreshTrigger, setRefreshTrigger] = useState(0);
  const onFinish = async (values) => {
    if (!file) {
      message.error("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:5000/upload/${category}`, formData);
      message.success("Video uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      message.error("Upload failed");
    }
  };

  return (
    <>
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="video" label="Video File" rules={[{ required: true }]}>
        <Upload beforeUpload={(file) => { setFile(file); return false; }} maxCount={1}>
          <Button icon={<UploadOutlined />}>Select Video</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Upload</Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default UploadForm;
