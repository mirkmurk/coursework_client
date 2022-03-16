// CONST & VARIABLE DECLARATION
const MAX_GENRES = 3;
let genres = [];
const genresContainer = document.querySelector('.genres_container');
const result = document.querySelector('.result');
const buttonGenerate = document.getElementById('generate');
const buttonCopy = document.querySelector('.copy');
const buttonSortByName = document.getElementById('sortByNameButton');
const buttonSortByDate = document.getElementById('sortByDateButton');
const buttonBookmark = document.querySelector('.bookmark');
const results_saved = document.querySelector('.results_saved');

// SELECTED GENRES COUNTER
const countChecked = () => {
    let count = 0;
    for (let i = 0; i < genres.length; i++)
        if (genres[i].checked) count++;
    return count;
}

// GENRE DISPLAY SECTION FILL-IN & FUNCTIONALITY
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
            box.title = `${genre.title}`;

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


// PROMPT GENERATION BUTTON
buttonGenerate.addEventListener('click', () => {
    if (countChecked() == 0) return result.innerHTML = `Please select from 1 to 3 genres for generation`;
    let params = genres.filter(e => e.checked).map(e => `genre=${e.id}`).join('&');
    fetch(`http://localhost:3000/api/generate?${params}`)
        .then(response => response.json())
        .then(data => { result.innerHTML = data[0].toUpperCase() + data.substring(1) })
});

// PROMPT COPY BUTTON
buttonCopy.addEventListener('click', () => {
    if (result.innerHTML == 'Your prompt goes here...' ||
        result.innerHTML == 'Please select from 1 to 3 genres for generation')
        return;
    navigator.clipboard.writeText(result.innerHTML);
});

// PROMPT DELETE FUNCTION
const removeItem = (i) => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    let results_date = JSON.parse(localStorage.getItem('results_date')) || {};
    delete results_date[results[i]]
    results.splice(i, 1);
    localStorage.setItem('results', JSON.stringify(results));
    localStorage.setItem('results_date', JSON.stringify(results_date));
    fillResultsSaved(results);
}

// PROMPT COPY FUNCTION
const copyItem = (i) => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    navigator.clipboard.writeText(results[i]);
}

// PROMPT STORAGE FILL-IN
const fillResultsSaved = (results) => {
    if (results.length < 1) {
        buttonSortByDate.style.display = "none";
        buttonSortByName.style.display = "none";
    } else {
        buttonSortByDate.style.display = "inline";
        buttonSortByName.style.display = "inline";
    }
    let text = "";
    for (let i = 0; i < results.length; i++)
        text += `<span class="result_saved_row"><h3 class="result">${results[i]}</h3>
        <span class="copy copy_saved"><img src="img/copy.svg" title="Copy" /></span>
        <span class="remove"><img src="img/remove.svg" title="Remove" /></span></span>`
    results_saved.innerHTML = text;
    document.querySelectorAll('.copy_saved').forEach((button, i) =>
        button.addEventListener('click', () => copyItem(i)));
    document.querySelectorAll('.remove').forEach((button, i) =>
        button.addEventListener('click', () => removeItem(i)));
}

// PROMPT SAVE FUNCTION
// ONLY SAVES PROMPTS - NOT PRE-GENERATED MESSAGES
buttonBookmark.addEventListener('click', () => {
    let results = JSON.parse(localStorage.getItem('results')) || [];
    let results_date = JSON.parse(localStorage.getItem('results_date')) || {};

    let text = result.innerHTML;
    if (text == 'Your prompt goes here...' ||
        text == 'Please select from 1 to 3 genres for generation')
        return;
    for (let i = 0; i < results.length; i++)
        if (results[i] == text) return;
    results.unshift(text);
    results_date[text] = Date.now();
    localStorage.setItem('results', JSON.stringify(results));
    localStorage.setItem('results_date', JSON.stringify(results_date));
    fillResultsSaved(results);
});

// SELECTION SORT BY DATE
const sortByDate = () => {
    let arr = JSON.parse(localStorage.getItem('results'));
    let date = JSON.parse(localStorage.getItem('results_date'));
    if (!arr) return;
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_index = i;
        let minStr = arr[i];
        for (let j = i + 1; j < n; j++) {
            if (date[arr[j]] < date[minStr]) {
                minStr = arr[j];
                min_index = j;
            }
        }
        if (min_index != i) {
            let temp = arr[min_index];
            arr[min_index] = arr[i];
            arr[i] = temp;
        }
    }
    let arr2 = localStorage.getItem('results');
    if (arr2 == JSON.stringify(arr)) arr.reverse();
    localStorage.setItem('results', JSON.stringify(arr));
    fillResultsSaved(arr)
}

// SELECTION SORT BY NAME
const sortByName = () => {
    let arr = JSON.parse(localStorage.getItem('results'));
    if (!arr) return;
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_index = i;
        let minStr = arr[i];
        for (let j = i + 1; j < n; j++) {
            if ((arr[j]).localeCompare(minStr) === -1) {
                minStr = arr[j];
                min_index = j;
            }
        }
        if (min_index != i) {
            let temp = arr[min_index];
            arr[min_index] = arr[i];
            arr[i] = temp;
        }
    }
    let arr2 = localStorage.getItem('results');
    if (arr2 == JSON.stringify(arr)) arr.reverse();
    localStorage.setItem('results', JSON.stringify(arr));
    fillResultsSaved(arr)
}

buttonSortByName.addEventListener("click", sortByName)
buttonSortByDate.addEventListener("click", sortByDate)

fillResultsSaved(JSON.parse(localStorage.getItem('results')) || []);