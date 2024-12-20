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
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const currentUser = await getCurrentUser(user.uid);
    loadCards(currentUser);
  } else {
    loadCards(null);
  }
});

async function getCurrentUser(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().username;
  }
  return null;
}

async function loadCards(currentUser) {
  const querySnapshot = await getDocs(collection(db, "articles"));
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением карточек

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
        <div id="contstars" class="stars-container" style="position: absolute; top:615px; cursor:pointer;">${generateStars(
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

    const starsContainer = cardElement.querySelector("#contstars");
    starsContainer.innerHTML = generateStars(5, cardData.averageRating);
    attachStarEvents(starsContainer, currentUser, doc.id);

    cardsContainer.appendChild(cardElement);
  });
}

function generateStars(maxStars, averageRating) {
  let starsHtml = "";
  for (let i = 1; i <= maxStars; i++) {
    if (i <= averageRating) {
      starsHtml += '<span class="star" style="color: #f6fa00;">&#9733;</span>';
    } else {
      starsHtml += '<span class="star" style="color: #f6fa00;">&#9734;</span>';
    }
  }
  return starsHtml;
}

function attachStarEvents(starsContainer, currentUser, docId) {
  const stars = Array.from(starsContainer.children);

  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.innerHTML = i <= index ? "&#9733;" : "&#9734;";
        if (i <= index) s.style.color = "#f6fa00";
      });
    });

    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        const rating = s.dataset.rating || 0;
        s.innerHTML = i < rating ? "&#9733;" : "&#9734;";
        if (i < rating) s.style.color = "#f6fa00";
      });
    });

    star.addEventListener("click", async () => {
      if (currentUser && (await canRateArticle(docId, currentUser))) {
        const rating = index + 1;
        stars.forEach((s, i) => {
          if (i <= index) {
            s.innerHTML = "&#9733;";
            s.style.color = "#f6fa00";
          } else {
            s.innerHTML = "&#9734;";
          }
          s.dataset.rating = rating;
        });
        await updateRating(docId, currentUser, rating);
      } else {
        alert("Вы уже оценили эту статью или не вошли в систему.");
      }
    });
  });
}

async function canRateArticle(articleId, userId) {
  const articleDocRef = doc(db, "articles", articleId);
  const articleDoc = await getDoc(articleDocRef);

  if (articleDoc.exists()) {
    const articleData = articleDoc.data();
    return !articleData.ratedBy || !articleData.ratedBy.includes(userId);
  }
  return false;
}

async function updateRating(docId, userId, rating) {
  const docRef = doc(db, "articles", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const cardData = docSnap.data();
    const newRatingCount = cardData.ratingCount ? cardData.ratingCount + 1 : 1;
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
