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
  if (searchInput && appModules.geraldine) {
    const debouncedSearch = appModules.geraldine.debounce((e) => {
      const query = e.target.value.trim();
      appModules.geraldine.searchCharacter(query);
    }, 500);
    searchInput.addEventListener("input", debouncedSearch);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  console.log('Loading Rick and Morty app modules...');
  
  const modulesLoaded = await loadModules();
  
  if (!modulesLoaded) {
    console.error('Failed to load modules');
    return;
  }
  
  console.log('Modules loaded, initializing app...');
  
  try {
    // Initialize header menu
    appModules.header.click();
    
    // Initialize carousel
    appModules.carousel.initCarousel();
    
    // Initialize main components
    appModules.cards.initializeCards();
    appModules.favorites.initializeFavorites();
    appModules.darkmode.initDarkMode();
    initializeSearch();
    appModules.geraldine.initializeFilters();
    appModules.geraldine.fillSelectOptions();
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

