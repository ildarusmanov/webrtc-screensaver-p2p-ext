console.log('popup.js')

let sd = ''
let pc = new RTCPeerConnection({
    iceServers: [
        {
        urls: 'stun:stun.l.google.com:19302'
        }
    ]
})

let displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

var log = msg => {
    console.log(`${msg}`)
}

navigator.mediaDevices
         .getUserMedia({ video: true, audio: true })
         .then(stream => {
             pc.addStream(document.getElementById('videoCamera').srcObject = stream)
             pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)
         }).catch(log)
    
navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
         .then(stream => {
            pc.addStream(document.getElementById('videoScreen').srcObject = stream)
            pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)
         })

pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
pc.onicecandidate = event => {
    if (event.candidate === null) {
        sd = btoa(JSON.stringify(pc.localDescription))

        console.log(sd);
    }
}

startRecording = (event) => {
    if (sd === '') {
        return alert('Session Description must not be empty')
    }

    try {
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
   } catch (e) {
        alert(e)
   } 

   // send session description to server
}

stopRecording = (event) => {
    pc.close();
}

document.getElementById('startSessionBtn').addEventListener('click', startRecording, false);
document.getElementById('stopSessionBtn').addEventListener('click', stopRecording, false);