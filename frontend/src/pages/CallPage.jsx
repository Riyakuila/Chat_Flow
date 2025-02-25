import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Peer from 'simple-peer';

const CallPage = () => {
  const navigate = useNavigate();
  const { authUser, socket } = useAuthStore();
  const [callData, setCallData] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const setupCall = async () => {
      try {
        // Get call data from localStorage
        const storedCallData = JSON.parse(localStorage.getItem('callData'));
        console.log('Retrieved call data:', storedCallData);

        if (!storedCallData) {
          console.log('No call data found');
          navigate('/chat');
          return;
        }

        setCallData(storedCallData);

        // Get media stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: storedCallData.isVideo,
          audio: true
        });

        console.log('Got media stream:', mediaStream);
        setStream(mediaStream);

        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }

        // If we're the call initiator
        if (storedCallData.isInitiator) {
          console.log('Initiating call as caller');
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: mediaStream
          });

          peer.on('signal', (signalData) => {
            console.log('Generated signal data, sending to:', storedCallData.receiverId);
            socket.emit('callUser', {
              userToCall: storedCallData.receiverId,
              signalData,
              from: authUser._id,
              name: authUser.fullName,
              isVideo: storedCallData.isVideo
            });
          });

          peer.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            if (userVideo.current) {
              userVideo.current.srcObject = remoteStream;
            }
          });

          connectionRef.current = peer;
        }
      } catch (err) {
        console.error('Error in setupCall:', err);
        endCall();
      }
    };

    if (socket) {
      setupCall();
    }

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('callAccepted', (signal) => {
      console.log('Call accepted, received signal:', signal);
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    socket.on('callDeclined', () => {
      console.log('Call declined');
      endCall();
    });

    socket.on('callError', (error) => {
      console.log('Call error:', error);
      alert(error.message);
      endCall();
    });

    return () => {
      socket.off('callAccepted');
      socket.off('callDeclined');
      socket.off('callError');
    };
  }, [socket]);

  const answerCall = async () => {
    try {
      console.log('Answering call with data:', callData);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });

      peer.on('signal', (signalData) => {
        console.log('Sending answer signal to:', callData.from);
        socket.emit('answerCall', {
          signal: signalData,
          to: callData.from
        });
      });

      peer.on('stream', (remoteStream) => {
        console.log('Received remote stream from caller');
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      peer.signal(callData.signal);
      setCallAccepted(true);
      connectionRef.current = peer;
    } catch (err) {
      console.error('Error in answerCall:', err);
      endCall();
    }
  };

  const endCall = () => {
    console.log('Ending call');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    localStorage.removeItem('callData');
    navigate('/chat');
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (stream && callData?.isVideo) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  if (!callData) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      {/* Incoming call UI */}
      {!callAccepted && !callData.isInitiator && (
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">{callData.name} is calling...</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={endCall}
              className="btn btn-error btn-circle btn-lg"
            >
              Decline
            </button>
            <button
              onClick={answerCall}
              className="btn btn-success btn-circle btn-lg"
            >
              Answer
            </button>
          </div>
        </div>
      )}

      {/* Call in progress UI */}
      {(callAccepted || callData.isInitiator) && (
        <>
          <div className="relative w-full h-full">
            {callData.isVideo ? (
              <>
                <video
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <video
                  ref={myVideo}
                  autoPlay
                  playsInline
                  muted
                  className="absolute top-4 right-4 w-48 h-72 object-cover rounded-lg"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="w-32 h-32 rounded-full bg-purple-500 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">{callData.name?.[0]}</span>
                  </div>
                  <h2 className="text-2xl">{callData.name}</h2>
                  <p className="mt-2">Voice call in progress...</p>
                </div>
              </div>
            )}
          </div>

          {/* Call controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`btn ${isMuted ? 'btn-error' : 'btn-ghost'} btn-circle btn-lg`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            {callData.isVideo && (
              <button
                onClick={toggleCamera}
                className={`btn ${isCameraOff ? 'btn-error' : 'btn-ghost'} btn-circle btn-lg`}
              >
                {isCameraOff ? 'Start Video' : 'Stop Video'}
              </button>
            )}

            <button
              onClick={endCall}
              className="btn btn-error btn-circle btn-lg"
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CallPage; 