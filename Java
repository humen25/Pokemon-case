document.addEventListener("DOMContentLoaded", () => {
  let pokemonData = [];

  Papa.parse("pokemon.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      pokemonData = results.data;
      populateDropdown(pokemonData);
    }
  });

  function populateDropdown(data) {
    const select = document.getElementById("pokemon-select");
    data.forEach((pkmn) => {
      const name = pkmn.name || pkmn.Name;
      if (!name) return;
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  document.getElementById("pokemon-select").addEventListener("change", (e) => {
    const selectedName = e.target.value;
    if (!selectedName) return;

    const pkmn = pokemonData.find(p => (p.name || p.Name) === selectedName);
    displayResult(pkmn);
  });

  function displayResult(pkmn) {
    const resultDiv = document.getElementById("result");
    const img = document.getElementById("pokemon-img");
    const nameHeading = document.getElementById("pokemon-name");
    const decisionBadge = document.getElementById("decision");
    const detailsPara = document.getElementById("details");

    const id = pkmn.id || pkmn.pokedex_number || pkmn.ID || "1";
    const name = pkmn.name || pkmn.Name;

    img.src = pkmn.image_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    nameHeading.textContent = name;

    const canEvolve = pkmn.can_evolve !== "false" && pkmn.can_evolve !== false && pkmn.next_evolution;

    if (canEvolve) {
      decisionBadge.textContent = "YES, EVOLVE!";
      decisionBadge.className = "badge evolve-yes";
      detailsPara.textContent = `${name} can evolve into ${pkmn.next_evolution} for improved stats.`;
    } else {
      decisionBadge.textContent = "NO / FULLY EVOLVED";
      decisionBadge.className = "badge evolve-no";
      detailsPara.textContent = `${name} is in its final stage or cannot evolve further.`;
    }

    resultDiv.classList.remove("hidden");
  }
});
