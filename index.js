const MAX_GENRES = 3;

let genres = [];
const genresContainer = document.querySelector('.genres_container');
const result = document.querySelector('.result');
const buttonGenerate = document.getElementById('generate');

const countChecked = () => {
    let count = 0;
    for (let i = 0; i < genres.length; i++)
        if (genres[i].checked) count++;
    return count;
}

fetch('http://127.0.0.1:3000/api/genres')
    .then(response => response.json())
    .then(data => {
        genres = data.map(genre => ({ ...genre, checked: false }));
        genres.forEach(genre => {

            // CREATE ELEMENT BOX
            let box = document.createElement("div");
            box.classList.add('genre_box');
            box.innerHTML = genre.name;

            // APPEND ELEMENT TO CONTAINER
            genresContainer.appendChild(box)

            box.addEventListener('click', () => {
                if (genre.checked == false && countChecked() == MAX_GENRES) return;
                genre.checked = !genre.checked;
                if (genre.checked) box.classList.add('checked');
                else box.classList.remove('checked');
            })
        })
    });



buttonGenerate.addEventListener('click', () => {
    if (countChecked() == 0) return result.innerHTML = `<h3>Please select at </h3>`;
    let params = genres.filter(e => e.checked).map(e => `genre=${e.id}`).join('&');
    fetch(`http://localhost:3000/api/generate?${params}`)
        .then(response => response.json())
        .then(data => { result.innerHTML = `<h3>${data}</h3>` })
});