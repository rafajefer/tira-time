// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);

// Google Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      // Usuário logado
      const user = result.user;
      console.log('Usuário logado:', user);
      return user;
    })
    .catch((error) => {
      console.error('Erro ao logar com Google:', error);
      throw error;
    });
}