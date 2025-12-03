// Variáveis globais para userInfoDiv e userNameSpan
let userInfoDiv;
let userNameSpan;

import { getPlayersDb, selectedPlayers } from './players.js';
import { loadSelectedPlayers } from './storage.js';
import { drawTeams, renderTeams } from './teams.js';
import { initSearch, renderPlayersInputSearch, renderSelectedPlayers } from './ui.js';
import { loginWithGoogle, logoutGoogle, observeAuthState } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {

    // Elementos do menu lateral
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const sideUserName = document.getElementById('side-user-name');
    const sideLogoutBtn = document.getElementById('side-logout-btn');
    const sidePlayersBtn = document.getElementById('side-players-btn');
                    // Redirecionamento dos botões do menu lateral
                    if (sidePlayersBtn) {
                        sidePlayersBtn.addEventListener('click', () => {
                            window.location.href = 'jogadores.html';
                        });
                    }
                    const sideMembersBtn = document.getElementById('side-members-btn');
                    if (sideMembersBtn) {
                        sideMembersBtn.addEventListener('click', () => {
                            window.location.href = 'membros.html';
                        });
                    }
                // Evento para login com Google
                const googleLoginBtn = document.getElementById('google-login-btn');
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
            // Funções para mostrar/ocultar usuário
            function showUser(user) {
                userInfoDiv = document.getElementById('user-info');
                userNameSpan = document.getElementById('user-name');
                if (userInfoDiv && userNameSpan) {
                    userNameSpan.textContent = user.displayName || user.email || 'Usuário';
                    userInfoDiv.style.display = '';
                }
                if (menuToggle) menuToggle.style.display = '';
                if (sideUserName) sideUserName.textContent = user.displayName || user.email || 'Usuário';
            }
            function hideUser() {
                userInfoDiv = document.getElementById('user-info');
                userNameSpan = document.getElementById('user-name');
                if (userInfoDiv && userNameSpan) {
                    userNameSpan.textContent = '';
                    userInfoDiv.style.display = 'none';
                }
                // Mostrar botão de login
                const googleLoginBtn = document.getElementById('google-login-btn');
                if (googleLoginBtn) googleLoginBtn.style.display = 'flex';
                if (menuToggle) menuToggle.style.display = 'none';
                if (sideMenu) sideMenu.style.display = 'none';
            }
        // Função para mostrar/ocultar itens do menu conforme admin
        async function updateMenuAdmin() {
            try {
                const { getCurrentMember } = await import('./getCurrentMember.js');
                const member = await getCurrentMember();
                const playersBtn = document.getElementById('side-players-btn');
                const membersBtn = document.getElementById('side-members-btn');
                if (member && member.isAdmin) {
                    if (playersBtn) playersBtn.style.display = '';
                    if (membersBtn) membersBtn.style.display = '';
                } else {
                    if (playersBtn) playersBtn.style.display = 'none';
                    if (membersBtn) membersBtn.style.display = 'none';
                }
            } catch (e) {
                // Se erro, esconde por segurança
                const playersBtn = document.getElementById('side-players-btn');
                const membersBtn = document.getElementById('side-members-btn');
                if (playersBtn) playersBtn.style.display = 'none';
                if (membersBtn) membersBtn.style.display = 'none';
            }
        }

    // Função para abrir/fechar menu
    function openMenu() {
        if (sideMenu) sideMenu.style.display = '';
    }
    function closeMenu() {
        if (sideMenu) sideMenu.style.display = 'none';
    }
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (sideMenu) {
        sideMenu.addEventListener('click', (e) => {
            if (e.target === sideMenu) closeMenu();
        });
    }
    // Fecha menu ao clicar fora (mobile UX)
    document.addEventListener('click', (e) => {
        if (sideMenu && sideMenu.style.display !== 'none' && !sideMenu.contains(e.target) && e.target !== menuToggle) {
            closeMenu();
        }
    });
    // Observa estado de autenticação para manter login após F5
    observeAuthState((user) => {
        if (user) {
            showUser(user);
            updateMenuAdmin();
        } else {
            hideUser();
            updateMenuAdmin();
        }
    });
    console.log("Iniciando aplicação...");
    const allPlayers = await getPlayersDb();
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