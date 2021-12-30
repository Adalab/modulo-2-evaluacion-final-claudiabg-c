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
      });
  }
}

function paintResults() {
  animeList.innerHTML = '';
  for (let eachResult of allResults) {
    if (
      eachResult.image_url ===
      'https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620'
    ) {
      animeList.innerHTML += `<li class="anime" id="${eachResult.mal_id}"><img src="https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.type}" alt="${eachResult.title}"><h2 class="animetitle">${eachResult.title}</h2></li>`;
    } else {
      animeList.innerHTML += `<li class="anime" id="${eachResult.mal_id}"><img src="${eachResult.image_url}" alt="${eachResult.title}"><h2 class="animetitle">${eachResult.title}</h2></li>`;
    }
  }

  getFavorite();
}

function getFavorite() {
  const anime = document.querySelectorAll('.anime');

  for (const eachAnime of anime) {
    eachAnime.style.backgroundColor = 'darkslategray';
    eachAnime.style.color = 'darkseagreen';
    eachAnime.style.border = '10px solid darkslategray';

    // eslint-disable-next-line no-inner-declarations
    function handlefavoritesColour() {
      if (eachAnime.style.backgroundColor === 'darkslategray') {
        eachAnime.style.backgroundColor = 'darkseagreen';
        eachAnime.style.border = '10px solid darkseagreen';
        eachAnime.style.color = 'darkslategray';
      } else {
        eachAnime.style.backgroundColor = 'darkslategray';
        eachAnime.style.border = '10px solid darkslategray';
        eachAnime.style.color = 'darkseagreen';
      }
    }

    eachAnime.addEventListener('click', handlefavoritesColour);

    // eslint-disable-next-line no-inner-declarations
    function handleAddfavorites(event) {
      let selectedAnime = event.currentTarget;
      if (eachAnime.style.backgroundColor === 'darkseagreen') {
        favoriteAnimes.push(
          `<li class="favorite">${selectedAnime.innerHTML}<button class="deletebtn">X</button></li>`
        );
      } else {
        const indexFav = favoriteAnimes.indexOf(`${selectedAnime.innerHTML}`);
        favoriteAnimes.splice(indexFav, 1);
      }

      favorites.innerHTML = `${favoriteAnimes}`;

      localStorage.setItem('favs', JSON.stringify(favoriteAnimes));

      getDeleteBtn();
    }
    eachAnime.addEventListener('click', handleAddfavorites);
  }
}

function getDeleteBtn() {
  const favorite = document.querySelectorAll('.favorite');

  for (let eachFav of favorite) {
    // eslint-disable-next-line no-inner-declarations
    function handleDeleteBtn() {
      eachFav.innerHTML = '';
    }
    eachFav.addEventListener('click', handleDeleteBtn);
  }
}

const savedFavs = JSON.parse(localStorage.getItem('favs'));
favoritesInLocal = savedFavs;
favsInLocal.innerHTML = favoritesInLocal;

searchBtn.addEventListener('click', handleSearchBtn);
