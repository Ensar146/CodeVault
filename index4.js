const statusEl = document.getElementById('status');
const recentSelect = document.getElementById('recent-count');
const langInput = document.getElementById('default-lang');
const swatches = document.querySelectorAll('.theme-swatch');

let settings = getSettings();

function flash(msg) {
  statusEl.textContent = msg;
  clearTimeout(flash.t);
  flash.t = setTimeout(() => (statusEl.textContent = ''), 2000);
}

function update(partial) {
  settings = { ...settings, ...partial };
  saveSettings(settings);
  flash('Saved ✓');
}

function loadSnippets() {
  return JSON.parse(localStorage.getItem('snippets')) || [];
}

function showCounts() {
  const list = loadSnippets();
  document.getElementById('snippet-total').textContent = list.length;
  document.getElementById('fav-total').textContent = list.filter(s => s.fav).length;
}

function markTheme() {
  swatches.forEach(b => b.classList.toggle('selected', b.dataset.theme === settings.theme));
}

// Initial values
recentSelect.value = String(settings.recentCount);
langInput.value = settings.defaultLang;
markTheme();
showCounts();

// Theme
swatches.forEach(b => {
  b.onclick = () => {
    document.documentElement.setAttribute('data-theme', b.dataset.theme);
    update({ theme: b.dataset.theme });
    markTheme();
  };
});

// Recent count & default language
recentSelect.onchange = () => update({ recentCount: Number(recentSelect.value) });
langInput.onchange = () => update({ defaultLang: langInput.value.trim() });

// Export
document.getElementById('export-btn').onclick = () => {
  const blob = new Blob([JSON.stringify(loadSnippets(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'codeblocks-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

// Import (adds snippets that don't exist yet)
document.getElementById('import-file').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error('bad format');
      const current = loadSnippets();
      const ids = new Set(current.map(s => s.id));
      const added = data.filter(s => s && s.id && s.title && s.code && !ids.has(s.id));
      localStorage.setItem('snippets', JSON.stringify([...current, ...added]));
      showCounts();
      flash(added.length + ' snippet(s) imported ✓');
    } catch (err) {
      alert('This file is not a valid backup.');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
};

// Delete all
document.getElementById('clear-btn').onclick = () => {
  if (confirm('Delete ALL snippets? This cannot be undone. Consider exporting a backup first.')) {
    localStorage.removeItem('snippets');
    showCounts();
    flash('All snippets deleted');
  }
};