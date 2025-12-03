
import { addPlayerToDB, getPlayersFromDB, updatePlayerInDB, removePlayerFromDB } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const playersList = document.getElementById('players-list');
  const playersLoading = document.getElementById('players-loading');
  const addBtn = document.getElementById('add-player-btn');
  const addPlayerModal = document.getElementById('add-player-modal');
  const addPlayerForm = document.getElementById('add-player-form');
  const closeModalBtn = document.getElementById('close-modal-btn');
  let editingPlayerId = null;
  renderPlayers();

  async function renderPlayers() {
    if (playersLoading) playersLoading.style.display = '';
    if (playersList) playersList.style.display = 'none';
    let players = await getPlayersFromDB();
    players = players.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt', { sensitivity: 'base' }));
    const playersTotal = document.getElementById('players-total');
    if (playersTotal) {
      playersTotal.textContent = `Total de jogadores: ${players.length}`;
    }
    if (playersList) {
      if (players.length === 0) {
        playersList.innerHTML = '<li>Nenhum jogador encontrado.</li>';
      } else {
        playersList.innerHTML = players.map((p, idx) => `
          <li data-idx="${idx}" data-id="${p.id}">
            <span class="player-name">${p.name}</span>
            <span class="player-skill">${p.skill ? 'Série: ' + p.skill : ''}</span>
            <span class="player-admin">${p.admin ? 'Admin' : ''}</span>
            <div>
                <button class="edit-player-btn">Editar</button>
                <button class="delete-player-btn">Excluir</button>
            </div>
          </li>
        `).join('');
      }
    }
    if (playersLoading) playersLoading.style.display = 'none';
    if (playersList) playersList.style.display = '';
    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll('.edit-player-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => openEditModal(idx));
    });
    document.querySelectorAll('.delete-player-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => deletePlayer(idx));
    });
  }

  function openEditModal(idx) {
    const li = playersList.children[idx];
    const playerId = li.getAttribute('data-id');
    const nameSpan = li.querySelector('.player-name');
    const skillSpan = li.querySelector('.player-skill');
    const adminSpan = li.querySelector('.player-admin');
    const oldName = nameSpan.textContent;
    const oldSkill = skillSpan && skillSpan.textContent.replace('Série: ', '').trim();
    const oldAdmin = adminSpan && adminSpan.textContent === 'Admin';
    if (addPlayerModal && addPlayerForm) {
      addPlayerModal.style.display = '';
      addPlayerForm.reset();
      addPlayerForm.elements['nick'].value = oldName;
      addPlayerForm.elements['skill'].value = oldSkill;
      addPlayerForm.elements['admin'].checked = oldAdmin;
      editingPlayerId = playerId;
    }
  }

  function deletePlayer(idx) {
    const li = playersList.children[idx];
    const playerId = li.getAttribute('data-id');
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
      removePlayer(playerId);
    }
  }

  async function updatePlayerName(playerId, player) {
    await updatePlayerInDB(playerId, player);
    await renderPlayers();
  }

  async function removePlayer(playerId) {
    await removePlayerFromDB(playerId);
    await renderPlayers();
  }

  if (addBtn && addPlayerModal) {
    addBtn.addEventListener('click', () => {
      addPlayerModal.style.display = '';
      if (addPlayerForm) {
        addPlayerForm.reset();
        editingPlayerId = null;
      }
    });
  }

  if (closeModalBtn && addPlayerModal) {
    closeModalBtn.addEventListener('click', () => {
      addPlayerModal.style.display = 'none';
    });
  }

  if (addPlayerForm) {
    addPlayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nick = addPlayerForm.elements['nick'].value.trim();
      const skill = addPlayerForm.elements['skill'].value;
      const admin = addPlayerForm.elements['admin'].checked;
      if (!nick) {
        alert('O campo nome é obrigatório.');
        return;
      }
      addPlayerModal.style.display = 'none';
      if (editingPlayerId) {
        updatePlayerName(editingPlayerId, { name: nick, skill, admin });
      } else {
        addPlayer({ name: nick, skill, admin });
      }
      editingPlayerId = null;
    });
  }

  async function addPlayer(player) {
    await addPlayerToDB(player);
    await renderPlayers();
  }
});
