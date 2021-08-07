var log = msg => {
    console.log(`${msg}`)
}

var pc = new RTCPeerConnection({
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        },
        {
            urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        }
    ]
})

pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
pc.onicecandidate = event => {
    if (event.candidate === null) {
        // Соединение открыто
        //document.getElementById('localSessionDescription').value = btoa(JSON.stringify(pc.localDescription))

    }
}

var socket = new WebSocket(`ws://localhost:8000/api/v1/recorder/ws`);

socket.addEventListener('open', function (event) {
    console.log("socket opened")
});

// Наблюдает за сообщениями
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);

    const obj = JSON.parse(event.data)

    console.log(obj)

    if (obj.type == 'signal') {
        if (obj.value == 'sd') {
            try {
                console.log("set remote description")
                pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(obj.content))))
            } catch (e) {
                alert(e)
            }
        } 
    }
});

var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

var loadCamera = () => {
    navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(stream => {
                document.getElementById('videoCamera').srcObject = stream

                var videoTracks = stream.getVideoTracks();
                var audioTracks = stream.getAudioTracks();
                if (videoTracks.length > 0) {
                    console.log('camera Using video device: ' + videoTracks[0].label);
                }
                if (audioTracks.length > 0) {
                    console.log('camera Using audio device: ' + audioTracks[0].label);

                    loadScreen(audioTracks[0])
                } else {
                    loadScreen(null)
                }
            }).catch(log)
}

var loadScreen = (microphone) => {
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
            .then(stream => {
                document.getElementById('videoScreen').srcObject = stream

                if (microphone != null) {
                    stream.addTrack(microphone)
                }

                pc.addStream(stream)

                var videoTracks = stream.getVideoTracks();
                var audioTracks = stream.getAudioTracks();
                if (videoTracks.length > 0) {
                    console.log('screen Using video device: ' + videoTracks[0].label);
                }
                if (audioTracks.length > 0) {
                    console.log('screen Using audio device: ' + audioTracks[0].label);
                }
            }).catch(log)
}

startRecording = (event) => {
    pc.createOffer().then(d => {
        pc.setLocalDescription(d)

        console.log("set local description", d)

        console.log({
            type: "recorder",
            value: "start",
            content: btoa(JSON.stringify(d))
        })
    
        socket.send(JSON.stringify({
            type: "recorder",
            value: "start",
            content: btoa(JSON.stringify(d))
        }))
    }).catch(log)
}

stopRecording = (event) => {
    socket.send(JSON.stringify({
        type: "recorder",
        value: "stop"
    }))

    pc.close();
    socket.close();
}

loadCamera()

document.getElementById('startSessionBtn').addEventListener('click', startRecording, false);
document.getElementById('stopSessionBtn').addEventListener('click', stopRecording, false);