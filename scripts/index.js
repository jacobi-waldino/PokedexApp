document.getElementById("submit-btn").addEventListener("click", function (e) {
    e.preventDefault();

    const pokemon_input = document.getElementById("pname").value.toLowerCase();

    callAPIPokemon(pokemon_input);
});

function callAPIPokemon(pokemon_input) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_input}/`)
        .then(response => {
            if (response.status === 404) {
                alert(`Name/ID: '${pokemon_input}' did not return any results.`);
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data != null) {
                var cry = new Audio(data.cries.latest)
                cry.play();
                displayMain(data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


function displayMain(data) {
    const display = document.getElementById("main-display");
    display.className = "row mx-3 bg-primary rounded d-flex me-5 ms-5 pe-1 ps-1 pt-3 justify-content-center align-items-center";

    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }

    const mainDataCol = getCard(data);
    const additionalDataCol = getAdditionalData(data);

    mainDataCol.classList.add('col-auto', 'd-flex', 'h-100');
    additionalDataCol.classList.add('col-auto', 'd-flex', 'h-100');

    display.appendChild(mainDataCol);
    display.appendChild(additionalDataCol);
}

function getCard(data) {
    const col = document.createElement('div');
    col.classList.add('d-flex', 'justify-content-center', 'py-3');

    const card = document.createElement('div');
    card.classList.add('card', 'bg-dark', 'text-white', 'mb-4', 'align-items-center');
    card.style.width = '18rem';

    const img = document.createElement('img');
    if (data.sprites.other['official-artwork'].front_default != null) {
        img.src = data.sprites.other['official-artwork'].front_default;
    }
    else {
        img.src = data.sprites.front_default;
    }

    img.alt = `Image of ${data.name}`;
    img.classList.add("w-50");
    img.classList.add("m-2");
    img.classList.add("bg-dark");


    card.appendChild(img);

    const stats = document.createElement('div');
    stats.classList.add("text-white");


    const name = document.createElement('p');
    name.appendChild(document.createTextNode(`Name: ${data.name}`));
    name.classList.add("text-capitalize");
    stats.appendChild(name);

    const number = document.createElement('p');
    var nationalno = JSON.stringify(data.id);
    while (nationalno.length < 4) {
        nationalno = "0" + nationalno;
    }

    number.appendChild(document.createTextNode(`National №: ${nationalno}`));
    stats.appendChild(number);

    const type = document.createElement('p');
    var typesString = "";
    data.types.forEach((item, index) => {
        typesString += item.type.name;

        if (index < data.types.length - 1) {
            typesString += ", ";

        }
    })

    var s = "";
    if (typesString.indexOf(',') != -1) {
        s += "s";
    }

    type.appendChild(document.createTextNode(`Type${s}: ${typesString}`));
    type.classList.add("text-capitalize");
    stats.appendChild(type);

    for (var i = 0; i < data.stats.length; i++) {
        var base_stat = document.createElement('p');
        base_stat.appendChild(document.createTextNode(`${data.stats[i].stat.name}: ${data.stats[i].base_stat}`));
        base_stat.classList.add("text-capitalize");
        stats.appendChild(base_stat);
    }

    const height = document.createElement('p');
    height.appendChild(document.createTextNode(`Height: ${data.height / 10} m`));
    stats.appendChild(height);

    const weight = document.createElement('p');
    weight.appendChild(document.createTextNode(`Weight: ${data.weight / 10} kg`));
    stats.appendChild(weight);

    const base_exp = document.createElement('p');
    base_exp.appendChild(document.createTextNode(`Base Experience: ${data.base_experience}`));
    stats.appendChild(base_exp);

    card.appendChild(stats);
    card.appendChild(createFavouriteButton(data));
    col.appendChild(card);

    return col;
}

function getAdditionalData(data) {
    const col = document.createElement('div');
    col.classList.add('d-flex', 'justify-content-center', 'py-3');


    const card = document.createElement('div');
    card.classList.add('card', 'bg-dark', 'text-white', 'w-100', 'mb-4', 'p-4', 'align-items-center');

    const title = document.createElement('h4');
    title.textContent = "Moves List";
    title.classList.add('fs-4');
    card.appendChild(title)

    getEvolutionChain(data.name, card);
    card.appendChild(getMovesTable(data));

    col.appendChild(card);
    
    
    return col;
}

function getEvolutionChain(pokemon_input, doc) {
    let species_data;

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_input}/`)
        .then(response => {
            if (response.status === 404) {
                alert(`Name/ID: '${pokemon_input}' did not return any results.`);
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            species_data = data;
            return fetch(species_data.evolution_chain.url);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(evolution_chain => {
            let evolutions = [];
            let chain = evolution_chain.chain;

            while (chain) {
                evolutions.push(chain.species.name);
                chain = chain.evolves_to[0] || null;
            }

            console.log(evolutions);

            if (evolutions.length > 1) {
                let evolution_position = evolutions.indexOf(pokemon_input);

                if (evolution_position >= 1) {

                    const evolves_from = document.createElement('div');
                    evolves_from.appendChild(document.createTextNode(`Evolves from: `));
                    evolves_from.classList.add('fs-5', 'mb-2');

                    let link = document.createElement('a');
                    link.textContent = `${evolutions[evolution_position - 1]}`;
                    link.href = '#';
                    link.classList.add('text-capitalize', 'btn', 'btn-primary');
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        callAPIPokemon(evolutions[evolution_position - 1]);
                    });

                    evolves_from.appendChild(link);
                    doc.appendChild(evolves_from);
                }
                if ((evolution_position <= 1 && evolutions.length > 2) || evolution_position == 0) {
                    const evolves_into = document.createElement('div');
                    evolves_into.appendChild(document.createTextNode(`Evolves into: `));
                    evolves_into.classList.add('fs-5', 'mb-2');

                    let link = document.createElement('a');
                    link.textContent = `${evolutions[evolution_position + 1]}`;
                    link.href = '#';
                    link.classList.add('text-capitalize', 'btn', 'btn-primary');
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        callAPIPokemon(evolutions[evolution_position + 1]);
                    });

                    evolves_into.appendChild(link);
                    doc.appendChild(evolves_into);
                }
            }


        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function createFavouriteButton(data) {
    let favouriteButton = document.createElement('button');
    let id = data.id;

    updateCapturedText(favouriteButton, id);

    favouriteButton.classList.add('btn', 'btn-danger', 'w-50', "mb-5", "mt-4");

    favouriteButton.addEventListener('click', () => {
        if(localStorage.getItem("favourites") === null) 
        {
            let favourites = [];
            favourites.push(data.id);
            console.log(favourites);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            updateCapturedText(favouriteButton, id);
        }   
        else
        {
            let favourites = JSON.parse(localStorage.getItem("favourites"));
            if(favourites.includes(data.id)) {

                // I just wish pop could take an item or index value :(
                
                let index = favourites.indexOf(data.id)
                if (index > -1) {
                    favourites.splice(index, 1);
                }
            }
            else
            {
                favourites.push(data.id);
            }
            console.log(favourites);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            updateCapturedText(favouriteButton, id);
        }
    });

    return favouriteButton;
}

function updateCapturedText(button, id) {

    var ball_open = document.createElement('img');
    var ball_closed = document.createElement('img');

    ball_open.src = "./assets/pokeball_open.png";
    ball_open.alt = "Open Pokeball";
    ball_open.width = 50;

    ball_closed.src = "./assets/pokeball_closed.png";
    ball_closed.alt = "Closed Pokeball";
    ball_closed.width = 50;

    if(localStorage.getItem("favourites") !== null) {
        let favourites = JSON.parse(localStorage.getItem("favourites"));
        while(button.firstChild) {
                button.removeChild(button.firstChild);
            }
        if(favourites.includes(id)) {
            button.appendChild(ball_closed);
        } else {
            button.appendChild(ball_open);
        }
    }
    else
    {
        while(button.firstChild) {
            button.removeChild(button.firstChild);
        }
        button.appendChild(ball_open);
    }
}

function getMovesTable(data) {
    let tableDiv = document.createElement('div');
    tableDiv.classList.add('table-responsive', 'm-3');
    tableDiv.style.maxHeight = '65vh';
    tableDiv.style.overflowY = "auto";

    let table = document.createElement('table');

    table.classList.add('table', 'table-bordered', 'table-striped');

    let tableHeaders = ['No.', 'Move', 'Level', 'Learn Method'];
    
    let thead = document.createElement('thead');
    // thead.classList.add("table-dark");
    const headerRow = document.createElement("tr");

    tableHeaders.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    data.moves.forEach((rowData, index) => {
        const row = document.createElement("tr");

        const td_num = document.createElement("td");
        td_num.textContent = index + 1;
        row.append(td_num);

        const td_move = document.createElement("td");
        console.log(rowData.name);
        td_move.textContent = rowData.move.name;
        td_move.classList.add('text-capitalize');
        row.append(td_move);

        const td_level = document.createElement("td");
        if(rowData.version_group_details[0].level_learned_at == 0) {
            td_level.textContent = '-';
        }
        else {
            td_level.textContent = rowData.version_group_details[0].level_learned_at;
        }
        row.append(td_level);

        const td_learn = document.createElement("td");
        td_learn.textContent = rowData.version_group_details[0].move_learn_method.name;
        td_learn.classList.add('text-capitalize');
        row.append(td_learn);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableDiv.appendChild(table);

    return tableDiv;
}

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const pokemon = params.get("pokemon")
    const search = document.getElementById('pname');

    if (pokemon != null) {
        search.placeholder = pokemon.substring(0, 1).toUpperCase().concat(pokemon.substring(1));
    }

    if (pokemon) {
        callAPIPokemon(pokemon);
    }
};
