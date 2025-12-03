// Retorna membro atual do banco pelo UID
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { app } from './firebase.js';

export async function getCurrentMember() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user || !user.uid) return null;
  const db = getDatabase(app);
  const membersRef = ref(db, 'members');
  const q = query(membersRef, orderByChild('uid'), equalTo(user.uid));
  const snap = await get(q);
  if (!snap.exists()) return null;
  // Firebase retorna objeto, pegar primeiro
  const val = snap.val();
  const key = Object.keys(val)[0];
  return { id: key, ...val[key] };
}
