// CONST & VARIABLE DECLARATION
let genres = [];
const genresContainer = document.querySelector('.genres_container');

// GENRE STATS DISPLAY FILL-IN
fetch('http://127.0.0.1:3000/api/genres')
    .then(response => response.json())
    .then(data => {
        genres = data.map(genre => ({ ...genre, checked: false }));
        genresContainer.innerHTML = '';
        console.log(genres);
        genres.forEach(genre => {
            // CREATE ELEMENT BOX
            let box = document.createElement("div");
            box.classList.add('genre_box');
            box.style.backgroundImage = `url(img/${genre.name}.jpg)`;
            box.innerHTML = `<span class='title'>${genre.name}: ${genre.value}</span>`;
            box.title = `${genre.title}`;
            genresContainer.appendChild(box)
        })
    });
