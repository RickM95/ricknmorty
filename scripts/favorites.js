import { renderCharacterCards, updateFavoriteStars } from './cards.js';

/**
 * Muestra solo los personajes favoritos guardados en localStorage
 */
export function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem('rickMortyFavorites') || '[]');
  
  if (favorites.length === 0) {
    // Mostrar mensaje si no hay favoritos
    const cardsContainer = document.querySelector("#cards");
    cardsContainer.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-slate-800 mb-4">No tienes favoritos</h2>
          <p class="text-slate-600">Agrega personajes a favoritos haciendo clic en la estrella</p>
        </div>
      </div>
    `;
    return;
  }
  
  renderCharacterCards(favorites);
  setTimeout(() => updateFavoriteStars(), 100);
}

/**
 * Inicializa el event listener para el botón de favoritos
 */
export function initializeFavorites() {
  const favoritesBtn = document.querySelector('#favorites-btn');
  if (favoritesBtn) {
    favoritesBtn.addEventListener('click', showFavorites);
  }
}