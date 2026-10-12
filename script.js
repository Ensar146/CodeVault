const modal = document.getElementById('modal');
const titleInput = document.getElementById('title');
const typeInput = document.getElementById('type');
const codeInput = document.getElementById('code');
const grid = document.getElementById('snippet-grid');
const recentList = document.getElementById('recent-list');
const filter = document.getElementById('filter');

let snippets = JSON.parse(localStorage.getItem('snippets')) || [];

function save() {
  localStorage.setItem('snippets', JSON.stringify(snippets));
}

document.getElementById('add-btn').onclick = () => {
  modal.classList.add('open');
  if (!typeInput.value) typeInput.value = getSettings().defaultLang;
  titleInput.focus();
};
document.getElementById('cancel-btn').onclick = closeModal;

function closeModal() {
  modal.classList.remove('open');
  titleInput.value = '';
  typeInput.value = '';
  codeInput.value = '';
}

document.getElementById('save-btn').onclick = () => {
  const title = titleInput.value.trim();
  const type = typeInput.value.trim();
  const code = codeInput.value;

  if (!title || !type || !code.trim()) {
    alert('Title, language and code cannot be empty!');
    return;
  }

  snippets.push({
    id: Date.now(),
    title: title,
    type: type,
    code: code,
    date: new Date().toLocaleDateString('en-US')
  });

  save();
  closeModal();
  render();
};

// Close on outside click or Esc
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

filter.onchange = render;

function render() {
  document.getElementById('total-count').textContent = snippets.length;
  const types = [...new Set(snippets.map(s => s.type))];
  document.getElementById('type-count').textContent = types.length;

  const current = filter.value;
  filter.innerHTML = '<option value="all">All Languages</option>';
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filter.appendChild(opt);
  });
  filter.value = types.includes(current) ? current : 'all';

  recentList.innerHTML = '';
  if (snippets.length === 0) {
    recentList.innerHTML = '<li class="empty">No snippets added yet.</li>';
  }
  [...snippets].reverse().slice(0, getSettings().recentCount).forEach(s => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = s.title + ' (' + s.type + ')';
    const date = document.createElement('small');
    date.textContent = s.date;
    li.append(name, date);
    recentList.appendChild(li);
  });

  grid.innerHTML = '';
  const shown = snippets.filter(s => filter.value === 'all' || s.type === filter.value);

  if (shown.length === 0) {
    grid.innerHTML = '<p class="empty">Nothing to show. Add one with the + button at the bottom right.</p>';
  }

  [...shown].reverse().forEach(s => {
    const box = document.createElement('div');
    box.className = 'snippet';

    const h3 = document.createElement('h3');
    h3.textContent = s.title;

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = s.type;

    const pre = document.createElement('pre');
    pre.textContent = s.code;

    const actions = document.createElement('div');
    actions.className = 'snippet-actions';

    const copy = document.createElement('button');
    copy.className = 'copy-btn';
    copy.textContent = 'Copy';
    copy.onclick = () => {
      navigator.clipboard.writeText(s.code);
      copy.textContent = 'Copied ✓';
      setTimeout(() => (copy.textContent = 'Copy'), 1500);
    };

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.onclick = () => {
      if (confirm('Delete this code snippet?')) {
        snippets = snippets.filter(x => x.id !== s.id);
        save();
        render();
      }
    };

    const fav = document.createElement('button');
    fav.className = 'fav-btn' + (s.fav ? ' active' : '');
    fav.textContent = s.fav ? '★ Favorited' : '☆ Favorite';
    fav.onclick = () => {
      s.fav = !s.fav;
      save();
      render();
    };

    actions.append(fav, copy, del);
    box.append(h3, tag, pre, actions);
    grid.appendChild(box);
  });
}

render();