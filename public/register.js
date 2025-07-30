// Firebase SDK imports 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Init EmailJS
emailjs.init("9gPg8Xl984_ESnJe7");

// SweetAlert success popup
function showSuccessPopup() {
  Swal.fire({
    title: '🎉 Account Created!',
    html: `<p>Welcome to the Buga Family!</p>
           <p><strong>Check your email to activate your account.</strong></p>`,
    icon: 'success',
    confirmButtonColor: '#002e6b',
    timer: 5000,
    timerProgressBar: true,
    showConfirmButton: false
  });
}

// Send welcome email
async function sendWelcomeEmail(fullName, email) {
  try {
    await emailjs.send("buga_contact_service", "buga_welcome_email", {
      fullName,
      email
    });
  } catch (error) {
    console.error("❌ EmailJS error:", error);
  }
}

// Main form submit handler
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerText = "Registering...";

  // Collect form values
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

  // Validate password match before any Firebase call
  if (password !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Passwords do not match!',
      confirmButtonColor: '#d33'
    });
    submitBtn.disabled = false;
    submitBtn.innerText = "Create Account";
    return;
  }

  try {
    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Save additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
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

    // Send welcome email
    await sendWelcomeEmail(fullName, email);

    // Show success message
    showSuccessPopup();

    // Reset form for UX
    document.getElementById("signupForm").reset();

    // Redirect to login
    setTimeout(() => {
      window.location.href = "login.html";
    }, 5000);

  } catch (error) {
    console.error("🔥 Firebase Error:", error);
    let message = "An error occurred. Please try again.";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered. Try logging in.";
        break;
      case "auth/invalid-email":
        message = "Please enter a valid email address.";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters.";
        break;
      default:
        message = error.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: message,
      confirmButtonColor: '#d33'
    });
  }

  submitBtn.disabled = false;
  submitBtn.innerText = "Create Account";
});

// Toggle password visibility
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.setAttribute("tabindex", "0"); // Accessibility
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const isHidden = input.getAttribute("type") === "password";
    input.setAttribute("type", isHidden ? "text" : "password");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});
