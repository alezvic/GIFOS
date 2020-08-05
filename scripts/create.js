// Camera record, gif creation and upload for GIFOS
// 

// GUI Elements
const div_cam_preview = document.getElementById('video_cam_preview');
const btn_record = document.getElementById('btn_record');

async function getStreamAndRecord() {
    let stream = null;
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: { max: 480}
            }
        });
        div_cam_preview.srcObject = stream;
        div_cam_preview.play();
    } 
    catch(error) {
        console.log(error);
    }
}

btn_record.addEventListener('click', () => {
    console.log('button');
    // playVideoPreview();
    getStreamAndRecord();
});