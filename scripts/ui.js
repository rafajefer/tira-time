import { addSelectedPlayer, removePlayer, removeAllPlayers, togglePresence, clearAllPresences } from './players.js';

export function renderPlayersInputSearch(players) {
    const list = document.querySelector('#selected-players');
    const searchInput = document.querySelector('#search-input');
    const autocompleteList = document.getElementById("autocomplete-list");
    // list.innerHTML = '';
    autocompleteList.innerHTML = "";

    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} (${player.skill})`;
        li.addEventListener("click", () => {
            addSelectedPlayer(player);
            autocompleteList.innerHTML = "";
            searchInput.value = "";
        });
        autocompleteList.appendChild(li);
    });
}


export function renderSelectedPlayers(selectedPlayers) {
    const list = document.getElementById("selected-players");

    const total = selectedPlayers.length;
    const presentes = selectedPlayers.filter(p => p.present).length;
    
    list.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>Jogadores Selecionados (${total})</h3>
        <div style="display:flex; gap:10px;">
            <button id="btn-clear-presence" style="background:#ffc107; border:none; padding:7px 10px; cursor:pointer;">🧹 Limpar presença</button>
            <button id="btn-remove-all" style="background:#dc3545; color:#fff; border:none; padding:7px 10px; cursor:pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Remover todos
            </button>
        </div>
        </div>

        <p style="margin-top: -5px; color: gray;">Presentes: ${presentes}</p>
        <ul id="selected-players-list" style="list-style:none; padding-left:0;">
        ${selectedPlayers
            .map((p, i) => {
            const presentStyle = p.present
                ? "color: green; font-weight: bold; text-decoration: line-through;"
                : "";
            return `
                <li data-index="${i}" style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                    <input 
                        class="presence-checkbox"
                        type="checkbox" 
                        id="presence-${i}" 
                        ${p.present ? "checked" : ""} 
                    />
                    <span class="player-name" style="cursor:pointer; ${presentStyle}">
                        <strong>${p.name}</strong> — ${p.skill}
                    </span>
                    <button class="remove-player-btn">Remover</button>
                </li>`;
            })
            .join("")}
        </ul>
    `;

    document.getElementById("btn-clear-presence")?.addEventListener("click", clearAllPresences);

    document.getElementById("btn-remove-all")?.addEventListener("click", removeAllPlayers);

    document.querySelectorAll(".remove-player-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const li = e.target.closest("li");
            const index = Number(li?.dataset.index);
            removePlayer(index);
        });
    });

    document.querySelectorAll(".player-name").forEach(span => {
        span.addEventListener("click", (e) => {
            const li = e.target.closest("li");
            const index = Number(li?.dataset.index);
            const checkbox = li.querySelector(".presence-checkbox");
            checkbox.checked = !checkbox.checked;
            const isChecked = checkbox.checked;
            togglePresence(index, isChecked);
        });
    });

    document.querySelectorAll(".presence-checkbox").forEach(chk => {
        chk.addEventListener("change", (e) => {
            const li = e.target.closest("li");
            const index = Number(li?.dataset.index);
            const isChecked = e.target.checked;
            togglePresence(index, isChecked);
        });
    });
}

export function initSearch(onSearch) {
    const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            autocompleteList.innerHTML = "";
        }
        onSearch(query);
    });
}