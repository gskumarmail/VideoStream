// src/public/Trade.jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

const VideoGrid = lazy(() => import("./VideoGrid"));

const Trade = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/videos/trade").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <h2>Trade Videos</h2>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading videos...</div>}>
        <VideoGrid videos={videos} />
      </Suspense>
    </div>
  );
};

export default Trade;
