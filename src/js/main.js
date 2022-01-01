'use strict';

const searchText = document.querySelector('.js-searchtext');
const searchBtn = document.querySelector('.js-searchbtn');
const animeList = document.querySelector('.js-animelist');
const favorites = document.querySelector('.js-favorites');
const favsInLocal = document.querySelector('.js-favsinlocal');
const resetFavs = document.querySelector('.js-resetfavs');

let allResults = [];
let favoriteAnimes = [];

/////////////////////// GET DATA FROM API /////////////////////////

function handleSearchBtn(event) {
  event.preventDefault();

  if (searchText.value.length >= 3) {
    fetch(`https://api.jikan.moe/v3/search/anime?q=${searchText.value}`)
      .then((response) => response.json())
      .then((data) => {
        allResults = data.results;

        getEachResult();
      });
  }
}

searchBtn.addEventListener('click', handleSearchBtn);

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

    const anime = document.querySelectorAll('.js-anime');

    //getEachAnimeResult();

    for (let eachAnime of anime) {
      eachAnime.addEventListener('click', handleFavorites);
    }
  }
}

/////////////// CLICK TO SEND TO FAVORITES SECTION ////////////////

function getHtmlFavList(eachFavAnime) {
  let htmlFavList = `<li class="js-favorite" id="${eachFavAnime.id}">`;
  htmlFavList += `<img src="${eachFavAnime.img}" alt="${eachFavAnime.name}">`;
  htmlFavList += `<h2 class="js-animetitle animetitle">${eachFavAnime.name}</h2>`;
  htmlFavList += `<button class="js-deletebtn deletebtn" id="${eachFavAnime.id}">X</button>`;
  htmlFavList += `</li>`;
  return htmlFavList;
}

function printFavorites() {
  favorites.innerHTML = '';
  for (const eachFavAnime of favoriteAnimes) {
    favorites.innerHTML += getHtmlFavList(eachFavAnime);
  }
  // getEachDeleteBtn();
  const deleteBtn = document.querySelectorAll('.js-deletebtn');
  for (const eachDelBtn of deleteBtn) {
    eachDelBtn.addEventListener('click', deleteEachFavorite);
  }
}

function handleFavorites(event) {
  let selectedAnime = event.currentTarget;
  let favList;
  let addToFavorites;

  const anime = document.querySelectorAll('.js-anime');
  for (const favToRemove of favoriteAnimes) {
    if (favToRemove.id === selectedAnime.id) {
      favList = favToRemove;
    }
  }

  if (favList === undefined) {
    for (const animeToFav of anime) {
      if (animeToFav.id === selectedAnime.id) {
        selectedAnime.classList.add('selected');
        addToFavorites = animeToFav;
      }
    }
    favoriteAnimes.push({
      id: addToFavorites.id,
      img: addToFavorites.childNodes[0].currentSrc,
      name: addToFavorites.childNodes[1].innerHTML,
    });
  } else {
    const indexFav = favoriteAnimes.indexOf(favList);
    favoriteAnimes.splice(indexFav, 1);
    selectedAnime.classList.remove('selected');
  }

  printFavorites();
}

favorites.innerHTML = favoriteAnimes;
if (favorites.innerHTML !== '') {
  resetFavs.classList.remove('hidden');
}

localStorage.setItem('favs', JSON.stringify(favoriteAnimes));

////////////////////// DELETE FAVORITES BUTTON //////////////////////

function deleteEachFavorite(event) {
  let animeToRemove = event.currentTarget;
  let notFavAnymore;
  for (const favToRemove of favoriteAnimes) {
    if (favToRemove.id === animeToRemove.id) {
      notFavAnymore = favToRemove;
    }
  }

  if (notFavAnymore.id === notFavAnymore.id) {
    const indexFav = favoriteAnimes.indexOf(notFavAnymore);
    favoriteAnimes.splice(indexFav, 1);
    printFavorites();
  }
}

////////////////////////// LOCALSTORAGE ///////////////////////////

const savedFavs = localStorage.getItem('favs');
favsInLocal.innerHTML = JSON.parse(savedFavs);

///////////////// DELETE BUTTON FAVORITES IN LOCAL ////////////////

function deleteFavAnimeLocal(event) {
  event.target.parentElement.remove();
}

if (favsInLocal.innerHTML !== '') {
  const favoriteClassLocal = favsInLocal.querySelector(':scope > .js-favorite');
  let deleteBtnLocal = favoriteClassLocal.querySelector(
    ':scope > .js-deletebtn'
  );
  deleteBtnLocal.addEventListener('click', deleteFavAnimeLocal);
}

//////////////////////////// RESET FAVORITES ////////////////////////

if (favsInLocal.innerHTML !== '') {
  resetFavs.classList.remove('hidden');
}

function handleResetFavorites() {
  favsInLocal.innerHTML = '';
  favorites.innerHTML = '';
  localStorage.removeItem('favs');
  resetFavs.classList.add('hidden');
}

resetFavs.addEventListener('click', handleResetFavorites);
