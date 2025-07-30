// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaMg5hNwMS3-qvAiQupRlc069n3Q9Zy_U",
  authDomain: "buga-business-suites.firebaseapp.com",
  projectId: "buga-business-suites",
  storageBucket: "buga-business-suites.appspot.com",
  messagingSenderId: "427083951264",
  appId: "1:427083951264:web:855f90d29449a5748dadc5",
  measurementId: "G-CRD9BMGJ8P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let currentUser;

onAuthStateChanged(auth, (user) => {
  if (user && !user.emailVerified) {
    currentUser = user;
  }
});

document.getElementById('resendBtn').addEventListener('click', () => {
  if (currentUser) {
    sendEmailVerification(currentUser)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Verification Email Sent!',
          text: 'Check your inbox again.',
          timer: 3000,
          showConfirmButton: false
        });
        startCooldown(30);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        });
      });
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Login Required',
      text: 'You must be logged in to resend verification.'
    });
  }
});

// Cooldown logic
function startCooldown(duration) {
  const resendBtn = document.getElementById("resendBtn");
  const cooldownText = document.getElementById("cooldownText");
  let timeLeft = duration;

  resendBtn.disabled = true;
  cooldownText.textContent = `You can resend in ${timeLeft}s`;
  localStorage.setItem("resendCooldown", Date.now() + duration * 1000);

  const interval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(interval);
      resendBtn.disabled = false;
      cooldownText.textContent = "";
      localStorage.removeItem("resendCooldown");
    } else {
      cooldownText.textContent = `You can resend in ${timeLeft}s`;
    }
  }, 1000);
}

function restoreCooldown() {
  const cooldownEnd = localStorage.getItem("resendCooldown");
  if (cooldownEnd) {
    const now = Date.now();
    const timeLeft = Math.floor((cooldownEnd - now) / 1000);
    if (timeLeft > 0) startCooldown(timeLeft);
    else localStorage.removeItem("resendCooldown");
  }
}

restoreCooldown();

// particles-config.js
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 40 },
    "color": { "value": "#ffeba7" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5 },
    "size": { "value": 3 },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": {
    "events": {
      "onhover": { "enable": true, "mode": "grab" }
    }
  },
  "retina_detect": true
});
