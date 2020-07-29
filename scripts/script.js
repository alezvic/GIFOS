// Scripts for GIFOS
// 

//  HOW A SEARCH REQUEST SHOULD LOOK LIKE
//http://api.giphy.com/v1/gifs/search?q=KEYWORD&limit=12&api_key=API_KEY

/*  TODO 

    1. Where the heck do I put the catches!???
    3. Add offset to requests
    4. What size of gif is appropiated??

    QUESTIONS
    1. Search/clean buttons should hide hero image and h1 or just scroll to results?
    2. What "nuestra comunidad" means? should I search trendings on GIPHY or there is a GIFOS community trending list???
    3. Share buttons in the footer are sharing buttons or just links to social networks?
 */

//  VARIABLES
//  GUI elements
const input_search = document.getElementById('input_search');
const btn_search = document.getElementById('btn_search');
const btn_trending = document.getElementById('btn_trending');
const btn_clean = document.getElementById('btn_clean');
const div_gifShowcase = document.getElementById('gif_showcase');
const div_trendingLinksContainer = document.getElementById('trending_links_container');
const div_trendingGifsContainer = document.getElementById('trending_gifs_container');
const search_result_toggables = document.getElementsByClassName('search_result_toggable');
const btn_show_more = document.getElementById('btn_show_more');
const div_search_suggestions = document.getElementById('div_suggestions');

// Aux
const btn_autocomplete = document.getElementById('btn_autocomplete');

//  API variables
const search_base_url = 'https://api.giphy.com/v1/gifs/search';
const trending_base_url = 'https://api.giphy.com/v1/gifs/trending';
const trending_searches_base_url = 'https://api.giphy.com/v1/trending/searches';
const autocomplete_base_url = 'https://api.giphy.com/v1/gifs/search/tags';
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

    let response = await fetchData(`${search_base_url}?q=${query}&api_key=${api_key}&limit=${limit}&offset=${offset}`);

    return response;
}

async function getAutocompleteSuggestions(query) {

    let response = await fetchData(`${autocomplete_base_url}?q=${query}&api_key=${api_key}`);

    return response;
}


//  Triggers a trending request with $limit number of results. 
//  Returns *unparsed* response
async function getTrending(limit = 12) {
    let response = await fetchData(`${trending_base_url}?api_key=${api_key}&limit=${limit}`);

    return response;
}

//  Triggers a trending searches (like trending "topics")
//  Returns *unparsed* response
async function getTrendingSearches() {

    let response = await fetchData(`${trending_searches_base_url}?api_key=${api_key}`);

    return response;
}

//  Creates and attaches images/gifs to the gifs_container
//  from data in json format
function createImgs(data) {

    for (let i = 0; i < search_result_toggables.length; i++) {
        search_result_toggables[i].style.display = 'none';
    }
    search_result_toggables[0].style.display = 'none';

    let div_results_container = document.createElement('div');
    div_results_container.classList = 'results_container';
    div_results_container.id = 'div_results_container';
    div_gifShowcase.appendChild(div_results_container);

    let h1 = document.createElement('h1');
    h1.classList = 'capitalized search_result_toggable';
    h1.innerText = input_search.value;
    div_results_container.appendChild(h1);

    console.log(input_search.value);

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.classList = ['search_result_toggable'];
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_results_container.appendChild(gif_img);
    }

    btn_show_more.style.display = 'inline-block';
}

function addTrendingImgs(data, limit = 3) {

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_trendingGifsContainer.appendChild(gif_img);
    }

}

function addTrendingLinks(data, limit = 5) {

    let p = document.createElement('p');
    let text = '';

    for (let i = 0; i < limit; i++) {

        text += data.data[i];
        if (i != limit - 1) {
            text += ', ';
        }

        // let a = document.createElement('a');
        // a.innerText = text;
        // a.setAttribute('href','https://giphy.com/search/' + text);
        // div_trendingLinksContainer.appendChild(a);

        // let p = document.createElement('p');
        // p.innerText = ' ';
        // div_trendingLinksContainer.appendChild(p);
    }

    p.innerText = text;
    div_trendingLinksContainer.appendChild(p);
}

function cleanResults() {

    input_search.value = null;
    let throwaway_div = document.getElementById('div_results_container');

    throwaway_div.innerHTML = null;

    // if (throwaway_div.parentNode) {
    //     throwaway_div.parentNode.removeChild(throwaway_div);
    // }

    for (let i = 0; i < search_result_toggables.length; i++) {
        search_result_toggables[i].style.display = 'inline-block';
    }
}

function addSuggestions(payload) {

    cleanSuggestions();

    for (let i = 0; i < payload.data.length; i++) {
        let p = document.createElement('p');
        p.innerText = payload.data[i].name;
        p.addEventListener('click', ()=> {
            cleanSuggestions();
            input_search.value = payload.data[i].name;
            search(input_search.value).then(response => { createImgs(response); });
        })

        div_search_suggestions.appendChild(p);
    }

}

function cleanSuggestions() {
    div_search_suggestions.innerHTML = null;
}

// HARDCODED 2 GIFS ONLY TO TEST!!! DELETE AFTERWARDS!!!!!!!
btn_search.addEventListener('click', () => { search(input_search.value).then(response => { createImgs(response); }); });
btn_clean.addEventListener('click', () => { cleanResults() });

btn_autocomplete.addEventListener('click', () => {
    getAutocompleteSuggestions(input_search.value)
        .then(response => { addSuggestions(response); });
});


// btn_show_more   .addEventListener('click',  () => { search(input_search.value,12,12).then(response => { createImgs(response); }); });


input_search.addEventListener('input', () => {

    if (input_search.value.length > 2) {
        getAutocompleteSuggestions(input_search.value).then(response => { addSuggestions(response); });
    }
     if (input_search.value.length == 0) {        
        cleanSuggestions();
    }
});

getTrendingSearches().then(response => { addTrendingLinks(response) });
getTrending(3).then(response => { addTrendingImgs(response) });