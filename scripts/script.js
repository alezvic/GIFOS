// Scripts for GIFOS
// 

// GUI elements
const input_search = document.getElementById('input_search');
const btn_search = document.getElementById('btn_search');
const btn_trending = document.getElementById('btn_trending');
const div_gifShowcase = document.getElementById('gif_showcase');

// API variables
const search_base_url = 'https://api.giphy.com/v1/gifs/search';
const trending_base_url = 'https://api.giphy.com/v1/gifs/trending';
const api_key = '2QRBa2w3k34LbUKfXGoNpuL3Mj6sHAEQ';

//http://api.giphy.com/v1/gifs/search?q=KEYWORD&limit=5
//&api_key=API_KEY

async function fetchData(url) {

    const data = await fetch(url)
        // .then(response => data=response.json())
        // .catch((err) => { console.log(err) });

    return data.json();
}

async function search(query, limit=12) {

    let data = await fetchData(`${search_base_url}?q=${query}&api_key=${api_key}&limit=${limit}`);

    return data;
}

async function getTrending(limit=12){
    let data = await fetchData(`${trending_base_url}?api_key=${api_key}&limit=${limit}`);

    return data;
}

function createImgs(data) {

    for (let i = 0; i < data.data.length; i++) {
        var gif_img = document.createElement('img');
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_gifShowcase.appendChild(gif_img);
    }
}

btn_search.addEventListener('click',()=>{search('joey').then(response=>{createImgs(response);});})
btn_trending.addEventListener('click',()=>{getTrending().then(response=>{createImgs(response);});})


// search('joey',12).then(response=>{createImgs(response)});
//getTrending().then(response=>{createImgs(response)});