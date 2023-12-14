import React, { createContext, useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import socket from './socket';
import Cookies from 'js-cookie';

const SocketContext = createContext();

const VideoCallContext = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const me = Cookies.get('socketID');
  const [loop, setLoop] = useState(0);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {

    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setTimeout(() => {
          myVideo.current.srcObject = currentStream;
        }, 1000);
      });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);




  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      setTimeout(() => {
        userVideo.current.srcObject = currentStream;
      }, 1000);
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (username) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    peer.on('signal', (data) => {
      setTimeout(() => {
        socket.emit('callUser', { userToCall: username, signalData: data, from: me, name });
      }, 1000);
    });

    peer.on('stream', (currentStream) => {
      setTimeout(() => {
        userVideo.current.srcObject = currentStream;
      }, 1000);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { VideoCallContext, SocketContext };
