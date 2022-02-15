import API_KEY_MOVIE from './api_key.js';
import genres from './data/genres.js';

window.addEventListener('DOMContentLoaded', () => {
    let searchFilm = null;
    const blockFilms = document.querySelector('.list-films');
    const searchValues = document.querySelector('.search-values');

    let searchParameters = {
        word: [],
        year: [],
        genre: [],
    };

    const createElement = (elem, html, className) => {
        const el = document.createElement(elem);
        el.innerHTML = html;
        el.className = className; 
        return el;
    } 

    genres.forEach(elem => {
        const itemGenre = createElement(
            'li',
            elem.name,
            `item-genres`);
        document.querySelector('.block-genres').append(itemGenre);
    });

    const showData = (data) => {
        data.results.forEach(elem => {
            let pathImg = `https://image.tmdb.org/t/p/w1280${elem.poster_path}`; 
            if (elem.poster_path === null) {
                pathImg = `./assets/img/noimage.jpg`;
            }

            const itemFilm = createElement(
                 'div',
                `<img class="item-img" src='${pathImg}'></img>
                    <div class="item-footer">
                    <div class="item-footer-title">${elem.original_title}</div>
                    <div class="item-footer-vote">
                        <div class="vote">
                            ${elem.vote_average}
                        </div>
                    </div>
                    </div>
                    <div class="item-description">${elem.overview}</div>`, 
                `item-film item-${elem.id}`);
            blockFilms.append(itemFilm); 
        });
    }

    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    }

    getData(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY_MOVIE}`);

    const addSearchParameter = (value, styleElem) => {
        searchValues.classList.add('active-search-values');

        const searchValue = createElement('div', value, `${styleElem} item-search-value`);
        searchValues.append(searchValue);
        
        searchParameters[styleElem].push(value);
    }

    const deleteSearchParameter = (elem) => {
        if (elem.classList.contains('word')) {
            searchParameters.word = [];
        }
        if (elem.classList.contains('year')) {
            const index = searchParameters.year.findIndex(el => el == +elem.textContent);
            
            index !== -1 && searchParameters.year.splice(index, 1);  
        }
        if (elem.classList.contains('genre')) {
            const index = searchParameters.genre.findIndex(el => el == elem.textContent);
            index !== -1 && searchParameters.genre.splice(index, 1);
        } 
    }

    const generateSearchUrl = () => {
        let url = '';
        let yearsList = '';
        let genreList = '';
        /* if (searchParameters.word.length !== 0) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_MOVIE}&query=${searchParameters.word[0]}&page=1`;
            isWord = true;
        } else {
            url = `https://api.themoviedb.org/3/discover/movie?&api_key=${API_KEY_MOVIE}`;
        } */
        if (searchParameters.year.length !== 0) {
            yearsList = `primary_release_year=${searchParameters.year.join(',')}&`;   
        }
        if (searchParameters.genre.length !== 0) {
            const genresId = searchParameters.genre.map(name => genres.filter(elem => elem.name === name)[0].id);
            genreList = `with_genres=${genresId.join(',')}&`;
        }
        url = `https://api.themoviedb.org/3/discover/movie?${yearsList}${genreList}api_key=${API_KEY_MOVIE}`;
        console.log(url);
        return url;
    }

    console.log(searchParameters.year.join(','));

    document.querySelector('.searchInput').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            searchFilm = document.querySelector('.searchInput').value;
            if (searchFilm) {
                blockFilms.innerHTML = '';
                getData(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_MOVIE}&query=${searchFilm}&page=1`);
                
                if (searchValues.querySelector('.word')) {
                    searchValues.querySelector('.word').remove(); 
                }
                searchValues.querySelectorAll('.year').forEach(elem => elem.remove());
                searchValues.querySelectorAll('.genre').forEach(elem => elem.remove()); 
                searchParameters.year.length = 0;
                searchParameters.genre.length = 0;
                addSearchParameter(searchFilm, 'word');
            }
        }
        console.log(searchParameters);
    }); 

    document.querySelector('.nav-popular').addEventListener('click', () => {
        blockFilms.innerHTML = '';
        getData(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY_MOVIE}`);
        
        searchValues.innerHTML = '';
        searchValues.classList.remove('active-search-values');
        for(let key in searchParameters) {
            searchParameters[key].length = 0;
        }
    });

    document.querySelector('.block-year').addEventListener('click', (event) => {
        if (event.target.closest('.item-year')) {
            const year = event.target.innerHTML;
            blockFilms.innerHTML = '';
            //getData(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${API_KEY_MOVIE}&page=1`);

            addSearchParameter(year, 'year');
            const url = generateSearchUrl();
            getData(url);

            
        }
        
    });

    document.querySelector('.yearInput').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            const searchYear = document.querySelector('.yearInput').value;
            if (searchYear && searchYear.length === 4 && (searchYear[0] == 1 || searchYear[0] == 2)) {
                blockFilms.innerHTML = '';
                //getData(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${searchYear}&api_key=${API_KEY_MOVIE}&page=1`);

                addSearchParameter(searchYear, 'year');

                const url = generateSearchUrl();
                getData(url);
            }
        }
    });

    document.querySelector('.block-genres').addEventListener('click', (event) => {
        if (event.target.closest('.item-genres')) {
            const genreName = event.target.innerHTML;
            const genreId = genres.filter(elem => elem.name === genreName)[0].id;
            blockFilms.innerHTML = '';
            //getData(`https://api.themoviedb.org/3/discover/movie?certification_country=US&with_genres=${genreId}&api_key=${API_KEY_MOVIE}&page=1`);
            addSearchParameter(genreName, 'genre');

            const url = generateSearchUrl();
            getData(url);
        }
    });

    document.querySelector('.search-values').addEventListener('click', (event) => {
        if (event.target.closest('.item-search-value')) {
            event.target.classList.add('cross');
            setTimeout(() => event.target.remove(), 900);

            deleteSearchParameter(event.target);
        } 
        let isEmpty = 0;
        for (let key in searchParameters) {
            searchParameters[key].length === 0 ? isEmpty++ : null;
        }
        if (isEmpty === 3) {
            setTimeout(() => document.querySelector('.search-values').classList.remove('active-search-values'), 1000);
        } 

        blockFilms.innerHTML = '';
        const url = generateSearchUrl();
        getData(url); 
    });


});