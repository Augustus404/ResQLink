import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQU7n-P6lirLhXhyLuOm9JL-dnIf-j-2U",
  authDomain: "resqlink-73b57.firebaseapp.com",
  projectId: "resqlink-73b57",
  storageBucket: "resqlink-73b57.firebasestorage.app",
  messagingSenderId: "1089979527311",
  appId: "1:1089979527311:web:978de63a5d76348d7440fa",
  measurementId: "G-JVHWVP44H4"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

function popup(msg){
const p=document.getElementById("popup");
if(!p)return;
p.innerText=msg;
p.style.display="block";
setTimeout(()=>p.style.display="none",3000);
}

/* REGISTER */
if(document.getElementById("registerBtn")){
registerBtn.onclick=async()=>{
try{
const user=await createUserWithEmailAndPassword(auth,regEmail.value,regPassword.value);
await setDoc(doc(db,"users",user.user.uid),{
name:regName.value,
guardian:regGuardian.value
});
popup("✔ Account Registered");
setTimeout(()=>location.href="index.html",1500);
}catch(e){popup(e.code);}
};
}

/* LOGIN */
if(document.getElementById("loginBtn")){
loginBtn.onclick=async()=>{
loginError.innerText="";
try{
await signInWithEmailAndPassword(auth,loginEmail.value,loginPassword.value);
popup("✔ Login Successful");
setTimeout(()=>location.href="dashboard.html",1000);
}catch(e){
loginError.innerText="Invalid Credentials";
}
};
}

/* DASHBOARD */
if(document.getElementById("greeting")){
onAuthStateChanged(auth,async user=>{
if(!user){location.href="index.html";return;}
const snap=await getDoc(doc(db,"users",user.uid));
greeting.innerText="Welcome, "+snap.data().name;
initLocation();
});
}

/* LOGOUT */
if(document.getElementById("logoutBtn")){
logoutBtn.onclick=()=>signOut(auth).then(()=>location.href="index.html");
}

/* LOCATION */
function initLocation(){
navigator.geolocation.getCurrentPosition(pos=>{
window.lat=pos.coords.latitude;
window.lng=pos.coords.longitude;
mapFrame.src=`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
});
}

/* SOS */
if(document.getElementById("sosBtn")){
sosBtn.onclick=async()=>{
const user=auth.currentUser;
const snap=await getDoc(doc(db,"users",user.uid));
const guardian=snap.data().guardian;
const msg=`🚨 EMERGENCY\nhttps://www.google.com/maps?q=${lat},${lng}`;
window.location.href=`sms:${guardian}?body=${encodeURIComponent(msg)}`;
};
}

/* BLUETOOTH */
if(document.getElementById("bluetoothBtn")){
bluetoothBtn.onclick=async()=>{
await navigator.bluetooth.requestDevice({acceptAllDevices:true});
connectionDot.classList.add("connected");
connectionText.innerText="Stick Connected";
popup("Bluetooth Connected");
};
}
