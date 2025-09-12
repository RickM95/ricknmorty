// Dynamic imports for better GitHub Pages compatibility
let appModules = {};

async function loadModules() {
  try {
    const [headerModule, carouselModule, cardsModule, favoritesModule, darkmodeModule, geraldineModule] = await Promise.all([
      import('./funtion-header.js'),
      import('./carousel.js'),
      import('./cards.js'),
      import('./favorites.js'),
      import('./darkmode.js'),
      import('./geraldine.js')
    ]);
    
    appModules = {
      header: headerModule,
      carousel: carouselModule,
      cards: cardsModule,
      favorites: favoritesModule,
      darkmode: darkmodeModule,
      geraldine: geraldineModule
    };
    
    // Make functions globally available
    window.showFavorites = cardsModule.showFavorites;
    window.showAllCharacters = cardsModule.showAllCharacters;
    window.toggleFavorite = cardsModule.toggleFavorite;
    window.openCardDetails = cardsModule.openCardDetails;
    window.closeCardDetails = cardsModule.closeCardDetails;
    window.toggleDarkMode = darkmodeModule.toggleDarkMode;
    
    return true;
  } catch (error) {
    console.error('Error loading modules:', error);
    return false;
  }
}

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

