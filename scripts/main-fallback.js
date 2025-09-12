// Fallback version without ES6 modules for GitHub Pages compatibility
console.log('Loading fallback main.js...');

// Wait for DOM and try to load scripts sequentially
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, attempting fallback initialization...');
  
  // Simple dark mode toggle
  const darkModeBtn = document.getElementById('darkModeToggle');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      try {
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      } catch (e) {
        console.warn('Cannot save dark mode preference');
      }
    });
    
    // Load saved dark mode
    try {
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
      }
    } catch (e) {
      console.warn('Cannot load dark mode preference');
    }
  }
  
  // Simple search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query) {
          searchCharacters(query);
        } else {
          loadInitialCharacters();
        }
      }, 500);
    });
  }
  
  // Load initial characters
  loadInitialCharacters();
  
  console.log('Fallback initialization complete');
});

// Simple character loading
async function loadInitialCharacters() {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    renderCharacters(data.results);
  } catch (error) {
    console.error('Error loading characters:', error);
  }
}

// Simple character search
async function searchCharacters(query) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`);
    const data = await response.json();
    if (data.results) {
      renderCharacters(data.results);
    }
  } catch (error) {
    console.error('Error searching characters:', error);
  }
}

// Simple character rendering
function renderCharacters(characters) {
  const container = document.getElementById('cards');
  if (!container) return;
  
  const html = characters.map(char => `
    <div class="character-card bg-white rounded-lg shadow-lg p-4 m-2">
      <img src="${char.image}" alt="${char.name}" class="w-full h-48 object-cover rounded">
      <h3 class="text-xl font-bold mt-2">${char.name}</h3>
      <p>Species: ${char.species}</p>
      <p>Status: ${char.status}</p>
    </div>
  `).join('');
  
  container.innerHTML = `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${html}
      </div>
    </div>
  `;
}