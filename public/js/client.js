const btnJoinBroadcaster = document.getElementById("joinBroadcaster");
const broadcasterName = document.getElementById("broadcasterName");
const viewers = document.getElementById("viewers");
const inputRoomNumber = document.getElementById("id_grupo");
const inputName = document.getElementById("name");
const divSelectRoom = document.getElementById("form");
const videoElement = document.querySelector("video");
const divConsultingRoom = document.getElementById("consultingRoom");
const btnJoinViewer = document.getElementById("joinViewer")

// variables
let user;
let rtcPeerConnections = {};

// constants
const iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
    ],
};
const streamConstraints = { audio: true, video: { height: 480 } };

// Let's do this 💪
var socket = io();

if (btnJoinBroadcaster != null ){
    btnJoinBroadcaster.onclick = function () {
        if (inputRoomNumber.value === "" || inputName.value === "") {
            alert("Please type a room number and a name");
        } else {
            user = {
                room: inputRoomNumber.value,
                name: inputName.value,
            };
            console.log(inputRoomNumber.value + " - " + inputName.value)
    
            divSelectRoom.style = "display: none;";
            divConsultingRoom.style = "display: block;";
    
            navigator.mediaDevices
                .getUserMedia(streamConstraints)
                .then(function (stream) {
                    videoElement.srcObject = stream;
                    socket.emit("register as broadcaster", user.room);
                })
                .catch(function (err) {
                    console.log("An error ocurred when accessing media devices", err);
                });
        }
    };
}

if (btnJoinViewer != null) {
    btnJoinViewer.onclick = function () {
        if (inputRoomNumber.value === "" || inputName.value === "") {
            alert("Please type a room number and a name");
        } else {
            user = {
                room: inputRoomNumber.value,
                name: inputName.value,
            };
            console.log(inputRoomNumber.value + " - " + inputName.value)
    
            divSelectRoom.style = "display: none;";
            divConsultingRoom.style = "display: block;";
    
            socket.emit("register as viewer", user);
        }
    };
}


// message handlers
socket.on("new viewer", function (viewer) {
    rtcPeerConnections[viewer.id] = new RTCPeerConnection(iceServers);

    const stream = videoElement.srcObject;
    stream
        .getTracks()
        .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream));

    rtcPeerConnections[viewer.id].onicecandidate = (event) => {
        if (event.candidate) {
            console.log("sending ice candidate");
            socket.emit("candidate", viewer.id, {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            });
        }
    };

    rtcPeerConnections[viewer.id]
        .createOffer()
        .then((sessionDescription) => {
            rtcPeerConnections[viewer.id].setLocalDescription(sessionDescription);
            socket.emit("offer", viewer.id, {
                type: "offer",
                sdp: sessionDescription,
                broadcaster: user,
            });
        })
        .catch((error) => {
            console.log(error);
        });

    let li = document.createElement("li");
    li.innerText = viewer.name + " esta viendo la clase";
    viewers.appendChild(li);
});

socket.on("candidate", function (id, event) {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
    });
    rtcPeerConnections[id].addIceCandidate(candidate);
});

socket.on("offer", function (broadcaster, sdp) {
    broadcasterName.innerText = broadcaster.name + " esta en vivo...";

    rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(iceServers);

    rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);

    rtcPeerConnections[broadcaster.id]
        .createAnswer()
        .then((sessionDescription) => {
            rtcPeerConnections[broadcaster.id].setLocalDescription(
                sessionDescription
            );
            socket.emit("answer", {
                type: "answer",
                sdp: sessionDescription,
                room: user.room,
            });
        });

    rtcPeerConnections[broadcaster.id].ontrack = (event) => {
        videoElement.srcObject = event.streams[0];
    };

    rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
        if (event.candidate) {
            console.log("sending ice candidate");
            socket.emit("candidate", broadcaster.id, {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            });
        }
    };
});

socket.on("answer", function (viewerId, event) {
    rtcPeerConnections[viewerId].setRemoteDescription(
        new RTCSessionDescription(event)
    );
});