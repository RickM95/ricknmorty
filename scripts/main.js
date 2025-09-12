/*Header Menu interaction*/
import { click } from "../scripts/funtion-header.js";
click();

/* Starts the aplication when the DOM is loading */
import { initializeCards } from "./cards.js";
document.addEventListener("DOMContentLoaded", () => {
  initializeCards();
});

import { debounce, searchCharacter, fillSelectOptions, fillterAll } from "./geraldine.js";
const searchInput = document.getElementById("searchInput");
const debouncedSearch = debounce((e) => {
  const query = e.target.value.trim();
  searchCharacter(query);
}, 500);
searchInput.addEventListener("input", debouncedSearch);
fillSelectOptions();
