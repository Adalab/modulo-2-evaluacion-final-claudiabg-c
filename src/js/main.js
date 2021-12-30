'use strict';

const searchText = document.querySelector('.js-searchtext');
const searchBtn = document.querySelector('.js-searchbtn');
const animeList = document.querySelector('.js-animelist');
const favorites = document.querySelector('.js-favorites');
const favsInLocal = document.querySelector('.js-favsinlocal');
const resetFavs = document.querySelector('.js-resetfavs');

let allResults = [];
let favoriteAnimes = [];
let favoritesInLocal = [];

function handleSearchBtn(event) {
  event.preventDefault();

  if (searchText.value.length >= 3) {
    fetch(
      `https://api.jikan.moe/v3/search/anime?q=${searchText.value.toLowerCase()}`
    )
      .then((response) => response.json())
      .then((data) => {
        allResults = data.results;

        getEachResult();
      });
  }
}

function getHtmlAnimeList(id, img, name, noImg) {
  let htmlAnimeList = `<li class="js-anime" id="${id}">`;
  if (
    img ===
    `https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620`
  ) {
    htmlAnimeList += `<img src="${noImg}" alt="${name}">`;
  } else {
    htmlAnimeList += `<img src="${img}" alt="${name}">`;
  }
  htmlAnimeList += `<h2 class="animetitle">${name}</h2>`;
  htmlAnimeList += `</li>`;
  return htmlAnimeList;
}

function getEachResult() {
  animeList.innerHTML = '';
  for (let eachResult of allResults) {
    const filmWithNoImg = `https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.type}`;

    const codeList = getHtmlAnimeList(
      eachResult.mal_id,
      eachResult.image_url,
      eachResult.title,
      filmWithNoImg
    );

    animeList.innerHTML += codeList;
  }
  getFavorite();
}

function getFavorite() {
  const anime = document.querySelectorAll('.js-anime');

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
        const indexFav = favoriteAnimes.indexOf(
          `<li class="favorite">${selectedAnime.innerHTML}<button class="deletebtn">X</button></li>`
        );
        console.log(indexFav);
        favoriteAnimes.splice(indexFav, 1);
      }

      favorites.innerHTML = `${favoriteAnimes}`;

      if (favorites.innerHTML !== '') {
        resetFavs.classList.remove('hidden');
      }

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

if (favsInLocal.innerHTML !== '') {
  resetFavs.classList.remove('hidden');
}

function handleResetFavorites() {
  favsInLocal.innerHTML = '';
  favorites.innerHTML = '';
  resetFavs.classList.add('hidden');
}

resetFavs.addEventListener('click', handleResetFavorites);
searchBtn.addEventListener('click', handleSearchBtn);
