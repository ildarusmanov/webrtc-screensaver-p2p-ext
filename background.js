// frame.setAttribute("allow", "microphone; camera");

// let sd = ''
// let pc = new RTCPeerConnection({
//     iceServers: [
//         {
//         urls: 'stun:stun.l.google.com:19302'
//         }
//     ]
// })

// var log = msg => {
//     console.log(`${msg}`)
// }

// navigator.mediaDevices
//          .getUserMedia({ video: true, audio: true })
//          .then(stream => {
//              //pc.addStream(document.getElementById('video1').srcObject = stream)
//              pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)
//          }).catch(log)

// pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
// pc.onicecandidate = event => {
//     if (event.candidate === null) {
//         sd = btoa(JSON.stringify(pc.localDescription))

//         console.log(sd);
//     }
// }

// init = () => {
//     if (sd === '') {
//         return alert('Session Description must not be empty')
//     }

//     try {
//         pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
//     } catch (e) {
//         alert(e)
//     }
// }
console.log('background.js')
