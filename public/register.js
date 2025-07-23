// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCaMg5hNwMS3-qvAiQupRlc069n3Q9Zy_U",
  authDomain: "buga-business-suites.firebaseapp.com",
  projectId: "buga-business-suites",
  storageBucket: "buga-business-suites.appspot.com",
  messagingSenderId: "427083951264",
  appId: "1:427083951264:web:855f90d29449a5748dadc5",
  measurementId: "G-CRD9BMGJ8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Initialize EmailJS correctly (NO import, just global init)
emailjs.init("9gPg8Xl984_ESnJe7");

// 🔔 SweetAlert2 success popup
function showSuccessPopup() {
  Swal.fire({
    title: '🎉 Account Created!',
    text: 'Welcome to the Buga Family!',
    icon: 'success',
    confirmButtonColor: '#002e6b',
    confirmButtonText: 'Continue',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  });
}

// ✉️ Send welcome email
async function sendWelcomeEmail(fullName, email) {
  try {
    const result = await emailjs.send("buga_contact_service", "buga_welcome_email", {
      fullName,
      email
    });
    console.log("✅ Welcome email sent!", result.status);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

// 🧾 Register form handler
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const businessName = document.getElementById("businessName").value.trim();
  const businessType = document.getElementById("businessType").value;
  const businessCategory = document.getElementById("businessCategory").value;
  const businessAddress = document.getElementById("businessAddress").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    Swal.fire({
      title: "Error",
      text: "❌ Passwords do not match!",
      icon: "error",
      confirmButtonColor: "#d33"
    });
    return;
  }

  try {
    // 🔐 Register with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 🗃️ Store user data in Firestore
    await setDoc(doc(db, "users", uid), {
      fullName,
      email,
      phone,
      businessName,
      businessType,
      businessCategory,
      businessAddress,
      city,
      state,
      createdAt: serverTimestamp()
    });

    // 📧 Send welcome email
    await sendWelcomeEmail(fullName, email);

    // ✅ Success popup
    showSuccessPopup();

    // ⏳ Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2500);

  } catch (error) {
    console.error("🔥 Firebase Error:", error);
    Swal.fire({
      title: "Registration Failed",
      text: error.message,
      icon: "error",
      confirmButtonColor: "#d33"
    });
  }
});

// 👁️ Toggle password visibility
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const isPassword = input.getAttribute("type") === "password";
    input.setAttribute("type", isPassword ? "text" : "password");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});
