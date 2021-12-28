'use strict';

const searchText = document.querySelector('.searchtext');
const searchBtn = document.querySelector('.searchbtn');
const animeList = document.querySelector('.animelist');
// const moreBtn = document.querySelector('.morebtn');

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

                // moreBtn.classList.remove('hidden');

                // for (let index = 2; index < (data.last_page); index++) {

                //     function handleMoreBtn(event) {
                //         event.preventDefault();

                //         return fetch(`https://api.jikan.moe/v3/search/anime?q=${searchText.value}&page=${index}`)
                //             .then((response) => response.json())
                //             .then((data) => {
                //                 console.log(data);
                //                 let results = data.results
                //                 for (let eachResult of results) {

                //                     if (eachResult.image_url === 'null') {
                //                         animeList.innerHTML += `<li class="anime"><img src="https://via.placeholder.com/210x295/567891/891234/?text=${eachResult.title}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
                //                     } else {
                //                         animeList.innerHTML += `<li class="anime"><img src="${eachResult.image_url}" alt="${eachResult.title}"><h2>${eachResult.title}</h2></li>`
                //                     }
                //                 }
                //                 moreBtn.classList.add('hidden');

                //                 let anime = document.querySelectorAll('.anime');

                //                 for (const eachAnime of anime) {
                //                     function handleFavourites() {
                //                         eachAnime.style.backgroundColor = 'red';
                //                     }

                //                     eachAnime.addEventListener('click', handleFavourites);
                //                 }
                //             });

                //     };
                //     moreBtn.addEventListener('click', handleMoreBtn);
                // }

                let anime = document.querySelectorAll('.anime');

                for (const eachAnime of anime) {
                    function handleFavourites() {
                        eachAnime.style.backgroundColor = 'red';
                    };

                    eachAnime.addEventListener('click', handleFavourites);
                };
            });
    };
};



searchBtn.addEventListener('click', handleSearchBtn);
