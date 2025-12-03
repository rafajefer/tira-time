import { getDatabase, ref, push, set, update, remove, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
// Salvar usuário logado em 'members' (evita duplicidade por uid)
export async function saveMember(user) {
  const db = getDatabase(app);
  if (!user || !user.uid) return;
  // Verifica se já existe
  const membersRef = ref(db, 'members');
  const q = query(membersRef, orderByChild('uid'), equalTo(user.uid));
  const snap = await get(q);
  if (snap.exists()) return; // já salvo
  // Salva novo membro
  const memberData = {
    uid: user.uid,
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    isAdmin: false,
    nickname: ''
  };
  await push(membersRef, memberData);
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjLU8zwF5bFgZDzguHfnQ9BsHWtJjquA8",
  authDomain: "tira-time-7b6bc.firebaseapp.com",
  databaseURL: "https://tira-time-7b6bc-default-rtdb.firebaseio.com",
  projectId: "tira-time-7b6bc",
  storageBucket: "tira-time-7b6bc.firebasestorage.app",
  messagingSenderId: "240699308200",
  appId: "1:240699308200:web:1ccacd7d97f4f13f3c2a9d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar Database
const db = getDatabase(app);

// Adicionar jogador
export async function addPlayerToDB(player) {
  const playersRef = ref(db, 'players');
  const newPlayerRef = push(playersRef);
  await set(newPlayerRef, player);
  return newPlayerRef.key;
}

// Editar jogador
export async function updatePlayerInDB(playerId, player) {
  const playerRef = ref(db, `players/${playerId}`);
  await update(playerRef, player);
}

// Remover jogador
export async function removePlayerFromDB(playerId) {
  const playerRef = ref(db, `players/${playerId}`);
  await remove(playerRef);
}

// Listar jogadores
export async function getPlayersFromDB() {
  const snapshot = await get(child(ref(db), 'players'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Retorna array de objetos {id, ...dados}
    return Object.entries(data).map(([id, value]) => ({ id, ...value }));
  }
  return [];
}
export function observeAuthState(callback) {
  onAuthStateChanged(auth, callback);
}
export function logoutGoogle() {
  return signOut(auth)
    .then(() => {
      console.log('Usuário deslogado');
    })
    .catch((error) => {
      console.error('Erro ao deslogar:', error);
      throw error;
    });
}

// Google Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await saveMember(user);
    console.log('Usuário logado:', user);
    return user;
  } catch (error) {
    console.error('Erro ao logar com Google:', error);
    throw error;
  }
}