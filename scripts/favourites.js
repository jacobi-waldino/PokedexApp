const display = document.getElementById("main-display");

let favourites = JSON.parse(localStorage.getItem("favourites"));

if (favourites === null || favourites.length === 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.classList.add('text-center', 'text-white', 'fs-5', 'm-3');
    emptyMessage.appendChild(document.createTextNode('You have no captured Pokémon :('));
    display.appendChild(emptyMessage);
}
else {
    favourites.forEach((item, index) => {
        // removes duplicates
        if (favourites.indexOf(item) == index) {
            callAPIPokemon(item);
        }

    });
}

function callAPIPokemon(pokemon_input) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_input}/`)
        .then(response => {
            if (response.status === 404) {
                // alert(`Name/ID: '${pokemon_input}' did not return any results.`);
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data != null) {
                displayMain(data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function displayMain(data) {

    display.appendChild(getCard(data));
}

function getCard(data) {
    const col = document.createElement('div');
    col.classList.add('col-md-3', 'd-flex', 'justify-content-center', 'm-3');

    const card = document.createElement('div');
    card.classList.add('card', 'bg-dark', 'text-white', 'mb-4', 'align-items-center', 'text-center');
    card.style.width = '18rem';

    const img = document.createElement('img');
    if (data.sprites.other['official-artwork'].front_default != null) {
        img.src = data.sprites.other['official-artwork'].front_default;
    }
    else if (data.sprites.front_default != null) {
        img.src = data.sprites.front_default;
    }
    img.alt = `Image of ${data.name}`;
    img.classList.add("w-50");
    img.classList.add("m-2");
    img.classList.add("bg-dark");


    card.appendChild(img);

    const stats = document.createElement('div');
    stats.classList.add("text-white");

    // change into button that goes into homepage

    let link = document.createElement('a');
    link.textContent = `${data.name}`;
    link.href = `./index.html?pokemon=${data.name}`;
    link.classList.add('text-capitalize', 'btn', 'btn-danger', 'mt-3', 'mb-3');
    stats.appendChild(link);

    const number = document.createElement('p');
    var nationalno = JSON.stringify(data.id);
    while (nationalno.length < 4) {
        nationalno = "0" + nationalno;
    }

    number.appendChild(document.createTextNode(`№ ${nationalno}`));
    number.classList.add()
    stats.appendChild(number);

    const type = document.createElement('p');
    var typesString = "";
    data.types.forEach((item, index) => {
        typesString += item.type.name;

        if (index < data.types.length - 1) {
            typesString += ", ";

        }
    })

    type.appendChild(document.createTextNode(`${typesString}`));
    type.classList.add("text-capitalize");
    stats.appendChild(type);

    card.appendChild(stats);
    col.appendChild(card);
    
    return col;
}