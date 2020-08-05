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
const div_gifShowcase = document.getElementById('gif_results_showcase');
const div_trendLinksContainer = document.getElementById('trending_links_container');
const div_trendingGifsContainer = document.getElementById('trending_gifs_container');
const search_result_toggables = document.getElementsByClassName('search_result_toggable');
const btn_show_more = document.getElementById('btn_show_more');
const div_search_suggestions = document.getElementById('div_suggestions');
const h1_searchQuery = document.getElementById('search_h1');
const btn_carouselNext = document.getElementById('btn_next');
const btn_carouselPrevious = document.getElementById('btn_previous');

// Aux
const btn_autocomplete = document.getElementById('btn_autocomplete');

//  API variables
const search_base_url = 'https://api.giphy.com/v1/gifs/search';
const trending_base_url = 'https://api.giphy.com/v1/gifs/trending';
const trending_searches_base_url = 'https://api.giphy.com/v1/trending/searches';
const autocomplete_base_url = 'https://api.giphy.com/v1/gifs/search/tags';
const api_key = '2QRBa2w3k34LbUKfXGoNpuL3Mj6sHAEQ';

var trendingOffset = 0;
var searchMode = true;

//  Fetch data. Returns unparsed, as is, response from URL. 
//  Use this function to serve ***ANY*** request to Giphy
async function fetchData(url) {

    const data = await fetch(url);

    return data.json();
}


//  Triggers a search with $limit number of results and $offset pagination. 
//  Returns *unparsed* response
async function search(query, limit = 12, offset = 0) {

    cleanSuggestions();
    searchMode = !searchMode;
    btn_search.setAttribute('src', 'assets/images/close.svg');
    let response = await fetchData(`${search_base_url}?q=${query}&api_key=${api_key}&limit=${limit}&offset=${offset}`);

    return response;
}

async function getAutocompleteSuggestions(query) {

    let response = await fetchData(`${autocomplete_base_url}?q=${query}&api_key=${api_key}`);

    return response;
}


//  Triggers a trending request with $limit number of results. 
//  Returns *unparsed* response
async function getTrending(limit = 3, offset = 0) {

    let response = await fetchData(`${trending_base_url}?api_key=${api_key}&limit=${limit}&offset=${offset}`);

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
function addGifs(data) {

    div_gifShowcase.innerHTML = null;

    h1_searchQuery.innerText = input_search.value;

    console.log(input_search.value);

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.classList = ['search_result_toggable'];
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_gifShowcase.appendChild(gif_img);
    }

    btn_show_more.style.display = 'inline-block';
}

function addTrendingImgs(data) {

    div_trendingGifsContainer.innerHTML = null;

    for (let i = 0; i < data.data.length; i++) {
        let gif_img = document.createElement('img');
        gif_img.setAttribute('src', data.data[i].images.downsized_large.url);
        div_trendingGifsContainer.appendChild(gif_img);
    }
}

function addTrendingLinks(data, limit = 5) {

    let innerHTML = '';

    for (let i = 0; i < limit; i++) {

        let span = document.createElement('span');
        span.classList.add('span_trending');
        span.classList.add('capitalized');
        span.innerText = data.data[i];
        span.addEventListener('click', () => {
            
            input_search.value = data.data[i];
            search(input_search.value).then((response) => { addGifs(response); });
        });

        if (i > 0 && i != limit) {
            let span_comma = document.createElement('span');
            span_comma.classList.add('span_trending');
            span_comma.innerText = ', ';
            div_trendLinksContainer.appendChild(span_comma);
        }

        div_trendLinksContainer.appendChild(span);
    }
}

function cleanGifs() {

    h1_searchQuery.innerText = null;
    div_gifShowcase.innerHTML = null;
}

function cleanAll() {

    input_search.value = null;
    h1_searchQuery.innerText = null;
    div_gifShowcase.innerHTML = null;
}

function addSuggestions(payload) {

    cleanSuggestions();

    for (let i = 0; i < payload.data.length; i++) {
        let p = document.createElement('p');
        p.innerText = payload.data[i].name;
        p.addEventListener('click', () => {
            cleanSuggestions();
            input_search.value = payload.data[i].name;
            search(input_search.value).then(response => { addGifs(response); });
        })

        div_search_suggestions.appendChild(p);
    }

}

function cleanSuggestions() {
    div_search_suggestions.innerHTML = null;
}

// HARDCODED 2 GIFS ONLY TO TEST!!! DELETE AFTERWARDS!!!!!!!
btn_search.addEventListener('click', () => {

    if (searchMode) {
        search(input_search.value).then(response => { addGifs(response); });
    }
    else {
        cleanAll();
        btn_search.setAttribute('src', 'assets/icons/icon-search.svg');
    }
    console.log(searchMode);
    searchMode = !searchMode;
});


// btn_clean.addEventListener('click', () => { cleanAll() });

input_search.addEventListener('input', () => {

    if (input_search.value.length > 2) {
        getAutocompleteSuggestions(input_search.value).then(response => { addSuggestions(response); });
    }
    if (input_search.value.length == 0) {
        cleanSuggestions();
    }
});

input_search.addEventListener('keydown', event => {
    if(event.keyCode === 13) {
        search(input_search.value).then(response => { addGifs(response); });
    }
});

btn_carouselPrevious.addEventListener('click', () => {
    if (trendingOffset != 0) {
        if (trendingOffset <= 3) {
            trendingOffset = 0;
        }
        else {
            trendingOffset -= 3;
        }
        getTrending(3, trendingOffset)
            .then(response => { addTrendingImgs(response); });
    }

});

btn_carouselNext.addEventListener('click', () => {

    trendingOffset += 3;
    getTrending(3, trendingOffset)
        .then(response => { addTrendingImgs(response); });
});

getTrendingSearches().then(response => { addTrendingLinks(response) });
getTrending().then(response => { addTrendingImgs(response) });

// btn_autocomplete.addEventListener('click', () => {
//     getAutocompleteSuggestions(input_search.value)
//         .then(response => { addSuggestions(response); });
// });


// btn_show_more   .addEventListener('click',  () => { search(input_search.value,12,12).then(response => { addGifs(response); }); });
