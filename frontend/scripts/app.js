import { getPlayers, selectedPlayers } from './players.js';
import { loadSelectedPlayers } from './storage.js';
import { drawTeams, renderTeams } from './teams.js';
import { initSearch, renderPlayersInputSearch, renderSelectedPlayers } from './ui.js';

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Iniciando aplicação...");
    const allPlayers = await getPlayers();
    const saved = loadSelectedPlayers();
    if (saved.length) selectedPlayers.push(...saved);

    renderSelectedPlayers(selectedPlayers);

    initSearch(query => {
        if (query.length < 1) return;
        
        const filtered = allPlayers.filter(p =>
            p.name &&
            p.name.toLowerCase().includes(query) &&
            !selectedPlayers.find(sp => sp.name === p.name)
        );

        // Ordena alfabeticamente pelo nome
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
        renderPlayersInputSearch(filtered);
    });

    document.getElementById("btn-draw").addEventListener("click", () => {
        if (selectedPlayers.length < 2) {
            alert("Selecione pelo menos 2 jogadores!");
            return;
        }
        const numTeams = parseInt(document.getElementById("num-teams").value || "2");
        const finalNumTeams = Number.isFinite(numTeams) && numTeams > 0 ? numTeams : 2;
        const teams = drawTeams(selectedPlayers, finalNumTeams);
        renderTeams(teams);
    });
});