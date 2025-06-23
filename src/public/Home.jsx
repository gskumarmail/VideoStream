import React, { useEffect, useState, lazy, Suspense } from "react";

const VideoGrid = lazy(() => import("./VideoGrid"));

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/videos/all");
        const data = await res.json(); 
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
    <h2>All Videos</h2>
    <Suspense fallback={<div style={{ textAlign: "center" }}>Loading videos...</div>}>
      <VideoGrid videos={videos} isLoading={isLoading} />
    </Suspense>
    </>
  );
};

export default Home;
