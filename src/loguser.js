// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbxtQo48q9wjb7nSbUQgxcFiXjtZ7YTdQ",
  authDomain: "walhalla-b4641.firebaseapp.com",
  projectId: "walhalla-b4641",
  storageBucket: "walhalla-b4641.appspot.com",
  messagingSenderId: "711545042049",
  appId: "1:711545042049:web:56e3969f7cf47e29438980",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (user) {
          checkUserRole(user);
        } else {
          hideEditButtons();
        }

        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText =
            userData.username;
        } else {
          console.log("No document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting element");
      });
  } else {
    hideEditButtons();
    console.log("Пользователь не вошел в систему");
  }
});

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.log("Error Signing out:", error);
    });
});

function checkUserRole(user) {
  if (user) {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);

    getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.role === "admin") {
            showEditButtons();
            showAddArticle();
          } else {
            console.log("У вас нет прав администратора.");
            hideEditButtons();
            hideAddArticle();
          }
        } else {
          console.log("Данные пользователя не найдены.");
          hideEditButtons();
          hideAddArticle();
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных пользователя:", error);
        hideEditButtons();
        hideAddArticle();
      });
  }
}

function showEditButtons() {
  const elements = document.querySelectorAll('[id^="info"]');
  elements.forEach((element) => {
    const editTextBtn = element.querySelector("#editTextBtn");
    const saveTextBtn = element.querySelector("#saveTextBtn");
    if (editTextBtn && saveTextBtn) {
      editTextBtn.style.display = "inline";
      saveTextBtn.style.display = "inline";
    }
  });
}

function hideEditButtons() {
  const elements = document.querySelectorAll('[id^="info"]');
  elements.forEach((element) => {
    const editTextBtn = element.querySelector("#editTextBtn");
    const saveTextBtn = element.querySelector("#saveTextBtn");
    if (editTextBtn && saveTextBtn) {
      editTextBtn.style.display = "none";
      saveTextBtn.style.display = "none";
    }
  });
}

function showAddArticle() {
  const addArticleLink = document.getElementById("addarticle");
  if (addArticleLink) {
    addArticleLink.style.display = "inline";
  }
}

function hideAddArticle() {
  const addArticleLink = document.getElementById("addarticle");
  if (addArticleLink) {
    addArticleLink.style.display = "none";
  }
}
