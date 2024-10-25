const logo = document.getElementById("logo");

logo.addEventListener("click", function () {
  logo.style.transform = "rotateY(360deg)";
  setTimeout(() => {
    logo.style.transform = "rotateY(0deg)";
  }, 500);
});
window.addEventListener("load", function () {
  const loader = document.querySelector(".spinner");
  loader.style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
});

document.addEventListener("DOMContentLoaded", function () {
  const regBtn = document.getElementById("regbtn");
  const registrationForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");

  regBtn.addEventListener("click", function () {
    registrationForm.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  });

  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
      registrationForm.style.display = "none";
      loginForm.style.display = "none";
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    });
  });

  const switchBtns = document.querySelectorAll(".switchBtn");
  switchBtns.forEach(function (switchBtn) {
    switchBtn.addEventListener("click", function () {
      if (registrationForm.style.display === "flex") {
        registrationForm.style.display = "none";
        loginForm.style.display = "flex";
      } else {
        loginForm.style.display = "none";
        registrationForm.style.display = "flex";
      }
    });
  });
});

const logname = document.getElementById("loggedUserFName");
logname.addEventListener("click", () => {
  const logoutButton = document.getElementById("logout");
  if (logoutButton.style.display === "none") {
    logoutButton.style.display = "block";
  } else {
    logoutButton.style.display = "none";
  }
});
