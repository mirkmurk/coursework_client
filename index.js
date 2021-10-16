const MAX_GENRES = 3;

let genres = [];
const genresContainer = document.querySelector('.genres_container');
const result = document.querySelector('.result');
const buttonGenerate = document.getElementById('generate');
const buttonCopy = document.querySelector('.copy');
const buttonBookmark = document.querySelector('.bookmark');
const results_saved = document.querySelector('.results_saved');

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
        genresContainer.innerHTML = '';
        genres.forEach(genre => {
            // CREATE ELEMENT BOX
            let box = document.createElement("div");
            box.classList.add('genre_box');
            box.style.backgroundImage = `url(img/${genre.name}.jpg)`;
            box.innerHTML = `<span class='title'>${genre.name}</span>`;
            box.title = "Click to choose genre."

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
    if (countChecked() == 0) return result.innerHTML = `Please select at least 1 genre`;
    let params = genres.filter(e => e.checked).map(e => `genre=${e.id}`).join('&');
    fetch(`http://localhost:3000/api/generate?${params}`)
        .then(response => response.json())
        .then(data => { result.innerHTML = data[0].toUpperCase() + data.substring(1) })
});


buttonCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(result.innerHTML);
});

const removeItem = (i) => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    results.splice(i, 1);
    localStorage.setItem('results', JSON.stringify(results));
    fillResultsSaved(results);
}

const copyItem = (i) => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    navigator.clipboard.writeText(results[i]);
}

const fillResultsSaved = (results) => {
    let text = "";
    for (let i = 0; i < results.length; i++)
        text += `<span class="result_saved_row"><h3 class="result">${results[i]}</h3>
        <span class="copy copy_saved"><img src="img/copy.svg" title="copy" /></span>
        <span class="remove"><img src="img/remove.svg" title="remove" /></span></span>`
    results_saved.innerHTML = text;

    document.querySelectorAll('.copy_saved').forEach((button, i) =>
        button.addEventListener('click', () => copyItem(i)));
    document.querySelectorAll('.remove').forEach((button, i) =>
        button.addEventListener('click', () => removeItem(i)));
}

buttonBookmark.addEventListener('click', () => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    let text = result.innerHTML;
    if (text == 'your prompt goes here' ||
        text == 'Please select at least 1 genre')
        return;
    for (let i = 0; i < results.length; i++)
        if (results[i] == text) return;
    results.unshift(text);
    localStorage.setItem('results', JSON.stringify(results));
    fillResultsSaved(results);
});




fillResultsSaved(JSON.parse(localStorage.getItem('results')) || []);