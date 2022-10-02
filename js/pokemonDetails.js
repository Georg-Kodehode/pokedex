import { capitalizeString } from "./utilities.js";
import { getApi } from "./data.js";

export async function displayPokemonDetails(data, mainElement) {
  // get the image for the pokéball from the API
  const pokeballImage = await getApi("https://pokeapi.co/api/v2/item/4/");

  /* Set data equal to the data sent from the getApi()
     function in data.js */
  // create h3 tag for every ability of the displayed pokémon
  let abilities = data.abilities.reduce(
    (acc, object) =>
      (acc += `<h3>${capitalizeString(object.ability.name)}</h3>`),
    ""
  );
  const { id, base_experience } = data;
  const name = capitalizeString(data.name);
  const weight = data.weight / 10 + "kg";
  const height = data.height / 10 + "m";
  /* image is set to the image of a pokéball if there is no image for the pokémon
     in the API */
  const image = data.sprites.front_default || pokeballImage.sprites.default;
  // create h3 tag for every type of the displayed pokémon
  let types = data.types.reduce(
    (acc, object) => (acc += `<h3>${capitalizeString(object.type.name)}</h3>`),
    ""
  );
  // create h3 tag for every stat of the displayed pokémon
  let stats = data.stats.reduce(
    (acc, object) =>
      (acc += `<h3>${object.stat.name}</h3> <h3>${object.base_stat}</h3><hr>`),
    ""
  );

  // render an HTML template string with the details for a specific pokémon
  mainElement.innerHTML = `
  <div class="card card-big">
      <h2>${id}. ${name}</h2>
      <img src="${image}" alt="image of ${name}">
      <div class="card-stats">
          <div class="info">
              <h3 class="height">${height}</h3><h3 class="weight">${weight}</h3><h3 class="xp">${base_experience}xp</h3>
          </div>
      </div>
      

      <div class="types">
          ${types}
      </div>

      <div class="abilities">
          ${abilities}
      </div>

      <div class="stats">
          ${stats}
      </div>
  </div>
`;
}
