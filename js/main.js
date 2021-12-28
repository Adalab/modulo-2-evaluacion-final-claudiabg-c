'use strict';

const searchText = document.querySelector('.searchtext');
const searchBtn = document.querySelector('.searchbtn');
const animeList = document.querySelector('.animelist');

function handleSearchBtn(event) {
    event.preventDefault();

    fetch(`https://api.jikan.moe/v3/search/anime?q=${searchText.value}`)
        .then((response) => response.json())
        .then((data) => {
            let results = data.results
            for (let eachResult of results) {
                animeList.innerHTML += `<li><img src="${eachResult.image_url}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
            }
        })
}

searchBtn.addEventListener('click', handleSearchBtn)