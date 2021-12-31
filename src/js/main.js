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

/////////////////////// GET DATA FROM API /////////////////////////

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

////////////////////// PAINT DATA FROM API //////////////////////////

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
  htmlAnimeList += `<h2 class="js-animetitle animetitle">${name}</h2>`;
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
    //getFavorite();
    getEachAnimeResult();
  }
}

/////////////// CLICK TO SEND TO FAVORITES SECTION ////////////////

function getHtmlFavList(id, img, name) {
  let htmlFavList = `<li class="js-favorite" id="${id}">`;
  htmlFavList += `<img src="${img}" alt="${name}">`;
  htmlFavList += `<h2 class="js-animetitle animetitle">${name}</h2>`;
  htmlFavList += `<button class="js-deletebtn deletebtn">X</button>`;
  htmlFavList += `</li>`;
  return htmlFavList;
}

function getFavorite(event) {
  let selectedAnime = event.currentTarget;
  const codeFavsList = getHtmlFavList(
    selectedAnime.id,
    selectedAnime.childNodes[0].currentSrc,
    selectedAnime.childNodes[1].innerHTML
  );
  if (selectedAnime.style.backgroundColor === 'darkseagreen') {
    favoriteAnimes.push(codeFavsList);
  } else {
    const indexFav = favoriteAnimes.indexOf(codeFavsList);
    favoriteAnimes.splice(indexFav, 1);
  }
  favorites.innerHTML = favoriteAnimes;
  if (favorites.innerHTML !== '') {
    resetFavs.classList.remove('hidden');
  }
  localStorage.setItem('favs', JSON.stringify(favoriteAnimes));
  getEachDeleteBtn();
  getDeleteBtn();
}

function getEachAnimeResult() {
  const anime = document.querySelectorAll('.js-anime');
  for (let eachAnime of anime) {
    eachAnime.style.backgroundColor = 'darkslategray';
    eachAnime.style.color = 'darkseagreen';
    eachAnime.style.border = '10px solid darkslategray';

    eachAnime.addEventListener('click', handleFavoritesColour);
    eachAnime.addEventListener('click', getFavorite);
  }
}

function handleFavoritesColour(event) {
  let selectedAnime = event.currentTarget;
  if (selectedAnime.style.backgroundColor === 'darkslategray') {
    selectedAnime.style.backgroundColor = 'darkseagreen';
    selectedAnime.style.border = '10px solid darkseagreen';
    selectedAnime.style.color = 'darkslategray';
  } else {
    selectedAnime.style.backgroundColor = 'darkslategray';
    selectedAnime.style.border = '10px solid darkslategray';
    selectedAnime.style.color = 'darkseagreen';
  }
}

////////////////////// DELETE FAVORITES BUTTON //////////////////////

function deleteFavAnime(event) {
  let selectedFav = event.currentTarget;
  console.log(selectedFav.parentNode);
}

function getEachDeleteBtn() {
  const deleteBtn = document.querySelectorAll('.js-deletebtn');
  for (const eachDelBtn of deleteBtn) {
    eachDelBtn.addEventListener('click', deleteFavAnime);
  }
}

function getDeleteBtn() {
  const favorite = document.querySelectorAll('.js-favorite');

  for (let eachFav of favorite) {
    // eslint-disable-next-line no-inner-declarations
    function handleDeleteBtn() {
      eachFav.innerHTML = '';
    }
    eachFav.addEventListener('click', handleDeleteBtn);
  }
}

////////////////////////// LOCALSTORAGE ///////////////////////////

const savedFavs = JSON.parse(localStorage.getItem('favs'));
favoritesInLocal = savedFavs;
favsInLocal.innerHTML = favoritesInLocal;

//////////////////////////// RESET FAVORITES ////////////////////////

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
