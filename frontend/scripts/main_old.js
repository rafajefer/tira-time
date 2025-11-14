// app.js (versão corrigida)

import { movePlayerToRoomConfirmed } from './api.js';

let selectedPlayers = [];
let allPlayers = [];

const levels = {
  'S': 10,
  'A+': 9.5,
  'A': 9,
  'B+': 8.5,
  'B': 8,
  'C': 7,
  'D': 6
};

// ===============================
// Utilitários de skill
// ===============================
// function getSkillValue(skill) {
//   // skill pode ser string ("A+", "4") ou número
//   if (typeof skill === 'number') return Number(skill);
//   if (!skill && skill !== 0) return 0;

//   const s = String(skill).trim();

//   // se está no mapa levels
//   if (levels[s] !== undefined) return Number(levels[s]);

//   // tenta converter número em string
//   const n = parseFloat(s.replace(',', '.'));
//   return Number.isFinite(n) ? n : 0;
// }


// ===============================
// Inicializa campo de busca
// ===============================
function initSearch() {
  const searchInput = document.getElementById("search");
  const autocompleteList = document.getElementById("autocomplete-list");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if (query.length < 1) return;

    // Filtra os jogadores que correspondem à busca
    let filtered = allPlayers.filter(p =>
      p.name &&
      p.name.toLowerCase().includes(query) &&
      !selectedPlayers.some(sp => sp.name === p.name)
    );

    // Ordena alfabeticamente pelo nome
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));

    // Renderiza a lista
    filtered.forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name} (${player.skill})`;
      li.addEventListener("click", () => {
        addSelectedPlayer(player);
        autocompleteList.innerHTML = "";
        searchInput.value = "";
      });
      autocompleteList.appendChild(li);
    });
  });

  // fecha a lista ao clicar fora
  document.addEventListener('click', (ev) => {
    if (!searchInput.contains(ev.target)) {
      autocompleteList.innerHTML = "";
    }
  });
}




// ===============================
// Adiciona jogador selecionado
// ===============================
function addSelectedPlayer(player) {
  const normalized = { name: player.name, skill: player.skill, present: false }; // default present false
  if (selectedPlayers.find(p => p.name === normalized.name)) return;

  selectedPlayers.push(normalized);
  selectedPlayers.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
  renderSelectedPlayers();
  saveSelectedPlayers();
}

// ===============================
// Renderiza jogadores selecionados
// ===============================
function renderSelectedPlayers() {
  const list = document.getElementById("selected-players");

  const total = selectedPlayers.length;
  const presentes = selectedPlayers.filter(p => p.present).length;
  
  list.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>Jogadores Selecionados (${total})</h3>
      <div style="display:flex; gap:10px;">
        <button onclick="clearPresence()" style="background:#ffc107; border:none; padding:7px 10px; cursor:pointer;">🧹 Limpar presença</button>
        <button onclick="removeAllPlayers()" style="background:#dc3545; color:#fff; border:none; padding:7px 10px; cursor:pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Remover todos</button>
      </div>
    </div>

    <p style="margin-top: -5px; color: gray;">Presentes: ${presentes}</p>
    <ul style="list-style:none; padding-left:0;">
      ${selectedPlayers
        .map((p, i) => {
          const presentStyle = p.present
            ? "color: green; font-weight: bold; text-decoration: line-through;"
            : "";
          return `
            <li style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
              <input 
                type="checkbox" 
                id="presence-${i}" 
                ${p.present ? "checked" : ""} 
                onchange="togglePresence(${i}, this.checked)"
              />
              <span 
                style="cursor:pointer; ${presentStyle}" 
                onclick="togglePlayerPresence(${i})"
              >
                <strong>${p.name}</strong> — ${p.skill}
              </span>
              <button 
                class="remove-player-btn"
                onclick="removePlayer(${i})">
                Remover
              </button>
            </li>`;
        })
        .join("")}
    </ul>
  `;
}


// limpa todas as presenças
function clearPresence() {
  selectedPlayers = selectedPlayers.map(p => ({ ...p, present: false }));
  localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
  renderSelectedPlayers();
}

// remove todos os jogadores
function removeAllPlayers() {
  if (confirm("Tem certeza que deseja remover todos os jogadores?")) {
    selectedPlayers = [];
    localStorage.removeItem('selectedPlayers');
    renderSelectedPlayers();
  }
}


function togglePlayerPresence(index) {
  const checkbox = document.getElementById(`presence-${index}`);
  checkbox.checked = !checkbox.checked;
  togglePresence(index, checkbox.checked);
}

// ===============================
// Remove jogador da seleção
// ===============================
function removePlayer(index) {
  selectedPlayers.splice(index, 1);
  renderSelectedPlayers();
  saveSelectedPlayers();
}

// ===============================
// Sorteia times equilibrados
// ===============================
function drawTeams(players, numTeams = 2, attempts = 5000) {
  // Converter skill para número
  const getSkillNum = (p) => {
    if (typeof p.skill === 'number') return p.skill;
    if (levels && levels[p.skill] !== undefined) return Number(levels[p.skill]);
    const n = parseFloat(p.skill);
    return Number.isFinite(n) ? n : 0;
  };

  // Adiciona campo numérico
  const pool = players.map(p => ({ ...p, _skillNum: getSkillNum(p) }));

  let bestTeams = null;
  let bestDiff = Infinity;

  // Tenta várias combinações aleatórias
  for (let attempt = 0; attempt < attempts; attempt++) {
    // Embaralha os jogadores
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // Cria times vazios
    const teams = Array.from({ length: numTeams }, () => []);

    // Distribui em rodízio (round-robin)
    shuffled.forEach((p, i) => {
      teams[i % numTeams].push(p);
    });

    // Calcula o total de cada time
    const totals = teams.map(t => t.reduce((sum, p) => sum + p._skillNum, 0));

    // Diferença entre o mais forte e o mais fraco
    const diff = Math.max(...totals) - Math.min(...totals);

    // Se for o mais equilibrado até agora, salva
    if (diff < bestDiff) {
      bestDiff = diff;
      bestTeams = teams.map(t => [...t]);
      // early exit se for perfeito
      if (diff === 0) break;
    }
  }

  console.log(`Melhor equilíbrio encontrado (diferença total: ${bestDiff.toFixed(2)}) após ${attempts} tentativas.`);
  return bestTeams;
}

// ===============================
// Renderiza times sorteados
// ===============================
function renderTeams(teams) {
  const resultDiv = document.getElementById("result");

  // Calcula total e média de cada time
  const teamStats = teams.map(team => {
    const total = team.reduce((sum, p) => sum + ((levels[p.skill] ?? parseFloat(p.skill)) || 0), 0);
    const media = team.length ? (total / team.length).toFixed(2) : "0.00";
    return { team, total, media: parseFloat(media) };
  });

  const minTotal = Math.min(...teamStats.map(t => t.total));
  const diff = Math.max(...teamStats.map(t => t.total)) - minTotal;
  const bestTeamIndex = teamStats.findIndex(t => t.total === minTotal);

  let html = `<div class="row" style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">`;

  teamStats.forEach(({ team, total, media }, index) => {
    const isBest = index === bestTeamIndex;
    html += `
      <div class="team ${isBest ? "best-team" : ""}" style="flex:1; min-width:250px; border:1px solid #ccc; border-radius:8px; padding:10px;">
        <h3>Time ${index + 1} ${isBest ? "🏆" : ""}</h3>
        <ul>
          ${team.map((p, i) => `
            <li style="display:flex; align-items:center; justify-content:space-between; margin-bottom:5px;">
              <span>${p.name} — ${p.skill}</span>
              <button 
                style="padding:4px 8px; border:none; border-radius:4px; background:var(--bs-primary); color:#fff; cursor:pointer;"
                onclick="movePlayerToRoomConfirmed('${encodeURIComponent(p.name)}', '${encodeURIComponent(p.skill)}')"
              >
                Mover
              </button>
            </li>
          `).join('')}
          </ul>
        <p><strong>Jogadores:</strong> ${team.length}</p>
        <p><strong>Habilidade total:</strong> ${total}</p>
        <p><strong>Média de habilidade:</strong> ${media}</p>
      </div>
    `;
  });

  html += `</div>`;

  html += `
    <div class="analysis" style="margin-top:20px; text-align:center;">
      ${diff === 0
        ? `<p>⚖️ <strong>Times perfeitamente equilibrados!</strong></p>`
        : `<p>🏆 <strong>Time ${bestTeamIndex + 1}</strong> é o mais forte (${diff} pontos de vantagem).</p>`
      }
    </div>
  `;

  resultDiv.innerHTML = html;
}

async function callApi(name, skill) {
  try {
    const response = await fetch("http://localhost:8000/sua-rota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, skill })
    });

    if (!response.ok) throw new Error("Erro na chamada da API");

    const data = await response.json();
    console.log("Resposta da API:", data);
    alert(`API chamada com sucesso para ${name}`);
  } catch (error) {
    console.error("Falha ao chamar API:", error);
    alert(`Erro ao chamar API para ${name}`);
  }
}

async function togglePresence(index, isChecked) {
  const player = selectedPlayers[index];
  if (!player) return;
  player.present = isChecked;
  saveSelectedPlayers();
  renderSelectedPlayers(); // atualiza UI imediatamente

  try {
    const response = await fetch("http://localhost:8000/presenca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: player.name,
        skill: player.skill,
        present: isChecked
      })
    });
    if (!response.ok) throw new Error("Erro ao enviar presença");
  } catch (error) {
    console.error("Falha ao enviar presença:", error);
  }
}

// ===============================
// Inicializa App
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  getPlayers();
  loadSelectedPlayers();

  document.getElementById("btn-draw").addEventListener("click", () => {
    if (selectedPlayers.length < 2) {
      alert("Selecione pelo menos 2 jogadores para o sorteio!");
      return;
    }

    const numTeams = parseInt(document.getElementById("num-teams")?.value || "2", 10);
    // fallback em caso de elemento inexistente:
    const finalNumTeams = Number.isFinite(numTeams) && numTeams > 0 ? numTeams : 2;

    const teams = drawTeams(selectedPlayers, finalNumTeams);
    renderTeams(teams);
  });
});
