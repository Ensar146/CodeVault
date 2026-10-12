const modal = document.getElementById('modal');
const titleInput = document.getElementById('title');
const typeInput = document.getElementById('type');
const codeInput = document.getElementById('code');
const grid = document.getElementById('fav-grid');

let snippets = JSON.parse(localStorage.getItem('snippets')) || [];
let editingId = null;

function save() {
  localStorage.setItem('snippets', JSON.stringify(snippets));
}

function openEdit(s) {
  editingId = s.id;
  titleInput.value = s.title;
  typeInput.value = s.type;
  codeInput.value = s.code;
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  editingId = null;
}

document.getElementById('cancel-btn').onclick = closeModal;

document.getElementById('save-btn').onclick = () => {
  const title = titleInput.value.trim();
  const type = typeInput.value.trim();
  const code = codeInput.value;

  if (!title || !type || !code.trim()) {
    alert('Title, language and code cannot be empty!');
    return;
  }

  const s = snippets.find(x => x.id === editingId);
  if (s) {
    s.title = title;
    s.type = type;
    s.code = code;
    save();
  }
  closeModal();
  render();
};

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function render() {
  grid.innerHTML = '';
  const favs = snippets.filter(s => s.fav);

  if (favs.length === 0) {
    grid.innerHTML = '<p class="empty">No favorites yet. Add some with the ☆ Favorite button on the DashBoard page.</p>';
    return;
  }

  [...favs].reverse().forEach(s => {
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

    const edit = document.createElement('button');
    edit.className = 'edit-btn';
    edit.textContent = 'Edit';
    edit.onclick = () => openEdit(s);

    const copy = document.createElement('button');
    copy.className = 'copy-btn';
    copy.textContent = 'Copy';
    copy.onclick = () => {
      navigator.clipboard.writeText(s.code);
      copy.textContent = 'Copied ✓';
      setTimeout(() => (copy.textContent = 'Copy'), 1500);
    };

    const unfav = document.createElement('button');
    unfav.className = 'fav-btn active';
    unfav.textContent = '★ Remove Favorite';
    unfav.onclick = () => {
      s.fav = false;
      save();
      render();
    };

    actions.append(edit, copy, unfav);
    box.append(h3, tag, pre, actions);
    grid.appendChild(box);
  });
}

render();