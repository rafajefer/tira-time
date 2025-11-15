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
