// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config (same as your register.js)
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
const db = getFirestore(app);

// Load users from Firestore
async function loadUsers() {
  const tableBody = document.getElementById("usersTableBody");

  try {
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.fullName || ""}</td>
        <td>${data.email || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${data.businessName || ""}</td>
        <td>${data.businessCategory || ""}</td>
        <td>${data.state || ""}</td>
        <td>${new Date(data.createdAt).toLocaleDateString()}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }
}

loadUsers();

async function exportUsersToCSV() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];
  querySnapshot.forEach(doc => users.push(doc.data()));

  let csv = "Full Name,Email,Phone,Business Name,Business Type,Business Category,Business Address,City,State\n";
  users.forEach(u => {
    csv += `${u.fullName},${u.email},${u.phone},${u.businessName},${u.businessType},${u.businessCategory},${u.businessAddress},${u.city},${u.state}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users.csv";
  link.click();
}

async function deleteUser(uid) {
  if (confirm("Are you sure you want to delete this user?")) {
    await deleteDoc(doc(db, "users", uid));
    alert("User deleted");
  }
}