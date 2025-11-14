// ===============================
// Persistência localStorage
// ===============================
export function saveSelectedPlayers(selectedPlayers) {
  const toSave = selectedPlayers.map(p => ({ name: p.name, skill: p.skill, discord_id: p.discord_id, present: p.present || false }));
  localStorage.setItem("selectedPlayers", JSON.stringify(toSave));
}

export function loadSelectedPlayers() {
  const saved = localStorage.getItem("selectedPlayers");
  return saved ? JSON.parse(saved) : [];
}

// function loadSelectedPlayers() {
//   const saved = localStorage.getItem("selectedPlayers");
//   if (saved) {
//     try {
//       const arr = JSON.parse(saved);
//       arr.forEach(item => {
//         // define present = false se undefined, mantém se tiver valor
//         const present = item.present === true;
//         if (!selectedPlayers.find(p => p.name === item.name)) {
//           selectedPlayers.push({ name: item.name, skill: item.skill, present });
//         }
//         selectedPlayers.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
//       });
//       renderSelectedPlayers();
//     } catch (e) {
//       console.error("Erro ao carregar jogadores salvos:", e);
//     }
//   }
// }