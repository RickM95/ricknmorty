//---------FILTER DEBOUNCE BY CHARACTER -----------------//
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
async function searchCharacter(query) {
  if (!query) return;
  const url = `https://rickandmortyapi.com/api/character/?name=${query}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.log("No characters found");
      return;
    }
    console.log(data.results);
  } catch (error) {
    console.error("Error Searching:", error);
  }
}
const searchInput = document.getElementById("searchInput");

const debouncedSearch = debounce((e) => {
  const query = e.target.value.trim();
  searchCharacter(query);
}, 500);

searchInput.addEventListener("input", debouncedSearch);

//---------FILTERS GENDER, STATU, SPECIE -----------------//
const toggleFiltersBtn = document.querySelector("#toggleFilters");
const filtersContainer = document.querySelector("#filtersContainer");
const filterStatus = document.querySelector("#filterStatus");
const filterGender = document.querySelector("#filterGender");
const filterSpecies = document.querySelector("#filterSpecies");

toggleFiltersBtn.addEventListener("click", () => {
  filtersContainer.classList.toggle("hidden");
});

// ARRAY OF OPTIONS FOR EACH FILTER
const statusOptions = ["alive", "dead", "unknown"];
const genderOptions = ["female", "male", "genderless", "unknown"];
const speciesOptions = [
  "Human",
  "Alien",
  "Humanoid",
  "Poopybutthole",
  "Mythological Creature",
  "Robot",
  "Cronenberg",
  "Disease",
  "Animal",
  "Unknown",
];
// FILL SELECTIONS
function fillSelectOptions() {
  filterStatus.innerHTML = `<option value="">Todos</option>` + statusOptions.map((s) => `<option value="${s}">${s}</option>`).join("");
  filterGender.innerHTML = `<option value="">Todos</option>` + genderOptions.map((g) => `<option value="${g}">${g}</option>`).join("");
  filterSpecies.innerHTML = `<option value="">Todos</option>` + speciesOptions.map((sp) => `<option value="${sp}">${sp}</option>`).join("");
}
fillSelectOptions();

// LET'S FILTER
async function filtrar() {
  const status = filterStatus.value;
  const gender = filterGender.value;
  const species = filterSpecies.value;
  let url = "https://rickandmortyapi.com/api/character/?";
  if (status) url += `status=${status}&`;
  if (gender) url += `gender=${gender}&`;
  if (species) url += `species=${species}&`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      alert("No results found");
      return;
    }
    console.log(data.results);
  } catch (error) {
    console.error("Error Filtering:", error);
  }
}

// lISTEN TO CHANGES IN FILTERS
[filterStatus, filterGender, filterSpecies].forEach((select) => {
  select.addEventListener("change", filtrar);
});
