import { getApi, getMockApi } from "./data.js";
import { displayPokemonDetails } from "./pokemonDetails.js";
import { capitalizeString, getPokemonCount } from "./utilities.js";

// TODO: fix navigation when in details view

const mainElement = document.querySelector("main");
let isBusy = false;

// navigation URLs used throughout the application
let navUrls = {
  start: "https://pokeapi.co/api/v2/pokemon/",
  return: "https://pokeapi.co/api/v2/pokemon/",
  previous: "https://pokeapi.co/api/v2/pokemon/",
  next: "https://pokeapi.co/api/v2/pokemon/",
};

/* TODO?: on the last page offset=1148 and pokemonPerPage=14 (offset should be 1140, but it still seems to be working as expected)
    console.log(
      "The offset is: " +
        countData.offset +
        " Per page is: " +
        countData.pokemonPerPage
    );
*/
/* update the URLs used in the application. If the API data for a URL is null, then 
   the else conditions makes sure that the URLs jump either to the first page or the 
   last page.
*/
function setUrls(data, url) {
  // get the offset and pokemonPerPage variables
  const countData = getPokemonCount(data);

  if (data.previous != null) navUrls.previous = data.previous;
  else
    navUrls.previous = `https://pokeapi.co/api/v2/pokemon/?offset=${countData.offset}&limit=${countData.pokemonPerPage}`;
  if (data.next != null) navUrls.next = data.next;
  else navUrls.next = navUrls.start;

  navUrls.return = url;
}

// display the pokémon on the first page when the application is started
displayAllPokemon(navUrls.start);

// get the navigation buttons
const logo = document.querySelector("h1[role='link']");
const previousBtn = document.getElementById("button-prev");
const nextBtn = document.getElementById("button-next");

// add event listeners to the navigation buttons
previousBtn.addEventListener("click", async () => {
  displayAllPokemon(navUrls.previous);
});
nextBtn.addEventListener("click", () => {
  displayAllPokemon(navUrls.next);
});
logo.addEventListener("click", () => {
  displayAllPokemon(navUrls.return);
});

// get the search elements
const searchField = document.getElementById("searchtext");
const searchBtn = document.getElementById("search");

// listen for click events on the search button
searchBtn.addEventListener("click", () => {
  const search = searchField.value;

  // search for the pokémon or the id requested by the user
  searchDex(search);
});

// search the API for the requested pokémon or id, then display the requested pokémon
async function searchDex(search) {
  /* searchDex function will not run if it is busy with a previous click. 
  This is achieved by setting it to true at the beginning of the function, and to 
  false again at the end of the function */
  if (isBusy) return;
  isBusy = true;
  let pokemonDetails = null;

  // get the count data from the API using the start URL
  const data = await getApi(navUrls.start);
  /* if the user searched for a number, then the details of the pokémon with that 
     number will be displayed */
  if (parseInt(search) == search) {
    pokemonDetails = await getApi(
      `https://pokeapi.co/api/v2/pokemon/${search}`
    );

    if (pokemonDetails) displayPokemonDetails(pokemonDetails, mainElement);
  } else {
    /* if the user searched for a pokémon name, then the pokémon with that name
       will be displayed */
    // make sure the search term is lowercase and trimmed before comparing with the API
    search = search.toLowerCase().trim();

    // get a list of all the pokémon from the API
    const allPokemon = await getApi(
      `https://pokeapi.co/api/v2/pokemon/?limit=${data.count}`
    );

    // find the requested pokémon, by looking through the names of all the pokémon
    const requestedPokemon = allPokemon.results.find(
      (pokemon) => pokemon.name === search
    );
    // display the details for the requested pokémon, if found in the API data
    if (requestedPokemon) {
      pokemonDetails = await getApi(requestedPokemon.url);
      if (pokemonDetails) displayPokemonDetails(pokemonDetails, mainElement);
    }
  }

  isBusy = false;
}

async function displayAllPokemon(url) {
  /* displayAllPokemon function will not run if it is busy with a previous click. 
  This is achieved by setting it to true at the beginning of the function, and to 
  false again at the end of the function */
  if (isBusy) return;
  isBusy = true;

  // get necessary data from the API
  const data = await getApi(url);
  const pokeballImage = await getApi("https://pokeapi.co/api/v2/item/4/");

  // update the navigation URLs
  setUrls(data, url);

  // clear the content of the main element
  mainElement.innerHTML = "";

  // create the necessary HTML
  const pokemonContainer = document.createElement("div");
  pokemonContainer.className = "poke-list";

  /* create HTML for all pokémon on the current page by looping through 
     all the pokémon on that page, and appending all the HTML created
     to the container, and then finally the container to the main element */
  for (const pokemon of data.results) {
    const pokemonDetails = await getApi(pokemon.url);
    const image = pokemonDetails.sprites.front_default;

    const pokemonCard = document.createElement("div");
    pokemonCard.className = "card";

    const pokemonName = document.createElement("h2");
    pokemonName.textContent = `${pokemonDetails.id}. ${capitalizeString(
      pokemonDetails.name
    )}`;

    const pokemonImage = document.createElement("img");
    /* add an image of the pokémon. If the pokémon has no image in the API, an image
       of a pokéball will be used instead */
    if (image) pokemonImage.src = image;
    else pokemonImage.src = pokeballImage.sprites.default;
    pokemonImage.alt = `image of the pokémon ${pokemonDetails.name}`;

    pokemonCard.append(pokemonName, pokemonImage);
    /* add a click event listener to every card on the page, which will display the
       details of the pokémon on the card that was clicked */
    pokemonCard.addEventListener("click", () => {
      displayPokemonDetails(pokemonDetails, mainElement);
    });
    pokemonContainer.append(pokemonCard);
    mainElement.append(pokemonContainer);
  }
  isBusy = false;
}
