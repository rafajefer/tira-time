import { getSkillValue, levels } from './utils.js';

export function drawTeams(players, numTeams = 2, attempts = 5000) {

  // Adiciona campo numérico
  const pool = players.map(p => ({ ...p, _skillNum: getSkillValue(p.skill) }));

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

export function renderTeams(teams) {
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
                <span>${p.name} — ${p.skill} - ${getSkillValue(p.skill)}</span>
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