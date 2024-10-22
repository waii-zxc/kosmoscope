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
