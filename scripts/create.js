// Camera record, gif creation and upload for GIFOS
// 

// GUI Elements
const div_cam_preview = document.getElementById('video_cam_preview');
const btn_record = document.getElementById('btn_record');
const btn_stop = document.getElementById('btn_stop');
const btn_upload = document.getElementById('btn_upload');
const link_gif = document.getElementById('linkgif');
const stream = null;
let recorder = null;
let form = new FormData();

const upload_url = 'https://upload.giphy.com/v1/gifs';

function record() {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
            div_cam_preview.srcObject = stream;
            div_cam_preview.play()
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 7,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: function () {
                    console.log('started')
                },
            });
            recorder.startRecording();
        });
}


async function stopStream() {



    div_cam_preview.srcObject = null;
    recorder.stopRecording();

    var blob = await recorder.getBlob();

    await form.append('file',blob, 'myGif.gif');

}

async function upload() {
    let uri = upload_url + '?api_key='+api_key;

    fetch(uri, {
        method: 'POST',
        mode: 'cors',
        body: form
    })
    .then(response => response.json())
    .then(result => {
        // console.log(`Resultado:${result}`);
        res = result;
        console.log(res); 
        console.log(res['data']['id']);   
        link_gif.setAttribute('href', 'https://giphy.com/gifs/'+res['data']['id']);
    
    })
    .catch(err => {
        console.log(err);
    });
}


btn_record.addEventListener('click', () => {
    record();
});

btn_stop.addEventListener('click', () => {
    stopStream();
});

btn_upload.addEventListener('click', () => {
    upload();
});