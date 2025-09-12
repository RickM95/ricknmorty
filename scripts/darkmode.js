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
  
  try {
    localStorage.setItem('darkMode', isDarkMode);
  } catch (e) {
    console.warn('Cannot save dark mode preference:', e);
  }
}

/**
 * Inicializa el dark mode basado en localStorage
 */
export function initDarkMode() {
  let savedMode = null;
  try {
    savedMode = localStorage.getItem('darkMode');
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
  
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