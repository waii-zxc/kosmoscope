// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
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

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
      messageDiv.style.opacity = 0;
    }, 5000);
  } else {
    console.error("Element with id " + divId + " not found.");
  }
}

const signUp = document.getElementById("sumbitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const username = document.getElementById("fName").value;

  if (!email || !password || !username) {
    showMessage("Please fill in all fields", "signUpMessage");
    return;
  }
  function openLoginForm() {
    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm");

    registrationForm.style.display = "none";
    loginForm.style.display = "flex";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        username: username,
      };
      showMessage("Account Created Successfully", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "#";
          openLoginForm();
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email Adress Allredy Exists !!!", "signUpMessage");
      } else {
        showMessage("unable to create User", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("sumbitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please fill in all fields", "signInMessage");
    return;
  }
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("login is successfull", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      const regbtn = document.getElementById("regbtn");
      location.reload();
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Inccorect Email or Password", "signInMessage");
      } else {
        showMessage("Account is not Exist", "signInMessage");
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const loggedUserFName = document.getElementById("loggedUserFName");

  if (loggedInUserId) {
    loggedUserFName.style.opacity = "1";
  } else {
    loggedUserFName.style.opacity = "0";
  }

  const regbtn = document.getElementById("regbtn");
  if (loggedInUserId) {
    regbtn.style.display = "none";
  }
});
