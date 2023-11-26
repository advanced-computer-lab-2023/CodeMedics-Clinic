import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import ClipboardDocumentListIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon"
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect('http://localhost:8000')
function VideoCall() {
	const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

	socket.on("me", (id) => {
			setMe(id)
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}

	return (
		<>
			<h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
		<div className="container">
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
				</div>
			</div>
			<div className="myId">
				<TextField
					id="filled-basic"
					label="Name"
					variant="filled"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>
				<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
					<Button variant="contained" color="primary" startIcon={<ClipboardDocumentListIcon fontSize="large" />}>
						Copy ID
					</Button>
				</CopyToClipboard>

				<TextField
					id="filled-basic"
					label="ID to call"
					variant="filled"
					value={idToCall}
					onChange={(e) => setIdToCall(e.target.value)}
				/>
				<div className="call-button">
					{callAccepted && !callEnded ? (
						<Button variant="contained" color="secondary" onClick={leaveCall}>
							End Call
						</Button>
					) : (
						<IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
							<PhoneIcon fontSize="large" />
						</IconButton>
					)}
					{idToCall}
				</div>
			</div>
			<div>
				{receivingCall && !callAccepted ? (
						<div className="caller">
						<h1 >{name} is calling...</h1>
						<Button variant="contained" color="primary" onClick={answerCall}>
							Answer
						</Button>
					</div>
				) : null}
			</div>
		</div>
		</>
	)
}

export default VideoCall;