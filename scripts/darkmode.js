let isDarkMode = false;

/**
 * Alterna entre modo claro y oscuro
 */
export function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  localStorage.setItem('darkMode', isDarkMode);
}

/**
 * Inicializa el dark mode basado en localStorage
 */
export function initDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
  }
  
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleDarkMode);
  }
}

// Hacer función disponible globalmente
window.toggleDarkMode = toggleDarkMode;