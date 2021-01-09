// Camera record, gif creation and upload for GIFOS
// 

// API key
const api_key = '2QRBa2w3k34LbUKfXGoNpuL3Mj6sHAEQ';

// GUI Elements
const div_cam_preview = document.getElementById('video_cam_preview');
const btn_start = document.getElementById('btn_start');
const btn_record = document.getElementById('btn_record');
const btn_stop = document.getElementById('btn_stop');
const btn_upload = document.getElementById('btn_upload');

const steps = document.getElementsByClassName('steps');

const allow_message = document.getElementById('allow_message');
const preview_message = document.getElementById('preview_message');
const cam_image = document.getElementById('cam_image');

const stream = null;
let recorder = null;
let form = new FormData();

const upload_url = 'https://upload.giphy.com/v1/gifs';

function onLoad() {
    allow_message.style.display = 'none';
}

function getMediaDevices() {
    
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
            div_cam_preview.srcObject = stream;
            div_cam_preview.play()
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 7,
                width: 640,
                hidden: 480,
                onGifRecordingStarted: function () {
                    console.log('started')
                },
            });
        })
        .catch(err => alert('No podemos grabar tu GIFO sin permisos para usar la cámara!'));
}

function record() {
    recorder.startRecording();
}

async function stopStream() {

    //div_cam_preview.srcObject = null;
    // TODO can we replay the recorded gif?
    recorder.stopRecording();

    var blob = await recorder.getBlob();

    form.append('file', blob, 'myGif.gif');

}

async function upload() {
    let uri = upload_url + '?api_key=' + api_key;

    fetch(uri, {
        method: 'POST',
        //        mode: 'cors',
        body: form
    })
        .then(response => response.json())
        .then(result => {
            // console.log(`Resultado:${result}`);
            res = result;
            console.log(res);
            console.log(res['data']['id']);
            // link_gif.setAttribute('href', 'https://giphy.com/gifs/'+res['data']['id']);
            // link_gif.innerText='Ahora si!';
        })
        .catch(err => {
            console.log(err);
        });
}

onLoad()

btn_start.addEventListener('click', ()=> {

    // TODO check if media devices is allowed, to hide back the permissions message
    preview_message.style.display = 'none';
    allow_message.style.display = 'block';
    getMediaDevices();
});

btn_record.addEventListener('click', () => {
    allow_message.style.display = 'none';
    record();
});

btn_stop.addEventListener('click', () => {
    stopStream();
});

btn_upload.addEventListener('click', () => {
    upload();
});