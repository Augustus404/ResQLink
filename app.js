import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
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
  appId: "1:1089979527311:web:978de63a5d76348d7440fa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const screens=document.querySelectorAll(".screen");
function show(id){screens.forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");}
setTimeout(()=>show("login"),2000);

// Navigation
goRegister.onclick=()=>show("register");
goLogin.onclick=()=>show("login");

// Register
registerBtn.onclick=async()=>{
try{
const user=await createUserWithEmailAndPassword(auth,regEmail.value.trim(),regPassword.value.trim());
await setDoc(doc(db,"users",user.user.uid),{
name:regName.value.trim(),
guardian:regGuardian.value.trim()
});
alert("✔ Registration Completed");
show("login");
}catch(e){alert(e.code);}
};

// Login
loginBtn.onclick=async()=>{
loginError.innerText="";
try{
await signInWithEmailAndPassword(auth,loginEmail.value.trim(),loginPassword.value.trim());
}catch(e){
loginError.innerText="Invalid credentials";
}
};

// Auth listener
onAuthStateChanged(auth,async user=>{
if(!user)return;
const snap=await getDoc(doc(db,"users",user.uid));
if(!snap.exists()){alert("User data missing");return;}
greeting.innerText="Welcome, "+snap.data().name;
show("dashboard");
initLocation();
});

// Logout
logoutBtn.onclick=()=>signOut(auth).then(()=>show("login"));

// Location
function initLocation(){
navigator.geolocation.getCurrentPosition(pos=>{
window.lat=pos.coords.latitude;
window.lng=pos.coords.longitude;
mapFrame.src=`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
},{enableHighAccuracy:true});
}

// SOS
sosBtn.onclick=async()=>{
const user=auth.currentUser;
if(!user||!window.lat||!window.lng)return alert("Location not ready");
const snap=await getDoc(doc(db,"users",user.uid));
const guardian=snap.data().guardian;
const msg=`🚨 EMERGENCY\nhttps://www.google.com/maps?q=${lat},${lng}`;
window.location.href=`sms:${guardian}?body=${encodeURIComponent(msg)}`;
addActivity("SOS Sent");
};

// Activity
function addActivity(text){
const li=document.createElement("li");
li.innerText=new Date().toLocaleTimeString()+" - "+text;
activityList.prepend(li);
}

// Bluetooth
bluetoothBtn.onclick=async()=>{
if(!navigator.bluetooth)return alert("Bluetooth not supported");
try{
await navigator.bluetooth.requestDevice({acceptAllDevices:true});
connectionDot.classList.add("connected");
connectionText.innerText="Stick Connected";
addActivity("Bluetooth Connected");
}catch{}
};
