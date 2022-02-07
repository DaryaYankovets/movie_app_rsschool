
import API_KEY_MOVIE from './api_key.js';

window.addEventListener('DOMContentLoaded', () => {

    let listFilms = [];

    const createElement = (html, className) => {
        const el = document.createElement('div');
        el.innerHTML = html;
        el.className = className; 
        return el;
    } 

    const mainContainer = document.querySelector('.container-main');

    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        data.results.forEach(elem => {
            const itemFilm = createElement(
                `<img class="item-img" src='https://image.tmdb.org/t/p/w1280${elem.poster_path}'></img>
                 <div class="item-footer">
                    <div class="item-footer-title">${elem.original_title}</div>
                    <div class="item-footer-vote">
                        <div class="vote">
                            ${elem.vote_average}
                        </div>
                    </div>
                 </div>
                 <div class="item-description">${elem.overview}</div>`, 
                'item-film');
            //document.querySelector() .style.backgroundImage = ;
          
            //console.log(`url: "https://image.tmdb.org/t/p/w1280${elem.poster_path}"`);
            //itemFilm.style.border = '1px solid green';
            mainContainer.append(itemFilm);
            console.log(elem.poster_path);
        });
        
    }
    getData(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY_MOVIE}`);

});