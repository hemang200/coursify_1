function VideoPlayer({ videoUrl, title }) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div>
      {videoError ? (
        <div>Video failed to load: {videoUrl}</div>
      ) : (
        <video 
          controls 
          width="100%" 
          onError={() => setVideoError(true)}
          onLoadStart={() => console.log("Video loading started")}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          Your browser does not support video playback.
        </video>
      )}
    </div>
  );
}
