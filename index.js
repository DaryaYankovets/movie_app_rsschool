
import API_KEY_MOVIE from './api_key.js';
import genres from './data/genres.js';

window.addEventListener('DOMContentLoaded', () => {
    let searchFilm = null;
    const mainContainer = document.querySelector('.container-main');

    const createElement = (elem, html, className) => {
        const el = document.createElement(elem);
        el.innerHTML = html;
        el.className = className; 
        return el;
    } 

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
            mainContainer.append(itemFilm); 
        });
    }

    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        showData(data);
    }

    getData(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY_MOVIE}`);

    genres.forEach(elem => {
        const itemGenre = createElement(
            'li',
            elem.name,
            `item-genres`);
        document.querySelector('.block-genres').append(itemGenre);
    });

    

    document.querySelector('.searchInput').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            searchFilm = document.querySelector('.searchInput').value;
            if (searchFilm) {
                mainContainer.innerHTML = '';
                getData(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_MOVIE}&query=${searchFilm}&page=1`);
            }
            
        }
    }); 

    document.querySelector('.nav-popular').addEventListener('click', () => {
        mainContainer.innerHTML = '';
        getData(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY_MOVIE}`);
    });

    document.querySelector('.block-year').addEventListener('click', (event) => {
        if (event.target.closest('.item-year')) {
            const year = event.target.innerHTML;
            mainContainer.innerHTML = '';
            getData(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${API_KEY_MOVIE}&page=1`);
        }
        
    });

    document.querySelector('.yearInput').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            const searchYear = document.querySelector('.yearInput').value;
            if (searchYear && searchYear.length === 4 && (searchYear[0] == 1 || searchYear[0] == 2)) {
                mainContainer.innerHTML = '';
                getData(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${searchYear}&api_key=${API_KEY_MOVIE}&page=1`);
            }
        }
    });

    document.querySelector('.block-genres').addEventListener('click', (event) => {
        if (event.target.closest('.item-genres')) {
            const genreId = genres.filter(elem => elem.name === event.target.innerHTML)[0].id;
            mainContainer.innerHTML = '';
            getData(`https://api.themoviedb.org/3/discover/movie?certification_country=US&with_genres=${genreId}&api_key=${API_KEY_MOVIE}&page=1`);
        }
        
    });


});