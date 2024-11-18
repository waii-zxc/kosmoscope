import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
const db = getFirestore(app);

window.onload = function () {
  const currentUser = "user123"; // Здесь должен быть идентификатор текущего пользователя из системы аутентификации

  async function loadCards() {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const cardsContainer = document.getElementById("cards-container");

    querySnapshot.forEach((doc) => {
      const cardData = doc.data();
      const cardElement = document.createElement("div");
      cardElement.classList.add("card-container");
      cardElement.setAttribute("data-id", doc.id);
      cardElement.setAttribute("data-title", cardData.title.toLowerCase());
      cardElement.innerHTML = `
        <div class="cardcard" style="border: 1px solid white; padding: 20px; text-align: center; width: 500px; height: 600px; margin: 25px auto; position: relative;">
          <h1>${cardData.title}</h1>
          <img src="${
            cardData.image
          }" alt="Изображение" style="max-width: 100%; height: 280px; position: absolute;">
          <button class="more-button" style="display: block; margin: 10px auto; position: absolute;"><span>Подробнее</span></button>
          <div id="contstars" class="stars-container" style="position: absolute; top:650px; cursor:pointer; display:none;">${generateStars(
            5,
            cardData.averageRating
          )}</div>
        </div>
      `;

      const moreButton = cardElement.querySelector(".more-button");
      if (moreButton) {
        const docId = doc.id;
        moreButton.addEventListener("click", () => {
          window.location.href = `article_xxx.html?id=${docId}`;
        });
      }

      // Добавляем обработчик кликов на звезды
      const starsContainer = cardElement.querySelector("#contstars");
      starsContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("star")) {
          if (await canRateArticle(doc.id, currentUser)) {
            const clickedStar = event.target;
            const stars = Array.from(starsContainer.children);
            const clickedIndex = stars.indexOf(clickedStar);
            const rating = clickedIndex + 1;

            stars.forEach((star, index) => {
              if (index <= clickedIndex) {
                star.innerHTML = "&#9733;"; // Заполненная звезда
              } else {
                star.innerHTML = "&#9734;"; // Пустая звезда
              }
            });

            // Сохранение оценки в Firestore
            await updateRating(doc.id, currentUser, rating);
          } else {
            alert("Вы уже оценили эту статью.");
          }
        }
      });

      cardsContainer.appendChild(cardElement);
    });
  }

  async function canRateArticle(articleId, userId, userName) {
    const articleDocRef = doc(db, "articles", articleId);
    const articleDoc = await getDoc(articleDocRef);

    if (articleDoc.exists()) {
      const articleData = articleDoc.data();

      if (!articleData.ratedBy) {
        return true; // Пользователь еще не оценивал эту статью
      } else {
        // Проверяем, оценивал ли пользователь эту статью по имени и идентификатору
        const hasRated = articleData.ratedBy.some(
          (user) => user.id === userId && user.name === userName
        );
        return !hasRated;
      }
    }

    return false; // В случае ошибки или отсутствия документа
  }

  function generateStars(maxStars, averageRating) {
    let starsHtml = "";
    for (let i = 1; i <= maxStars; i++) {
      if (i <= averageRating) {
        starsHtml += '<span class="star">&#9733;</span>'; // Заполненная звезда
      } else {
        starsHtml += '<span class="star">&#9734;</span>'; // Пустая звезда
      }
    }
    return starsHtml;
  }

  async function updateRating(docId, userId, rating) {
    const docRef = doc(db, "articles", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cardData = docSnap.data();
      const newRatingCount = cardData.ratingCount
        ? cardData.ratingCount + 1
        : 1;
      const newTotalRating =
        (cardData.totalRating ? cardData.totalRating : 0) + rating;
      const newAverageRating = newTotalRating / newRatingCount;

      await updateDoc(docRef, {
        ratingCount: newRatingCount,
        totalRating: newTotalRating,
        averageRating: newAverageRating,
        ratedBy: arrayUnion(userId),
      });
    }
  }

  async function loadEditorContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get("id");
    if (!docId) {
      document.getElementById("content-container").textContent =
        "No card ID specified.";
      return;
    }

    const docRef = doc(db, "articles", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cardData = docSnap.data();
      const contentContainer = document.getElementById("content-container");

      const titleElement = document.createElement("h1");
      titleElement.textContent = cardData.title;

      const imageElement = document.createElement("img");
      imageElement.src = cardData.image;
      imageElement.alt = "Изображение";
      imageElement.style.maxWidth = "100%";
      // imageElement.style.marginLeft = "-10px";
      imageElement.style.height = "auto";

      const textContent = document.createElement("div");
      textContent.innerHTML = cardData.TextContent;

      contentContainer.innerHTML = "";
      contentContainer.appendChild(titleElement);
      contentContainer.appendChild(imageElement);
      contentContainer.appendChild(textContent);
    } else {
      document.getElementById("content-container").textContent =
        "Content not found.";
    }
  }

  function searchCardById() {
    const searchInput = document
      .getElementById("search-input")
      .value.toLowerCase();
    const cardsContainer = document.getElementById("cards-container");
    const cards = cardsContainer.querySelectorAll(".card-container");

    if (searchInput === "") {
      cards.forEach((card) => {
        card.style.display = "block";
      });
      document.getElementById("search-result").textContent = "";
      return;
    }

    cards.forEach((card) => {
      const cardId = card.getAttribute("data-id").toLowerCase();
      const cardTitle = card.getAttribute("data-title");
      if (cardId.includes(searchInput) || cardTitle.includes(searchInput)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    const visibleCards = Array.from(cards).filter(
      (card) => card.style.display === "block"
    );
    if (visibleCards.length === 0) {
      document.getElementById("search-result").textContent =
        "Ничего не найдено ;(";
    } else {
      document.getElementById("search-result").textContent = "";
    }
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", searchCardById);
  }

  if (window.location.pathname.includes("article_xxx.html")) {
    loadEditorContent();
  }

  loadCards();
};
