document.addEventListener("DOMContentLoaded", () => {
  let pokemonData = [];

  Papa.parse("pokemon.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      pokemonData = results.data;

      // 1. Sort Pokémon alphabetically by name
      pokemonData.sort((a, b) => {
        const nameA = (a.pokemon || "").toLowerCase();
        const nameB = (b.pokemon || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });

      populateDropdown(pokemonData);
    }
  });

  function populateDropdown(data) {
    const select = document.getElementById("pokemon-select");
    select.innerHTML = '<option value="">-- Choose a Pokémon --</option>';

    data.forEach((pkmn) => {
      const rawName = pkmn.pokemon;
      if (!rawName) return;

      const option = document.createElement("option");
      option.value = pkmn.id;
      // Capitalize first letter for display
      option.textContent = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      select.appendChild(option);
    });
  }

  document.getElementById("pokemon-select").addEventListener("change", (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const pkmn = pokemonData.find(p => p.id === selectedId);
    if (pkmn) {
      displayResult(pkmn);
    }
  });

  function displayResult(pkmn) {
    const resultDiv = document.getElementById("result");
    const img = document.getElementById("pokemon-img");
    const nameHeading = document.getElementById("pokemon-name");
    const decisionBadge = document.getElementById("decision");
    const detailsPara = document.getElementById("details");

    const id = pkmn.id;
    const rawName = pkmn.pokemon || "";
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    // Fetch artwork sprite using ID
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    nameHeading.textContent = formattedName;

    // 2. Check if this Pokémon evolved from an earlier stage
    let preEvoText = "";
    if (pkmn.evolves_from_species_id && pkmn.evolves_from_species_id !== "NA" && pkmn.evolves_from_species_id !== "") {
      const prevEvo = pokemonData.find(p => p.id === pkmn.evolves_from_species_id || p.species_id === pkmn.evolves_from_species_id);
      if (prevEvo && prevEvo.pokemon) {
        const prevName = prevEvo.pokemon.charAt(0).toUpperCase() + prevEvo.pokemon.slice(1);
        preEvoText = `Evolves from ${prevName}. `;
      }
    }

    // Search for next evolution
    const nextEvolution = pokemonData.find(p => p.evolves_from_species_id === id);

    if (nextEvolution) {
      const nextName = nextEvolution.pokemon.charAt(0).toUpperCase() + nextEvolution.pokemon.slice(1);
      decisionBadge.textContent = "YES, EVOLVE!";
      decisionBadge.className = "badge evolve-yes";
      detailsPara.textContent = `${preEvoText}${formattedName} can evolve into ${nextName}.`;
    } else {
      decisionBadge.textContent = "NO / FULLY EVOLVED";
      decisionBadge.className = "badge evolve-no";
      detailsPara.textContent = `${preEvoText}${formattedName} is fully evolved.`;
    }

    resultDiv.classList.remove("hidden");
  }
});
