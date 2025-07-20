import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

// Handle login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Toggle password visibility
const toggle = document.querySelector(".toggle-password i");
const passwordInput = document.getElementById("loginPassword");

toggle.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  toggle.classList.toggle("fa-eye");
  toggle.classList.toggle("fa-eye-slash");
});
