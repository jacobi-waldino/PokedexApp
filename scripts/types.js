const checkboxes = document.querySelectorAll(".dropdown-menu input[type='checkbox']");
const button = document.querySelector(".dropdown-toggle");
const display = document.getElementById("main-display");
var additional_type;

document.addEventListener("DOMContentLoaded", () => {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", getTypes);
    });

    
});

function getTypes() {
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }

    additional_type = "";

    const selected = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.nextElementSibling.textContent);

    if(selected.length !== 0 && selected.length <= 2) {
        callAPIType(selected[0]);

        if(selected.length > 1) {
            additional_type = selected[1];
        }
    }
    else if (selected.length > 2) 
    {
        var message = document.createElement('p');
        message.appendChild(document.createTextNode('You can only select two types at a time.'));
        message.classList.add('fs-5', 'text-center', 'text-white', 'p-5');
        display.appendChild(message);
    }
}

// Add this function to fetch type data when a type is entered
function callAPIType(type_input) {
    fetch(`https://pokeapi.co/api/v2/type/${type_input}/`)
        .then(response => {
            if (response.status === 404) {
                alert(`Type: '${type_input}' did not return any results.`);
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data != null) {
                console.log(data);
                data.pokemon.forEach((data) => {
                    callAPIPokemon(data.pokemon.name)
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
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

    // Checks if multiple types are selected
    if(additional_type != "") {
        data.types.forEach((item) => {
            if(item.type.name == additional_type) {
                display.appendChild(getCard(data));
            }
        })
    }
    else
    {
        display.appendChild(getCard(data));
    }

    
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