'use strict';

const searchText = document.querySelector('.searchtext');
const searchBtn = document.querySelector('.searchbtn');
const animeList = document.querySelector('.animelist');
const favorites = document.querySelector('.favorites');
let allResults = [];
let favoriteAnimes = [];

function handleSearchBtn(event) {
    event.preventDefault();

    if (searchText.value.length >= 3) {

        fetch(`https://api.jikan.moe/v3/search/anime?q=${searchText.value}`)
            .then((response) => response.json())
            .then((data) => {

                allResults = data.results;

                paintResults();
            })
    }
};

function paintResults() {
    animeList.innerHTML = '';
    for (let eachResult of allResults) {
        if (eachResult.image_url === null) {
            animeList.innerHTML += `<li class="anime" id="${eachResult.mal_id}"><img src="https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.type}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
        } else {
            animeList.innerHTML += `<li class="anime" id="${eachResult.mal_id}"><img src="${eachResult.image_url}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
        }

    }

    getFavorite();
}

function getFavorite() {
    const anime = document.querySelectorAll('.anime');

    for (const eachAnime of anime) {
        eachAnime.style.backgroundColor = 'white';
        eachAnime.style.color = 'black';

        function handlefavoritesColour() {
            if (eachAnime.style.backgroundColor === 'white') {
                eachAnime.style.backgroundColor = 'black';
                eachAnime.style.color = 'white';
            } else {
                eachAnime.style.backgroundColor = 'white';
                eachAnime.style.color = 'black';
            };
        };

        eachAnime.addEventListener('click', handlefavoritesColour);

        function handleAddfavorites(event) {
            let selectedAnime = event.currentTarget;
            if (eachAnime.style.backgroundColor === 'black') {
                favoriteAnimes.push(selectedAnime.innerHTML);
            } else {
                const indexFav = favoriteAnimes.indexOf(`${selectedAnime.innerHTML}`);
                favoriteAnimes.splice(indexFav, 1);
            }

            favorites.innerHTML = favoriteAnimes;

            localStorage.setItem('favs', JSON.stringify(favorites.innerHTML))
        }

        eachAnime.addEventListener('click', handleAddfavorites);

    };
}

const savedFavs = JSON.parse(localStorage.getItem('favs'))

favorites.innerHTML = savedFavs;

searchBtn.addEventListener('click', handleSearchBtn);

