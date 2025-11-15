const BASE_URL = "http://localhost:8000";

export async function movePlayerToRoomConfirmed(discordId) {
  try {
    const response = await fetch(`${BASE_URL}/discord/move_player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 'discord_id': discordId })
    });

    if (!response.ok) throw new Error("Erro na chamada da API");

    const data = await response.json();
    alert(`API chamada com sucesso para ${name}`);
  } catch (error) {
    alert(`Erro ao chamar API para ${name}`);
  }
}

async function movePlayerToRoomTeam(name, skill) {
  try {
    const response = await fetch(`${BASE_URL}/sua-rota`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, skill })
    });

    if (!response.ok) throw new Error("Erro na chamada da API");

    const data = await response.json();
    alert(`API chamada com sucesso para ${name}`);
  } catch (error) {
    alert(`Erro ao chamar API para ${name}`);
  }
}

async function moveTeamRoomTeam(name, skill) {
  try {
    const response = await fetch("http://localhost:8000/sua-rota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, skill })
    });

    if (!response.ok) throw new Error("Erro na chamada da API");

    const data = await response.json();
    alert(`API chamada com sucesso para ${name}`);
  } catch (error) {
    alert(`Erro ao chamar API para ${name}`);
  }
}
