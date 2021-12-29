'use strict';

const searchText = document.querySelector('.searchtext');
const searchBtn = document.querySelector('.searchbtn');
const animeList = document.querySelector('.animelist');
const favorites = document.querySelector('.favorites');
const favsInLocal = document.querySelector('.favsinlocal');
let allResults = [];
let favoriteAnimes = [];
let favoritesInLocal = [];

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
        if (eachResult.image_url === 'https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620') {
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
                favoriteAnimes.push(`<li>${selectedAnime.innerHTML}<button>Eliminar de favoritos</button></li>`);
            } else {
                const indexFav = favoriteAnimes.indexOf(`${selectedAnime.innerHTML}`);
                favoriteAnimes.splice(indexFav, 1);
            }

            favorites.innerHTML = `${favoriteAnimes}`;

            localStorage.setItem('favs', JSON.stringify(favoriteAnimes))

        }

        eachAnime.addEventListener('click', handleAddfavorites);

    };
}

const savedFavs = JSON.parse(localStorage.getItem('favs'));

favoritesInLocal = savedFavs;

favsInLocal.innerHTML = favoritesInLocal;

searchBtn.addEventListener('click', handleSearchBtn);

