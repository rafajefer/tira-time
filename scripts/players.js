import { saveSelectedPlayers } from './storage.js';
import { renderSelectedPlayers } from './ui.js';

export let allPlayers = [];
export let selectedPlayers = [];

export function removePlayer(index) {
    selectedPlayers.splice(index, 1);
    saveSelectedPlayers(selectedPlayers);
    renderSelectedPlayers(selectedPlayers);
}

export function removeAllPlayers() {
    if (confirm("Tem certeza que deseja remover todos os jogadores?")) {
        selectedPlayers = [];
        saveSelectedPlayers(selectedPlayers);
        renderSelectedPlayers(selectedPlayers);
    }
}

export async function togglePresence(index, isChecked) {
    const player = selectedPlayers[index];
    if (!player) return;
    player.present = isChecked;
    saveSelectedPlayers(selectedPlayers);
    renderSelectedPlayers(selectedPlayers); 
}

export function clearAllPresences() {
    selectedPlayers.forEach(p => p.present = false);
    saveSelectedPlayers(selectedPlayers);
    renderSelectedPlayers(selectedPlayers);
}

export function addSelectedPlayer(player) {
    if (selectedPlayers.find(p => p.name === player.name)) {
        return;
    }
    player.present = false;
    selectedPlayers.push(player);
    selectedPlayers.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
    saveSelectedPlayers(selectedPlayers);
    renderSelectedPlayers(selectedPlayers);
}

export async function getPlayers() {
    try {
        const response = await fetch('notas.csv');
        const text = await response.text();

        const linhas = text.split('\n').filter(l => l.trim() !== '');
        const dados = linhas.slice(1);

        allPlayers = dados.map(linha => {
            const [name, skill, discord_id] = linha.split(',').map(x => x.trim());
            return { name, skill, discord_id };
        });
        return allPlayers;
    } catch (err) {
        console.error('Erro ao carregar CSV:', err);
        return [];
    }
}