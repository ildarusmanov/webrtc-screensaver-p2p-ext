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
}

chooseDesktopMedia = () => {
    chrome.desktopCapture.chooseDesktopMedia([
        'screen', 'window', 'tab'
    ], tab, function(streamId) {
        if (chrome.runtime.lastError) {
            alert('Failed to get desktop media: ' + chrome.runtime.lastError.message);
            return;
        }   

        // I am using inline code just to have a self-contained example.
        // You can put the following code in a separate file and pass
        // the stream ID to the extension via message passing if wanted.
        var code = (streamId) => {
            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: streamId
                    }   
                }   
            }, function onSuccess(stream) {
                pc.addStream(document.getElementById('video1').srcObject = stream)
                pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)
            }, function onError() {
                alert('Failed to get user media.');
            }); 
        }

        code(streamId);
    });
}


document.getElementById('startSessionBtn').addEventListener('click', chooseDesktopMedia, false);