console.log('Rick and Morty app starting...');

// Global variables
let allCharacters = [];
let currentPage = 1;
let isFiltering = false;

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  try {
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  } catch (e) {
    console.warn('Cannot save dark mode');
  }
}

function initDarkMode() {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  } catch (e) {
    console.warn('Cannot load dark mode');
  }
  
  const btn = document.getElementById('darkModeToggle');
  if (btn) {
    btn.addEventListener('click', toggleDarkMode);
  }
}

// API Functions
async function fetchCharacters(page = 1) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching characters:', error);
    return { error: true };
  }
}

async function searchCharacters(query) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`);
    const data = await response.json();
    if (data.results) {
      renderCharacters(data.results);
    }
  } catch (error) {
    console.error('Error searching:', error);
  }
}

// Character Card Creation
function createCharacterCard(character) {
  return `
    <div class="character-card relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 backdrop-blur-md" 
         onclick="openCardDetails(${character.id})" 
         style="background: linear-gradient(135deg, rgba(48, 48, 85, 0.7) 0%, rgba(68, 138, 50, 0.7) 25%, rgba(110, 197, 28, 0.7) 50%, rgba(159, 203, 15, 0.7) 75%, rgba(229, 236, 47, 0.7) 100%);">
      <div class="bg-white/10 p-6 h-full backdrop-blur-sm">
        <button onclick="toggleFavorite(${character.id}); event.stopPropagation();" 
                class="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
               class="w-6 h-6 text-yellow-400" id="star-${character.id}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
        
        <div class="flex flex-col items-center text-center">
          <img src="${character.image}" alt="${character.name}" 
               class="w-24 h-24 rounded-full border-4 border-lime-400 mb-4 object-cover">
          <h3 class="text-xl font-bold text-slate-800 mb-2">${character.name}</h3>
          <p class="text-slate-700 mb-1"><span class="font-semibold text-green-700">Especie:</span> ${character.species}</p>
          <p class="text-slate-700"><span class="font-semibold text-green-700">Estado:</span> 
            <span class="inline-block w-2 h-2 rounded-full mr-1 ${
              character.status === "Alive" ? "bg-green-500" : character.status === "Dead" ? "bg-red-500" : "bg-gray-500"
            }"></span>
            ${character.status === "Alive" ? "Vivo" : character.status === "Dead" ? "Muerto" : "Desconocido"}
          </p>
        </div>
      </div>
    </div>
  `;
}

// Render Characters
function renderCharacters(characters) {
  const container = document.getElementById('cards');
  if (!container) return;
  
  const html = characters.map(char => createCharacterCard(char)).join('');
  
  container.innerHTML = `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${html}
      </div>
      <div class="text-center mt-8">
        <button onclick="loadMoreCharacters()" 
                class="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg">
          Cargar más personajes
        </button>
      </div>
    </div>
  `;
  
  updateFavoriteStars();
}

// Favorites
function toggleFavorite(characterId) {
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem('rickMortyFavorites') || '[]');
  } catch (e) {
    favorites = [];
  }
  
  const character = allCharacters.find(char => char.id === characterId);
  if (!character) return;
  
  const existingIndex = favorites.findIndex(fav => fav.id === characterId);
  const starElement = document.getElementById(`star-${characterId}`);
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    if (starElement) {
      starElement.setAttribute('fill', 'none');
      starElement.classList.remove('text-yellow-500');
      starElement.classList.add('text-yellow-400');
    }
  } else {
    favorites.push(character);
    if (starElement) {
      starElement.setAttribute('fill', 'currentColor');
      starElement.classList.remove('text-yellow-400');
      starElement.classList.add('text-yellow-500');
    }
  }
  
  try {
    localStorage.setItem('rickMortyFavorites', JSON.stringify(favorites));
  } catch (e) {
    console.warn('Cannot save favorites');
  }
}

function updateFavoriteStars() {
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem('rickMortyFavorites') || '[]');
  } catch (e) {
    favorites = [];
  }
  
  allCharacters.forEach(character => {
    const starElement = document.getElementById(`star-${character.id}`);
    if (starElement) {
      const isFavorite = favorites.some(fav => fav.id === character.id);
      if (isFavorite) {
        starElement.setAttribute('fill', 'currentColor');
        starElement.classList.remove('text-yellow-400');
        starElement.classList.add('text-yellow-500');
      } else {
        starElement.setAttribute('fill', 'none');
        starElement.classList.remove('text-yellow-500');
        starElement.classList.add('text-yellow-400');
      }
    }
  });
}

function showFavorites() {
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem('rickMortyFavorites') || '[]');
  } catch (e) {
    favorites = [];
  }
  
  if (favorites.length === 0) {
    const container = document.getElementById('cards');
    if (container) {
      container.innerHTML = `
        <div class="container mx-auto px-4 py-8 text-center">
          <h3 class="text-2xl font-bold text-gray-600 mb-4">No tienes personajes favoritos</h3>
          <button onclick="loadInitialCharacters()" class="bg-lime-500 text-white px-6 py-3 rounded-lg">
            Ver todos los personajes
          </button>
        </div>
      `;
    }
    return;
  }
  
  renderCharacters(favorites);
}

// Load More
async function loadMoreCharacters() {
  currentPage++;
  const data = await fetchCharacters(currentPage);
  if (data && data.results) {
    allCharacters = [...allCharacters, ...data.results];
    renderCharacters(allCharacters);
  }
}

// Search with debounce
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Initialize Search
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const debouncedSearch = debounce((e) => {
      const query = e.target.value.trim();
      if (query) {
        searchCharacters(query);
      } else {
        loadInitialCharacters();
      }
    }, 500);
    searchInput.addEventListener('input', debouncedSearch);
  }
}

// Load initial characters
async function loadInitialCharacters() {
  const data = await fetchCharacters(1);
  if (data && data.results) {
    allCharacters = data.results;
    renderCharacters(allCharacters);
  }
}

// Carousel
function initCarousel() {
  const slides = document.querySelectorAll('[data-carousel-item]');
  const nextBtn = document.querySelector('[data-carousel-next]');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const indicators = document.querySelectorAll('[data-carousel-slide-to]');
  
  if (!slides.length) return;
  
  let currentIndex = 0;
  
  function showSlide(index) {
    slides.forEach(slide => slide.classList.add('hidden'));
    if (indicators.length) {
      indicators.forEach(ind => ind.setAttribute('aria-current', 'false'));
      indicators[index]?.setAttribute('aria-current', 'true');
    }
    slides[index]?.classList.remove('hidden');
  }
  
  showSlide(currentIndex);
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      showSlide(currentIndex);
    });
  }
  
  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      currentIndex = i;
      showSlide(currentIndex);
    });
  });
  
  // Auto-rotate
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 5000);
}

// Header Menu
function initMenu() {
  const menuHeader = document.getElementById('menuheader');
  const menuModel = document.getElementById('menumodel');
  
  if (menuHeader && menuModel) {
    menuHeader.addEventListener('click', () => {
      menuModel.classList.toggle('hidden');
    });
  }
}

// Dummy functions for onclick events
function openCardDetails(id) {
  console.log('Opening card details for:', id);
}

// Make functions global
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.loadMoreCharacters = loadMoreCharacters;
window.openCardDetails = openCardDetails;
window.toggleDarkMode = toggleDarkMode;

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Rick and Morty app...');
  
  initDarkMode();
  initCarousel();
  initMenu();
  initSearch();
  loadInitialCharacters();
  
  console.log('App initialized successfully');
});