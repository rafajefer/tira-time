// scripts/members-list.js
import { getDatabase, ref, get, child, update, remove } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjLU8zwF5bFgZDzguHfnQ9BsHWtJjquA8",
  authDomain: "tira-time-7b6bc.firebaseapp.com",
  databaseURL: "https://tira-time-7b6bc-default-rtdb.firebaseio.com",
  projectId: "tira-time-7b6bc",
  storageBucket: "tira-time-7b6bc.firebasestorage.app",
  messagingSenderId: "240699308200",
  appId: "1:240699308200:web:1ccacd7d97f4f13f3c2a9d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let membersCache = [];
let editingMemberId = null;

async function getMembers() {
  // Supondo que os usuários logados estejam salvos em 'members' no database
  const snapshot = await get(child(ref(db), 'members'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.entries(data).map(([id, value]) => ({ id, ...value }));
  }
  return [];
}

async function renderMembers() {
  const membersList = document.getElementById('members-list');
  const membersLoading = document.getElementById('members-loading');
  if (membersLoading) membersLoading.style.display = '';
  if (membersList) membersList.style.display = 'none';
  membersCache = await getMembers();
  if (membersList) {
    if (membersCache.length === 0) {
      membersList.innerHTML = '<li>Nenhum membro encontrado.</li>';
    } else {
      membersList.innerHTML = membersCache.map((m, idx) => `
        <li data-idx="${idx}" data-id="${m.id}" class="member-row">
          ${m.photoURL ? `<img src="${m.photoURL}" class="member-avatar" />` : '<span class="member-avatar member-avatar-default"></span>'}
          <span class="member-name">${m.displayName || '-'}</span>
          <span class="member-nickname">${m.nickname || '-'}</span>
          <span class="member-admin">${m.isAdmin ? 'Admin' : ''}</span>
          <span class="member-email">${m.email || '-'}</span>
          <span>
            <button class="edit-member-btn">Editar</button>
            <button class="delete-member-btn" style="background:var(--bs-danger);color:#fff;">Excluir</button>
          </span>
        </li>
      `).join('');
    }
  }
  if (membersLoading) membersLoading.style.display = 'none';
  if (membersList) membersList.style.display = '';
  addEditListeners();
}

function addEditListeners() {
  document.querySelectorAll('.edit-member-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => openEditModal(idx));
  });
  document.querySelectorAll('.delete-member-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => deleteMember(idx));
  });
}

async function deleteMember(idx) {
  const member = membersCache[idx];
  if (!member || !member.id) return;
  if (confirm('Tem certeza que deseja excluir este membro?')) {
    await remove(ref(db, `members/${member.id}`));
    await renderMembers();
  }
}
function openEditModal(idx) {
  const member = membersCache[idx];
  const modal = document.getElementById('edit-member-modal');
  const form = document.getElementById('edit-member-form');
  if (modal && form && member) {
    modal.style.display = '';
    form.reset();
    form.elements['nickname'].value = member.nickname || '';
    form.elements['isAdmin'].checked = !!member.isAdmin;
    editingMemberId = member.id;
  }
}

const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
if (closeEditModalBtn) {
  closeEditModalBtn.addEventListener('click', () => {
    const modal = document.getElementById('edit-member-modal');
    if (modal) modal.style.display = 'none';
    editingMemberId = null;
  });
}

const editMemberForm = document.getElementById('edit-member-form');
if (editMemberForm) {
  editMemberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = editMemberForm.elements['nickname'].value.trim();
    const isAdmin = editMemberForm.elements['isAdmin'].checked;
    if (!nickname || !editingMemberId) return;
    await update(ref(db, `members/${editingMemberId}`), { nickname: nickname, isAdmin });
    const modal = document.getElementById('edit-member-modal');
    if (modal) modal.style.display = 'none';
    editingMemberId = null;
    await renderMembers();
  });
}

renderMembers();
