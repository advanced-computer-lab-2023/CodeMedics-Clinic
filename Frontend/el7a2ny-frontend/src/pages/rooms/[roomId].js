import { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import { Layout as DashboardLayout } from "src/layouts/dashboard/user/layout";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import socket from "src/components/socket";
import Meet from "src/components/Meet/Meet";

function Page() {
  const router = useRouter();
  const { roomId } = router.query;
  const [peers, setPeers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const userVideo = useRef();
  const streamRef = useRef();
  const peersRef = useRef([]);

  const username = Cookies.get("username");

  useEffect(() => {
    socket.emit("create-room", roomId);
  }, [roomId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        userVideo.current.srcObject = stream;
        socket.emit("join-room", roomId, socket.id, username);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }, [roomId, username]);

  const toggleAudio = async () => {
    const audioTracks = streamRef.current.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !audioEnabled;
    });

    const newAudioTrack = streamRef.current.getAudioTracks()[0];

    peersRef.current.forEach(({ peer }) => {
      const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "audio");
      if (sender && sender.track !== newAudioTrack) {
        sender.replaceTrack(newAudioTrack);
      }
    });
    setAudioEnabled(!audioEnabled);
  };

  const toggleVideo = async () => {
    const videoTracks = streamRef.current.getVideoTracks();
    videoTracks.forEach((track) => {
      track.enabled = !videoEnabled;
    });

    const newVideoTrack = streamRef.current.getVideoTracks()[0];
    peersRef.current.forEach(({ peer }) => {
      const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video");
      if (sender && sender.track !== newVideoTrack) {
        sender.replaceTrack(newVideoTrack);
      }
    });

    setVideoEnabled(!videoEnabled);
  };

  useEffect(() => {
    socket.on("existing-users", (users) => {
      const peersArray = users.map(({ userId, name }) => {
        const peer = createPeer(userId, streamRef.current);
        peersRef.current.push({ peerId: userId, peer, name });
        return { peerId: userId, peer, name };
      });
      setPeers(peersArray);
    });

    socket.on("user-connected", ({ userId, name }) => {
      const peer = addPeer(userId, streamRef.current);
      peersRef.current.push({ peerId: userId, peer, name });
      setPeers((prevPeers) => [...prevPeers, { peerId: userId, peer, name }]);
    });

    socket.on("user-disconnected", (userId) => {
      const peerObj = peersRef.current.find((p) => p.peerId === userId);
      if (peerObj) peerObj.peer.destroy();
      peersRef.current = peersRef.current.filter((p) => p.peerId !== userId);
      setPeers((prevPeers) => prevPeers.filter((p) => p.peerId !== userId));
      console.log("user disconnected removing", userId);
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("existing-users");
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  function createPeer(userId, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (offer) => {
      socket.emit("offer", userId, offer);
    });

    peer.on("stream", (remoteStream) => {
      updatePeerStream(userId, remoteStream);
    });

    return peer;
  }

  function addPeer(userId, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (answer) => {
      socket.emit("answer", userId, answer);
    });

    peer.on("stream", (remoteStream) => {
      updatePeerStream(userId, remoteStream);
    });

    return peer;
  }

  function handleOffer(fromUserId, offer) {
    let existing = peersRef.current.find((p) => p.peerId === fromUserId);
    if (!existing) {
      existing = { peerId: fromUserId, peer: addPeer(fromUserId, streamRef.current) };
      peersRef.current.push(existing);
      setPeers((prev) => [...prev, existing]);
    }
    existing.peer.signal(offer);
  }

  function handleAnswer(fromUserId, answer) {
    const peerObj = peersRef.current.find((p) => p.peerId === fromUserId);
    if (peerObj) peerObj.peer.signal(answer);
  }

  function handleIceCandidate(fromUserId, candidate) {
    const peerObj = peersRef.current.find((p) => p.peerId === fromUserId);
    if (peerObj) peerObj.peer.signal(candidate);
  }

  function updatePeerStream(userId, remoteStream) {
    setPeers((prevPeers) =>
      prevPeers.map((peerObj) =>
        peerObj.peerId === userId ? { ...peerObj, remoteStream } : peerObj
      )
    );
  }

  const participants = [{ ref: userVideo, name: username }];

  for (let i = 0; i < peers.length; i++) {
    participants.push({ ref: peersRef.current[i].peer, name: peers[i].name });
  }

  return (
    <Meet
      participants={participants}
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      hasPendingRequests={true}
    />
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
