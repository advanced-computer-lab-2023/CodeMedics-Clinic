import { useRef, useEffect } from "react";

function Video({ peer }) {
  const ref = useRef();

  useEffect(() => {
    const handleStream = (stream) => {
      ref.current.srcObject = stream;
    };
    peer.on("stream", handleStream);
    return () => {
      peer.off("stream", handleStream);
    };
  }, [peer]);

  return (
    <div>
      <video ref={ref} autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

export default Video;
