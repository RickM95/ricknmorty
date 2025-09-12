
/*Header Menu interaction*/
import { click } from "../scripts/funtion-header.js";
click();

/*Carousel interaation*/
import { initCarousel } from '/scripts/carousel.js';
initCarousel();

/* Starts the aplication when the DOM is loading */
import { initializeCards } from "./cards.js";
import { initializeFavorites } from "./favorites.js";
document.addEventListener("DOMContentLoaded", () => {
  initializeCards();
  initializeFavorites();
});

/*Search & Search Preferences Interaction*/
import { debounce, searchCharacter, fillSelectOptions, fillterAll } from "./geraldine.js";
const searchInput = document.getElementById("searchInput");
const debouncedSearch = debounce((e) => {
  const query = e.target.value.trim();
  searchCharacter(query);
}, 500);
searchInput.addEventListener("input", debouncedSearch);
fillSelectOptions();
[filterStatus, filterGender, filterSpecies].forEach((select) => {
  select.addEventListener("change", fillterAll);
});

