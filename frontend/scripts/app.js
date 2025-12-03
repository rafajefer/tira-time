import { getPlayers, selectedPlayers } from './players.js';
import { loadSelectedPlayers } from './storage.js';
import { drawTeams, renderTeams } from './teams.js';
import { initSearch, renderPlayersInputSearch, renderSelectedPlayers } from './ui.js';
import { loginWithGoogle, logoutGoogle, observeAuthState } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
        // Observa estado de autenticação para manter login após F5
        observeAuthState((user) => {
            if (user) {
                showUser(user);
            } else {
                hideUser();
            }
        });
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

    // Google login/logout UI logic
    const googleLoginBtn = document.getElementById('google-login-btn');
    const userInfoDiv = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatar = document.getElementById('user-avatar');

    function showUser(user) {
        if (userInfoDiv && userNameSpan && googleLoginBtn) {
            userNameSpan.textContent = user.displayName || user.email || 'Usuário';
            userInfoDiv.style.display = '';
            googleLoginBtn.style.display = 'none';
            if (userAvatar) {
                if (user.photoURL) {
                    userAvatar.src = user.photoURL;
                    userAvatar.style.display = '';
                } else {
                    userAvatar.src = '';
                    userAvatar.style.display = 'none';
                }
            }
        }
    }
    function hideUser() {
        if (userInfoDiv && userNameSpan && googleLoginBtn) {
            userNameSpan.textContent = '';
            userInfoDiv.style.display = 'none';
            googleLoginBtn.style.display = '';
            if (userAvatar) {
                userAvatar.src = '';
                userAvatar.style.display = 'none';
            }
        }
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                const user = await loginWithGoogle();
                showUser(user);
            } catch (err) {
                alert('Falha ao logar com Google.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logoutGoogle();
                hideUser();
            } catch (err) {
                alert('Falha ao deslogar.');
            }
        });
    }
});