'use strict';

const searchText = document.querySelector('.js-searchtext');
const searchBtn = document.querySelector('.js-searchbtn');
const animeList = document.querySelector('.js-animelist');
const favorites = document.querySelector('.js-favorites');
const resetFavs = document.querySelector('.js-resetfavs');
const logBtn = document.querySelector('.js-log');

let allResults = [];
let favoriteAnimes = [];

/////////////////////// GET DATA FROM API /////////////////////////

function handleSearchBtn(event) {
  event.preventDefault();

  if (searchText.value.length >= 3) {
    fetch(`https://api.jikan.moe/v4/anime?limit=24&order_by=score&q=${searchText.value}`)
      .then((response) => response.json())
      .then((data) => {
        allResults = data.data;

        console.log(data, allResults);

        getDataFromEachResult();
        findItInFavorites();
        giveTheColor();
      });
  }
}
searchBtn.addEventListener('click', handleSearchBtn);

////////////////////// PAINT DATA FROM API //////////////////////////

function getHtmlAnimeList(id, img, name, noImg, score) {
  let htmlAnimeList = `<li class="js-anime" id="${id}">`;
  if (
    img ===
    `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`
  ) {
    htmlAnimeList += `<img src="${noImg}" alt="${name}">`;
  } else if (img === null) {
    htmlAnimeList += `<img src="${noImg}" alt="${name}">`;
  } else {
    htmlAnimeList += `<img src="${img}" alt="${name}">`;
  }
  htmlAnimeList += `<h2 class="js-animetitle animetitle">${name}</h2>`;
  if (score > 7) {
    htmlAnimeList += `<p>Recomendada</p>`;
  }
  htmlAnimeList += `</li>`;
  return htmlAnimeList;
}

function getDataFromEachResult() {
  animeList.innerHTML = '';
  for (let eachResult of allResults) {
    const filmWithNoImg = `https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.type}`;

    const codeList = getHtmlAnimeList(
      eachResult.mal_id,
      eachResult.images.jpg.large_image_url,
      eachResult.title,
      filmWithNoImg,
      eachResult.score
    );
    animeList.innerHTML += codeList;

    const anime = document.querySelectorAll('.js-anime');

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
  const deleteBtn = document.querySelectorAll('.js-deletebtn');
  for (const eachDelBtn of deleteBtn) {
    eachDelBtn.addEventListener('click', deleteEachFavorite);
    eachDelBtn.addEventListener('click', deleteFavoriteFromLocal);
  }

  if (favorites.innerHTML !== '') {
    resetFavs.classList.remove('hidden');
  }
}

function handleFavorites(event) {
  let selectedAnime = event.currentTarget;
  let favList;
  let addToFavorites;

  const anime = document.querySelectorAll('.js-anime');

  for (const eachFavInFavs of favoriteAnimes) {
    if (eachFavInFavs.id === selectedAnime.id) {
      favList = eachFavInFavs;
    }
  }

  if (favList === undefined) {
    for (const animeToFav of anime) {
      if (animeToFav.id === selectedAnime.id) {
        selectedAnime.classList.remove('notselected');
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
  saveInLocalStorage();
  readLocalStorage();
  giveTheColor();
}

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

function saveInLocalStorage() {
  const toString = JSON.stringify(favoriteAnimes);
  localStorage.setItem('favorites', toString);
}

function readLocalStorage() {
  const localStorageData = localStorage.getItem('favorites');
  if (localStorageData !== null) {
    favoriteAnimes = JSON.parse(localStorageData);
    resetFavs.classList.remove('hidden');
    printFavorites();
    if (localStorageData === '[]') {
      resetFavs.classList.add('hidden');
    }
  }
}

readLocalStorage();

////////////////// PAINT COLORS IF IT'S FAVORITE //////////////////

function findItInFavorites() {
  let favsArray = JSON.parse(localStorage.getItem('favorites'));
  if (favsArray !== null) {
    for (const eachFav of favsArray) {
      const itsFav = allResults.find(
        (favAnime) => `${favAnime.mal_id}` === eachFav.id
      );
      if (itsFav !== undefined) {
        return true;
      }
    }
  }
  return true;
}

function giveTheColor() {
  const itsFav = findItInFavorites();
  if (itsFav === true) {
    for (const eachResult of allResults) {
      const itsNotAFavorite = document.getElementById(eachResult.mal_id);
      const itsAFavorite = document.querySelectorAll('.js-anime');
      for (const eachAnime of itsAFavorite) {
        eachAnime.classList.add('selected');
      }
      itsNotAFavorite.classList.add('notselected');
    }
  }
}

///////////////// DELETE BUTTON FAVORITES IN LOCAL ////////////////

function deleteFavoriteFromLocal(event) {
  let selectedFav = event.currentTarget;
  let removeItem;
  let favsArray = JSON.parse(localStorage.getItem('favorites'));
  for (const eachFav of favsArray) {
    if (eachFav.id === selectedFav.id) {
      removeItem = eachFav;
      let favsIndexInLocal = favsArray.indexOf(removeItem);
      favsArray.splice(favsIndexInLocal, 1);
      const toString = JSON.stringify(favsArray);
      localStorage.setItem('favorites', toString);
    }
  }
  readLocalStorage();
  giveTheColor();
}

//////////////////////////// RESET FAVORITES ////////////////////////

function handleResetFavorites() {
  favorites.innerHTML = '';
  favoriteAnimes = [];
  localStorage.removeItem('favorites');
  resetFavs.classList.add('hidden');
  giveTheColor();
}

resetFavs.addEventListener('click', handleResetFavorites);

function numberOfFavs(event) {
  event.preventDefault();
  console.log(`Tienes ${favoriteAnimes.length} animes favoritos`);
}

logBtn.addEventListener('click', numberOfFavs);
