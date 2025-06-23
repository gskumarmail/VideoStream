// src/public/Fx.jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

const VideoGrid = lazy(() => import("./VideoGrid"));

const Fx = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/videos/fx").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <h2>FX Videos</h2>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading videos...</div>}>
        <VideoGrid videos={videos} />
      </Suspense>
    </div>
  );
};

export default Fx;
