// Shared settings (loaded in <head> on every page)
const DEFAULT_SETTINGS = { theme: 'blue', recentCount: 5, defaultLang: '' };

function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('settings')) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(s) {
  localStorage.setItem('settings', JSON.stringify(s));
}

// Apply theme immediately to avoid a flash of the wrong colors
document.documentElement.setAttribute('data-theme', getSettings().theme);