'use strict';

const searchText = document.querySelector('.searchtext');
const searchBtn = document.querySelector('.searchbtn');
const animeList = document.querySelector('.animelist');
const favourites = document.querySelector('.favourites');

function handleSearchBtn(event) {
    event.preventDefault();
    animeList.innerHTML = '';

    if (searchText.value.length >= 3) {

        fetch(`https://api.jikan.moe/v3/search/anime?q=${searchText.value}`)
            .then((response) => response.json())
            .then((data) => {

                for (let eachResult of data.results) {

                    if (eachResult.image_url === 'null') {
                        animeList.innerHTML += `<li class="anime"><img src="https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.title}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
                    } else {
                        animeList.innerHTML += `<li class="anime"><img src="${eachResult.image_url}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
                    }
                };

                const anime = document.querySelectorAll('.anime');

                for (const eachAnime of anime) {
                    eachAnime.style.backgroundColor = 'white'
                    eachAnime.style.color = 'black'
                    function handleFavourites() {
                        if (eachAnime.style.backgroundColor === 'white') {
                            eachAnime.style.backgroundColor = 'black';
                            eachAnime.style.color = 'white';
                        } else {
                            eachAnime.style.backgroundColor = 'white';
                            eachAnime.style.color = 'black';
                        };
                        if (eachAnime.style.backgroundColor === 'black') {
                            favourites.innerHTML += `${eachAnime.innerHTML}`;
                        }
                    };
                    eachAnime.addEventListener('click', handleFavourites);
                };
            });
    };
};



searchBtn.addEventListener('click', handleSearchBtn);
