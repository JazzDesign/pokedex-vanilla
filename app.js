// Getting DOM objects
const body = document.querySelector('body');
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokemonList = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// constants and vars
let prevUrl = null;
let nextUrl = null;
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
]


// functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetClasses = (element) => {
  TYPES.map((type) => {
    element.classList.remove(type);
  })
}

const fillPokemonList = (results) => {
  for(let i = 0; i < pokemonList.length; i++){
    const pokemonListItem = pokemonList[i];
    const resultData = results[i];

    if(resultData){
      const { url, name } = resultData;
      const arrUrl = url.split('/');
      const id = arrUrl[arrUrl.length - 2];
      pokemonListItem.textContent = `${id}. ${capitalize(name)}`;
    }else{
      pokemonListItem.textContent = '';
    }
  }
}

const fetchSinglePokemon = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      const pokeTypes = data.types;
      resetClasses(body);
      body.classList.add(data.types[0].type.name);
      mainScreen.classList.remove('hide');
      resetClasses(mainScreen);
      mainScreen.classList.add(data.types[0].type.name);
      pokeName.textContent = capitalize(data.name);
      pokeId.textContent = `# ${data.id.toString().padStart(4, '0')}`;
      // pokeFrontImage.setAttribute('src', data.sprites.front_default);
      pokeFrontImage.src = data.sprites.front_default || '';
      pokeBackImage.setAttribute('src', data.sprites.back_default || '');
      pokeWeight.textContent = data.weight;
      pokeHeight.textContent = data.height;

      // types
      if (pokeTypes.length > 1) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeOne.textContent = capitalize(pokeTypes[0].type.name);
        pokeTypeTwo.textContent = capitalize(pokeTypes[1].type.name);
      } else {
        pokeTypeOne.textContent = capitalize(pokeTypes[0].type.name);
        pokeTypeTwo.classList.add('hide');
      }


      console.log(data)
    });
}

//Get Data for Right Side
const fetchPokemonList = (url) => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;
      fillPokemonList(results);
    });
}


const handleRightButton = (e) => {
  if(nextUrl){
    fetchPokemonList(nextUrl);
  }
}

const handleLeftButton = (e) => {
  if (prevUrl) {
    fetchPokemonList(prevUrl);
  }
}

const handleListItemClick = (e) => {
  if(!e.target) return;

  if(!e.target.textContent) return;

  const id = e.target.textContent.split('.')[0];
  fetchSinglePokemon(id);
}
//Events
rightButton.addEventListener('click', handleRightButton);
leftButton.addEventListener('click', handleLeftButton);

for(const pokeItem of pokemonList){
  pokeItem.addEventListener('click', handleListItemClick);
}

//initialize app
fetchPokemonList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');