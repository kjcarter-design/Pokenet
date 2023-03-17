document.addEventListener("DOMContentLoaded", async () => {
  const POKEMON_PER_PAGE = 25;
  const pokemonArray = await generatePokemonArray(POKEMON_PER_PAGE * 4);

  
  const pokemonModal = new bootstrap.Modal(document.getElementById("pokemon-modal"));

  const userPokemonModal = new bootstrap.Modal(document.getElementById("user-pokemon-modal"));


  let currentPage = 1;
  let filteredPokemon = pokemonArray;
  let selectedPokemonIndex = -1;

  async function getPokemonData(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
  }


  async function generatePokemonArray(numPokemon) {
    const pokemonArray = [];

    for (let i = 0; i < numPokemon; i++) {
      const id = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      const pokemon = {
        name: data.name,
        lvl: Math.floor(Math.random() * 100) + 1,
        type: data.types[0].type.name,
        sprites: {
          front_default: data.sprites.front_default,
        },
      };
      pokemonArray.push(pokemon);
    }

    return pokemonArray;
  }
  function filterPokemon(pokemonArray, searchQuery) {
    if (!searchQuery) {
      return pokemonArray;
    }
  
    return pokemonArray.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  

  async function displayTradeMarket(pokemonArray, page) {
    const tradeMarketTable = document.getElementById("trade-market-table");
    const start = (page - 1) * POKEMON_PER_PAGE;
    const end = start + POKEMON_PER_PAGE;
    const visiblePokemon = pokemonArray.slice(start, end);
    const numRows = Math.ceil(visiblePokemon.length / 5); // updated
  
    tradeMarketTable.innerHTML = "";
  
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 5; j++) { // updated
        const index = i * 5 + j; // updated
        if (index < visiblePokemon.length) {
          const pokemon = visiblePokemon[index];
          const cell = await createTradeTableCell(pokemon);
          cell.addEventListener("click", () => openPokemonModal(pokemon, index));
          row.appendChild(cell);
        } else {
          row.appendChild(document.createElement("td")); // Empty cell for remaining slots
        }
      }
      tradeMarketTable.appendChild(row);
    }
   
  }
  

  async function generateUserPokemonHTML() {
    const boxResponse = await fetch("/assets/box_pokemon.json");
    const boxPokemon = await boxResponse.json();
  
    const partyResponse = await fetch("/assets/current_party.json");
    const partyPokemon = await partyResponse.json();
  
    const allUserPokemon = [...boxPokemon, ...partyPokemon];
  
    const container = document.createElement("div"); // create container element
    container.classList.add("row", "gx-3", "gy-3", "px-2");
  
    allUserPokemon.forEach((pokemon) => {
      const card = document.createElement("div"); // create card element
      card.classList.add("card", "col-md-6");
      card.style.maxWidth = "250px";
      card.style.margin = "auto";
  
      const img = document.createElement("img"); // create image element
      const spriteUrl = pokemon.sprites?.front_default ?? "/assets/unknown.png";
      img.src = spriteUrl;
      img.alt = pokemon.name;
      img.classList.add("card-img-top");
      card.appendChild(img);
  
      const cardBody = document.createElement("div"); // create card body element
      cardBody.classList.add("card-body");
  
      const name = document.createElement("h5"); // create name element
      name.classList.add("card-title", "fs-5");
      name.textContent = pokemon.name;
      cardBody.appendChild(name);
  
      const level = document.createElement("p"); // create level element
      level.classList.add("card-text", "fs-6");
      level.textContent = `Level ${pokemon.lvl}`;
      cardBody.appendChild(level);
  
      const type = document.createElement("p"); // create type element
      type.classList.add("card-text", "fs-6");
      type.textContent = pokemon.type;
      cardBody.appendChild(type);
  
      card.appendChild(cardBody);
      container.appendChild(card); // append card to container
    });
  
    return container; // return container element
  }
  
  
  

  function openPokemonModal(pokemon, index) {
    // Add code here to open a modal with more information about the selected pokemon.
  }

  async function showTradePokemonModal(pokemon, pokemonData) {
    document.getElementById("pokemon-modal-title").textContent = pokemon.name;

    const pokemonInfo = document.getElementById("pokemon-modal-body");
    pokemonInfo.innerHTML = ""; // Clear previous content

    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default;
    sprite.alt = pokemon.name;
    sprite.width = 100;
    sprite.height = 100;
    pokemonInfo.appendChild(sprite);

    const level = document.createElement('p');
    level.textContent = `Level ${pokemon.lvl}`;
    pokemonInfo.appendChild(level);

    const type = document.createElement('p');
    type.textContent = `Type: ${pokemon.type}`;
    pokemonInfo.appendChild(type);

    const weight = document.createElement('p');
    weight.textContent = `Weight: ${pokemonData.weight}`;
    pokemonInfo.appendChild(weight);

    const height = document.createElement('p');
    height.textContent = `Height: ${pokemonData.height}`;
    pokemonInfo.appendChild(height);

    document.getElementById("move-to-party").style.display = "none";
    document.getElementById("trade").style.display = "block";
    document.getElementById("release").style.display = "none";

    pokemonModal.show();
  }


  function createPokemonCard(pokemon) {
    // Create card
    const card = document.createElement('div');
    card.classList.add('card');

    // Add image to card
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', pokemon.sprites.front_default);
    img.setAttribute('alt', pokemon.name);
    card.appendChild(img);

    // Add card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Add name to card body
    const name = document.createElement('h5');
    name.classList.add('card-title');
    name.textContent = pokemon.name;
    cardBody.appendChild(name);

    // Add level to card body
    const level = document.createElement('p');
    level.classList.add('card-text');
    level.textContent = `Level ${pokemon.lvl}`;
    cardBody.appendChild(level);

    // Add type to card body
    const type = document.createElement('p');
    type.classList.add('card-text');
    type.textContent = pokemon.type;
    cardBody.appendChild(type);

    // Add card body to card
    card.appendChild(cardBody);

    return card;
  }

  async function createTradeTableCell(pokemon) {
    const cell = document.createElement('td');
    cell.style.width = '4.5em';
    cell.style.height = '4.5em';
    cell.style.textAlign = 'center';
    cell.style.verticalAlign = 'middle';
  
    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default;
    sprite.alt = pokemon.name;
    sprite.width = 50;
    sprite.height = 50;
  
    cell.appendChild(sprite);
  
    // Move the event listener from the sprite to the cell
    cell.addEventListener('click', async () => {
      const pokemonData = await getPokemonData(pokemon.name);
      showTradePokemonModal(pokemon, pokemonData);
    });
  
    return cell;
  }
  

  async function loadAllUserPokemon() {
    const userPokemonModalBody = document.getElementById(
      "user-pokemon-modal-body"
    );
    userPokemonModalBody.innerHTML = ""; // clear previous content
    const container = await generateUserPokemonHTML(); // generate container element
    userPokemonModalBody.appendChild(container); // append container element to modal body
  }
  
  

  async function init() {
    const numPokemon = POKEMON_PER_PAGE * 4;
    const pokemonArray = await generatePokemonArray(numPokemon);
    filteredPokemon = pokemonArray;
    await displayTradeMarket(filteredPokemon, currentPage);

    document.getElementById("previous-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayTradeMarket(filteredPokemon, currentPage);
      }
    });

    document.getElementById("search-input").addEventListener("input", (event) => {
      const searchQuery = event.target.value;
      filteredPokemon = filterPokemon(pokemonArray, searchQuery);
      currentPage = 1; // Reset to the first page after filtering
      displayTradeMarket(filteredPokemon, currentPage);
    });
    
    
    document.getElementById("next-page").addEventListener("click", () => {
      if (currentPage * POKEMON_PER_PAGE < filteredPokemon.length) {
        currentPage++;
        displayTradeMarket(filteredPokemon,currentPage);
      }
    });

    document.getElementById("trade").addEventListener("click", () => {
      loadAllUserPokemon();
      pokemonModal.hide();
      userPokemonModal.show();
    });
    
  }


  init();
})
