// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import EmailJS
import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";

// Initialize Firebase
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
const db = getFirestore(app);

// Initialize EmailJS with your Public Key
emailjs.init("9gPg8Xl984_ESnJe7");

// Send welcome email function
async function sendWelcomeEmail(fullName, email) {
  try {
    const result = await emailjs.send("buga_contact_service", "buga_welcome_email", {
      fullName: fullName,
      email: email,
    });
    console.log("✅ Welcome email sent!", result.status);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
}

// Show success popup toast
function showSuccessToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#4BB543";
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.fontSize = "16px";
  toast.style.fontWeight = "bold";
  toast.style.transition = "opacity 0.5s ease";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// Form submission handler
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
    alert("❌ Passwords do not match");
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Store user data in Firestore
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
      createdAt: serverTimestamp(),
    });

    // Send welcome email
    await sendWelcomeEmail(fullName, email);

    // Show popup
    showSuccessToast("🎉 Account Created Successfully!");

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } catch (error) {
    console.error(error);
    alert("❌ Error: " + error.message);
  }
});

// Toggle password visibility
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
