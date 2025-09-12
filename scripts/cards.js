let currentPage = 1;
let allCharacters = [];
let initialCharacters = [];
let isFiltering = false;

// Import functions from geraldine.js
let searchCharacter, fillterAll;

// Initialize imports when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const geraldineModule = await import('./geraldine.js');
  searchCharacter = geraldineModule.searchCharacter;
  fillterAll = geraldineModule.fillterAll;
});

const favStar = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
`;

/**
 * Obtiene personajes de la API de Rick and Morty
 * @param {number} page - Número de página a obtener
 * @returns {Promise<Object>} Respuesta de la API con datos de personajes
 */
export async function fetchCharacters(page = 1) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return { error: true };
  }
}

/**
 * Crea HTML para una tarjeta de error
 * @returns {string} Cadena HTML para la tarjeta de error
 */
export function createErrorCard() {
  return `
    <div class="lg:col-start-2 relative rounded-2xl overflow-hidden shadow-lg backdrop-blur-md" 
         style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.7) 0%, rgba(239, 68, 68, 0.7) 25%, rgba(248, 113, 113, 0.7) 50%, rgba(252, 165, 165, 0.7) 75%, rgba(254, 202, 202, 0.7) 100%); backdrop-filter: blur(10px);">
      <div class="bg-white/10 p-6 h-full backdrop-blur-sm">
        <div class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-full border-4 border-red-400 mb-4 flex items-center justify-center bg-red-100/20">
            <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2 drop-shadow-lg">Error de Carga</h3>
          <p class="text-slate-700 mb-1"><span class="font-semibold text-red-700">Estado:</span> No se pudo cargar la información</p>
          <p class="text-slate-700"><span class="font-semibold text-red-700">Motivo:</span> Problema de conexión</p>
          <button onclick="location.reload()" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Reintentar
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Crea HTML para una tarjeta de personaje individual
 * @param {Object} character - Objeto de personaje de la API
 * @returns {string} Cadena HTML para la tarjeta
 */
export function createCharacterCard(character) {
  return `
    <div class="character-card relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 backdrop-blur-md md:h-[280px]" 
         onclick="toggleCardDetails(${character.id})" 
         style="background: linear-gradient(135deg, rgba(48, 48, 85, 0.7) 0%, rgba(68, 138, 50, 0.7) 25%, rgba(110, 197, 28, 0.7) 50%, rgba(159, 203, 15, 0.7) 75%, rgba(229, 236, 47, 0.7) 100%); backdrop-filter: blur(10px);">
      <div class="bg-white/10 p-6 h-full backdrop-blur-sm transition-all duration-500">
        <!-- Botón favorito -->
        <button onclick="toggleFavorite(${character.id}); event.stopPropagation();" 
                class="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
               class="w-6 h-6 text-yellow-400 transition-all duration-300" id="star-${character.id}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
        
        <!-- Estado normal -->
        <div id="normal-${character.id}" class="flex flex-col items-center text-center transition-all duration-500 md:justify-center md:h-full">
          <img src="${character.image}" alt="${character.name}" 
               class="w-24 h-24 rounded-full border-4 border-lime-400 mb-4 object-cover transition-all duration-500 hover:scale-110 hover:border-yellow-400">
          <h3 class="text-xl font-bold text-slate-800 mb-2 drop-shadow-lg">${character.name}</h3>
          <p class="text-slate-700 mb-1"><span class="font-semibold text-green-700">Especie:</span> ${character.species}</p>
          <p class="text-slate-700"><span class="font-semibold text-green-700">Estado:</span> 
            <span class="inline-block w-2 h-2 rounded-full mr-1 ${
              character.status === "Alive" ? "bg-green-500" : character.status === "Dead" ? "bg-red-500" : "bg-gray-500"
            }"></span>
            <span class="text-slate-800 font-medium">${
              character.status === "Alive" ? "Vivo" : character.status === "Dead" ? "Muerto" : "Desconocido"
            }</span>
          </p>
        </div>
        
        <!-- Estado expandido (oculto por defecto) -->
        <div id="expanded-${
          character.id
        }" class="hidden opacity-0 transform scale-95 transition-all duration-500 ease-in-out md:flex md:items-center md:justify-center md:h-full">
          <div class="bg-white/20 rounded-lg p-3 backdrop-blur-sm border border-lime-400/30 w-full">
            <div class="flex items-start space-x-4">
              <img src="${character.image}" alt="${character.name}" 
                   class="w-16 h-16 rounded-full border-3 border-lime-400 object-cover flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-slate-800 mb-2 drop-shadow-sm">${character.name}</h3>
                <div class="grid grid-cols-1 gap-1 text-sm">
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Especie:</span> <span class="text-slate-800">${
                    character.species
                  }</span></p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Estado:</span> 
                    <span class="inline-block w-2 h-2 rounded-full mr-1 ${
                      character.status === "Alive" ? "bg-green-500" : character.status === "Dead" ? "bg-red-500" : "bg-gray-500"
                    }"></span>
                    <span class="text-slate-800 font-medium">${
                      character.status === "Alive" ? "Vivo" : character.status === "Dead" ? "Muerto" : "Desconocido"
                    }</span>
                  </p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Origen:</span> <span class="text-slate-800">${
                    character.origin.name
                  }</span></p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Ubicación:</span> <span class="text-slate-800">${
                    character.location.name
                  }</span></p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Género:</span> <span class="text-slate-800">${
                    character.gender === "Male" ? "Masculino" : character.gender === "Female" ? "Femenino" : character.gender
                  }</span></p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Episodios:</span> <span class="text-slate-800">${
                    character.episode.length
                  } episodios</span></p>
                  <p class="text-slate-700"><span class="font-semibold text-green-700">Creado:</span> <span class="text-slate-800">${new Date(
                    character.created
                  ).toLocaleDateString()}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Resetea a la vista inicial de personajes
 */
export function resetToInitialView() {
  console.log('Reseteando a vista inicial');
  isFiltering = false;
  allCharacters = initialCharacters;
  currentPage = 1;
  
  // Reset filters and search
  const filterStatus = document.querySelector("#filterStatus");
  const filterGender = document.querySelector("#filterGender");
  const filterSpecies = document.querySelector("#filterSpecies");
  const searchInput = document.querySelector("#searchInput");
  
  if (filterStatus) filterStatus.value = "";
  if (filterGender) filterGender.value = "";
  if (filterSpecies) filterSpecies.value = "";
  if (searchInput) searchInput.value = "";
  
  renderCharacterCards(allCharacters);
  setTimeout(() => updateFavoriteStars(), 100);
}

/**
 * Activa el modo filtrado y renderiza personajes filtrados
 */
export function renderFilteredCharacters(characters) {
  console.log('Activando modo filtrado');
  isFiltering = true;
  renderCharacterCards(characters);
}

/**
 * Renderiza las tarjetas de personajes en el contenedor con grid responsivo
 * @param {Array} characters - Array de objetos de personajes
 */
export function renderCharacterCards(characters) {
  console.log('Renderizando cards, isFiltering:', isFiltering);
  const cardsContainer = document.querySelector("#cards");
  if (!cardsContainer) return;

  let cardsHTML;
  if (characters.error) {
    cardsHTML = createErrorCard();
  } else {
    cardsHTML = characters.map((character) => createCharacterCard(character)).join("");
  }

  cardsContainer.innerHTML = `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${cardsHTML}
      </div>
      <div class="text-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <button id="reset-filters-btn" 
                class="${!isFiltering ? "hidden" : ""} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
          Mostrar todos los personajes
        </button>
        <button id="load-less-btn" 
                class="${isFiltering || allCharacters.length <= initialCharacters.length ? "hidden" : ""} bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
          Cargar menos personajes
        </button>
        <button id="load-more-btn" 
                class="${isFiltering ? "hidden" : ""} bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
          Cargar más personajes
        </button>
      </div>
    </div>
  `;

  // Agregar event listeners a los botones
  const loadMoreBtn = document.querySelector("#load-more-btn");
  const loadLessBtn = document.querySelector("#load-less-btn");
  const resetFiltersBtn = document.querySelector("#reset-filters-btn");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreCharacters);
  }

  if (loadLessBtn) {
    loadLessBtn.addEventListener("click", loadLessCharacters);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetToInitialView);
  }
}

/**
 * Alterna la visualización de información detallada de una tarjeta de personaje
 * @param {number} characterId - ID del personaje
 */
export function toggleCardDetails(characterId) {
  const normalElement = document.querySelector(`#normal-${characterId}`);
  const expandedElement = document.querySelector(`#expanded-${characterId}`);

  if (normalElement && expandedElement) {
    if (normalElement.classList.contains("hidden")) {
      // Mostrar estado normal
      expandedElement.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        expandedElement.classList.add("hidden");
        normalElement.classList.remove("hidden");
        setTimeout(() => {
          normalElement.classList.remove("opacity-0", "scale-95");
        }, 50);
      }, 250);
    } else {
      // Mostrar estado expandido
      normalElement.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        normalElement.classList.add("hidden");
        expandedElement.classList.remove("hidden");
        setTimeout(() => {
          expandedElement.classList.remove("opacity-0", "scale-95");
        }, 50);
      }, 250);
    }
  }
}

/**
 * Carga más personajes (siguientes 10)
 */
export async function loadMoreCharacters() {
  currentPage++;
  const data = await fetchCharacters(currentPage);

  if (data && data.results) {
    allCharacters = [...allCharacters, ...data.results];
    renderCharacterCards(allCharacters);
    setTimeout(() => updateFavoriteStars(), 100);
  }
}

/**
 * Carga menos personajes (vuelve a los primeros 20)
 */
export function loadLessCharacters() {
  allCharacters = initialCharacters;
  currentPage = 1;
  renderCharacterCards(allCharacters);
  setTimeout(() => updateFavoriteStars(), 100);
}

/**
 * Inicializa el sistema de tarjetas de personajes
 */
export async function initializeCards() {
  const data = await fetchCharacters(1);

  if (data && data.results) {
    allCharacters = data.results;
    initialCharacters = [...data.results];
    renderCharacterCards(allCharacters);
    setTimeout(() => updateFavoriteStars(), 100);
  } else if (data && data.error) {
    renderCharacterCards(data);
  }
}

/**
 * Alterna el estado de favorito de un personaje
 * @param {number} characterId - ID del personaje
 */
export function toggleFavorite(characterId) {
  const favorites = JSON.parse(localStorage.getItem("rickMortyFavorites") || "[]");
  const character = allCharacters.find((char) => char.id === characterId);
  const starElement = document.querySelector(`#star-${characterId}`);

  if (!character) return;

  const existingIndex = favorites.findIndex((fav) => fav.id === characterId);

  if (existingIndex > -1) {
    // Remover de favoritos
    favorites.splice(existingIndex, 1);
    starElement.setAttribute("fill", "none");
    starElement.classList.remove("text-yellow-500");
    starElement.classList.add("text-yellow-400");
  } else {
    // Agregar a favoritos
    favorites.push(character);
    starElement.setAttribute("fill", "currentColor");
    starElement.classList.remove("text-yellow-400");
    starElement.classList.add("text-yellow-500");
  }

  localStorage.setItem("rickMortyFavorites", JSON.stringify(favorites));
}

/**
 * Actualiza el estado visual de las estrellas de favoritos
 */
export function updateFavoriteStars() {
  const favorites = JSON.parse(localStorage.getItem("rickMortyFavorites") || "[]");

  allCharacters.forEach((character) => {
    const starElement = document.querySelector(`#star-${character.id}`);
    if (starElement) {
      const isFavorite = favorites.some((fav) => fav.id === character.id);
      if (isFavorite) {
        starElement.setAttribute("fill", "currentColor");
        starElement.classList.remove("text-yellow-400");
        starElement.classList.add("text-yellow-500");
      } else {
        starElement.setAttribute("fill", "none");
        starElement.classList.remove("text-yellow-500");
        starElement.classList.add("text-yellow-400");
      }
    }
  });
}

// Hacer funciones disponibles globalmente para eventos onclick
window.toggleCardDetails = toggleCardDetails;
window.toggleFavorite = toggleFavorite;
