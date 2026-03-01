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

/* ================= POPUP ================= */

function popup(msg){
const p=document.getElementById("popup");
if(!p)return;
p.innerText=msg;
p.style.display="block";
setTimeout(()=>p.style.display="none",3000);
}

/* ================= REGISTER ================= */

if(document.getElementById("registerBtn")){
registerBtn.onclick=async()=>{
try{
const user=await createUserWithEmailAndPassword(auth,regEmail.value.trim(),regPassword.value.trim());

await setDoc(doc(db,"users",user.user.uid),{
name:regName.value.trim(),
guardian:regGuardian.value.trim()
});

popup("✔ Account Registered Successfully");
setTimeout(()=>location.href="index.html",1500);

}catch(e){
popup(e.code);
}
};
}

/* ================= LOGIN ================= */

if(document.getElementById("loginBtn")){
loginBtn.onclick=async()=>{
loginError.innerText="";
try{
await signInWithEmailAndPassword(auth,loginEmail.value.trim(),loginPassword.value.trim());
popup("✔ Login Successful");
setTimeout(()=>location.href="dashboard.html",1000);
}catch(e){
loginError.innerText="Invalid Credentials";
}
};
}

/* ================= DASHBOARD AUTH ================= */

if(document.getElementById("greeting")){
onAuthStateChanged(auth,async user=>{
if(!user){
location.href="index.html";
return;
}

const snap=await getDoc(doc(db,"users",user.uid));
if(!snap.exists()){
popup("User data missing");
return;
}

greeting.innerText="Welcome, "+snap.data().name;
initLocation();
});
}

/* ================= LOGOUT ================= */

if(document.getElementById("logoutBtn")){
logoutBtn.onclick=()=>signOut(auth).then(()=>location.href="index.html");
}

/* ================= LOCATION ================= */

function initLocation(){
if(!navigator.geolocation){
popup("Geolocation not supported");
return;
}

navigator.geolocation.getCurrentPosition(pos=>{
window.lat=pos.coords.latitude;
window.lng=pos.coords.longitude;

if(document.getElementById("mapFrame")){
mapFrame.src=`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

},()=>{
popup("Location permission denied");
},{enableHighAccuracy:true});
}

/* ================= NATIVE SMS BRIDGE ================= */

function sendNativeSMS(number, message){

// If running inside Android app
if(window.AndroidSMS){
AndroidSMS.sendSMS(number, message);
popup("🚨 SOS Sent Automatically");
}
else{
// Browser fallback (opens SMS app)
window.location.href=`sms:${number}?body=${encodeURIComponent(message)}`;
}

}

/* ================= SOS ================= */

if(document.getElementById("sosBtn")){
sosBtn.onclick = async () => {

const user = auth.currentUser;
if(!user){
popup("User not authenticated");
return;
}

if(!window.lat || !window.lng){
popup("Location not ready yet");
return;
}

const snap = await getDoc(doc(db,"users",user.uid));
if(!snap.exists()){
popup("Guardian not found");
return;
}

const guardian = snap.data().guardian;

const msg =
`🚨 EMERGENCY ALERT
Live Location:
https://maps.google.com?q=${lat},${lng}`;

sendNativeSMS(guardian, msg);
};
}

/* ================= BLUETOOTH ================= */

if(document.getElementById("bluetoothBtn")){
bluetoothBtn.onclick=async()=>{
try{
await navigator.bluetooth.requestDevice({acceptAllDevices:true});
connectionDot.classList.add("connected");
connectionText.innerText="Stick Connected";
popup("Bluetooth Connected");
}catch(e){
popup("Bluetooth connection cancelled");
}
};
}
