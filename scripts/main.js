// Import all modules
import { click } from "./funtion-header.js";
import { initCarousel } from './carousel.js';
import { initializeCards, showFavorites, showAllCharacters, toggleFavorite, openCardDetails, closeCardDetails } from "./cards.js";
import { initializeFavorites } from "./favorites.js";
import { initDarkMode, toggleDarkMode } from "./darkmode.js";
import { debounce, searchCharacter, fillSelectOptions, initializeFilters } from "./geraldine.js";

// Make functions globally available
window.showFavorites = showFavorites;
window.showAllCharacters = showAllCharacters;
window.toggleFavorite = toggleFavorite;
window.openCardDetails = openCardDetails;
window.closeCardDetails = closeCardDetails;
window.toggleDarkMode = toggleDarkMode;

// Initialize search function
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const debouncedSearch = debounce((e) => {
      const query = e.target.value.trim();
      searchCharacter(query);
    }, 500);
    searchInput.addEventListener("input", debouncedSearch);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log('Initializing Rick and Morty app...');
  
  // Initialize header menu
  click();
  
  // Initialize carousel
  initCarousel();
  
  // Initialize main components
  initializeCards();
  initializeFavorites();
  initDarkMode();
  initializeSearch();
  initializeFilters();
  fillSelectOptions();
  
  console.log('App initialization complete');
});

