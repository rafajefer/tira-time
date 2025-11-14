import { saveSelectedPlayers } from './storage.js';
import { renderSelectedPlayers } from './ui.js';

// ===============================
// Carrega jogadores do CSV
// ===============================
// export async function getPlayers() {
//   try {
//     const response = await fetch('../notas.csv');
//     const text = await response.text();

//     const linhas = text.split('\n').filter(l => l.trim() !== '');
//     const dados = linhas.slice(1); // pule o cabeçalho, se houver

//     allPlayers = dados.map(linha => {
//       const colunas = linha.split(',');
//       // Normaliza: name e skill como string
//       const name = colunas[0]?.trim();
//       const skillRaw = colunas[1]?.trim() || "";
//       return {
//         name,
//         skill: skillRaw
//       };
//     });

//     console.log('Jogadores carregados:', allPlayers);
//     initSearch(); // inicia autocomplete
//   } catch (error) {
//     console.error('Erro ao carregar CSV:', error);
//   }
// }


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


// limpa todas as presenças
export function clearAllPresences() {
    selectedPlayers.forEach(p => p.present = false);
    saveSelectedPlayers(selectedPlayers);
    renderSelectedPlayers(selectedPlayers);
}

export function addSelectedPlayer(player) {
    console.log("Adicionando jogador2:", player);
    console.log("Jogadores atualmente selecionados:", selectedPlayers);
    if (selectedPlayers.find(p => p.name === player.name)) {
        console.log(`Jogador ${player.name} já está na lista.`);
        return;
    }
    player.present = false;
    selectedPlayers.push(player);
    selectedPlayers.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
    console.log("Jogadores selecionados atualizados:", selectedPlayers);
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