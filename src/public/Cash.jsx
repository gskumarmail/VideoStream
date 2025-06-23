// src/public/Cash.jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

const VideoGrid = lazy(() => import("./VideoGrid"));

const Cash = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/videos/cash").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <h2>Cash Videos</h2>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading videos...</div>}>
        <VideoGrid videos={videos} category="cash" />
      </Suspense>
    </div>
  );
};

export default Cash;
