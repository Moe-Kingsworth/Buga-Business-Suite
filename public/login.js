import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ✅ SweetAlert2 is already loaded in login.html via CDN

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
  const rememberMeChecked = document.getElementById("rememberMe").checked;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // ✅ Save email if "Remember Me" is checked
      if (rememberMeChecked) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // ✅ SweetAlert2 success pop-up
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to Buga!',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#002e6b'
      }).then(() => {
        window.location.href = "dashboard.html"; // ✅ redirect after popup
      });
    })
    .catch((error) => {
      // ❌ SweetAlert2 error pop-up
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        confirmButtonColor: '#d33'
      });
    });
});

// Toggle password visibility
document.querySelector('.toggle-password').addEventListener('click', function () {
  const passwordInput = document.getElementById('loginPassword');
  const icon = this.querySelector('i');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

// Prefill if remembered
const savedEmail = localStorage.getItem("rememberedEmail");
if (savedEmail) {
  document.getElementById("loginEmail").value = savedEmail;
  document.getElementById("rememberMe").checked = true;
}
