// Scripts for GIFOS
// 

//  HOW A SEARCH REQUEST SHOULD LOOK LIKE
//http://api.giphy.com/v1/gifs/search?q=KEYWORD&limit=12&api_key=API_KEY

/*  TODO 

    1. Where the heck do I put the catches!???
    2. Clean images after first appendChildren
    3. Add offset to requests
    4. What size of gif is appropiated??

 */

//  GUI elements
const input_search = document.getElementById('input_search');
const btn_search = document.getElementById('btn_search');
const btn_trending = document.getElementById('btn_trending');
const div_gifShowcase = document.getElementById('gif_showcase');
const div_trendingLinksContainer = document.getElementById('trending_links_container');
const div_trendingGifsContainer = document.getElementById('trending_gifs_container');

//  API variables
const search_base_url = 'https://api.giphy.com/v1/gifs/search';
const trending_base_url = 'https://api.giphy.com/v1/gifs/trending';
const api_key = '2QRBa2w3k34LbUKfXGoNpuL3Mj6sHAEQ';

//  Fetch data. Returns unparsed, as is, response from URL. 
//  Use this function to serve ***ANY*** request to Giphy
async function fetchData(url) {

    const data = await fetch(url);

    return data.json();
}


//  Triggers a search with $limit number of results and $offset pagination. 
//  Returns *unparsed* response
async function search(query, limit = 12, offset = 0) {

    let response = await fetchData(`${search_base_url}?q=${query}&api_key=${api_key}&limit=${limit}`);

    return response;
}


//  Triggers a trending request with $limit number of results. 
//  Returns *unparsed* response
async function getTrending(limit = 12) {
    let response = await fetchData(`${trending_base_url}?api_key=${api_key}&limit=${limit}`);

    return response;
}

//  Creates and attaches images/gifs to the gifs_container
//  from data in json format
function createImgs(data) {

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_gifShowcase.appendChild(gif_img);
    }
}

function addTrendingImgs(data, limit=3) {

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_trendingGifsContainer.appendChild(gif_img);         
    }

}

function addTrendingLinks(data, limit = 5) {

    for (let i = 0; i < limit; i++) {
        let a = document.createElement('a');
        a.innerText = data.data[i].title.split('by')[0] + '  ';
        a.setAttribute('href','https://www.google.com');
        div_trendingLinksContainer.appendChild(a);
        
        // links += data.data[i].title.split('by')[0] + ' | ';
    }
    // let p = document.createElement('p');
    // p.innerText = links;
    // div_trendingLinksContainer.appendChild(p);

}

// HARDCODED 2 GIFS ONLY TO TEST!!! DELETE AFTERWARDS!!!!!!!
btn_search.addEventListener('click', () => { search(input_search.value,2).then(response => { createImgs(response); }); })

getTrending().then(response => { addTrendingLinks(response) });
getTrending(3).then(response => { addTrendingImgs(response)});