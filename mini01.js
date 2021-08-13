const video = document.querySelector('#videoElement')

const loadFaceAPI = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models')
    await faceapi.nets.faceExpressionNet.loadFromUri('./models')
}

function getCameraRig(){
    if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video: {} })
        .then(stream => {
            video.srcObject = stream;
        });
    }
}

video.addEventListener('playing', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight
    }
    setInterval( async ()=>{
        const detect = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()

        const resize = faceapi.resizeResults(detect, displaySize)
        canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height)
        faceapi.draw.drawDetections(canvas, resize)
        faceapi.draw.drawFaceLandmarks(canvas, resize)
        faceapi.draw.drawFaceExpressions(canvas, resize)
    }, 200)
    
})

loadFaceAPI().then(getCameraRig)


