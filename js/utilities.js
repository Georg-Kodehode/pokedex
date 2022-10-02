// capitalize the string that the function receives as a parameter
export function capitalizeString(stat) {
  return stat.charAt(0).toUpperCase() + stat.slice(1);
}

// get the current pokémon count using data from the API
export function getPokemonCount(data) {
  const pokemonCount = data.count;
  const pokemonPerPage = data.results.length;
  const offset = pokemonCount - (pokemonCount % pokemonPerPage);
  return { offset: offset, pokemonPerPage: pokemonPerPage };
}
