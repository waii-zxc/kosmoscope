import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
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

tinymce.init({
  selector: "#mytextarea",
  toolbar:
    "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor | outdent indent",
  plugins: "code image",
  width: 900,
});

document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title-input");
  const imageInput = document.getElementById("image-input");
  const previewContainer = document.getElementById("preview");
  const idDropdown = document.getElementById("id-dropdown");
  const deleteButton = document.getElementById("delete-button");

  async function loadIds() {
    const querySnapshot = await getDocs(collection(db, "articles"));
    querySnapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.id;
      idDropdown.appendChild(option);
    });
  }

  loadIds();

  async function loadDataById(docId) {
    const docRef = doc(db, "articles", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cardData = docSnap.data();
      titleInput.value = cardData.title;
      imageInput.value = cardData.image;
      tinymce.get("mytextarea").setContent(cardData.TextContent);

      const card = document.createElement("div");
      card.style.border = "1px solid white";
      card.style.padding = "20px";
      card.style.textAlign = "center";
      card.style.width = "500px";
      card.style.height = "700px";

      const previewTitle = document.createElement("h1");
      previewTitle.textContent = cardData.title;

      const previewImage = document.createElement("img");
      previewImage.src = cardData.image;
      previewImage.alt = "Изображение";
      previewImage.style.maxWidth = "100%";
      previewImage.style.height = "280px";

      const moreButton = document.createElement("button");
      moreButton.textContent = "Подробнее";
      moreButton.style.display = "block";
      moreButton.style.margin = "10px auto";
      moreButton.addEventListener("click", function () {
        alert("Переход к полной статье");
      });

      card.appendChild(previewTitle);
      card.appendChild(previewImage);
      card.appendChild(moreButton);

      previewContainer.innerHTML = "";
      previewContainer.appendChild(card);
    } else {
      console.error("Документ не найден");
    }
  }

  idDropdown.addEventListener("change", function () {
    const selectedId = idDropdown.value;
    if (selectedId) {
      loadDataById(selectedId);
    }
  });

  deleteButton.addEventListener("click", async function () {
    const selectedId = idDropdown.value;
    if (selectedId) {
      await deleteDoc(doc(db, "articles", selectedId));
      alert("Документ успешно удален");
      idDropdown.innerHTML = "<option>Выберите ID</option>";
      loadIds();
      previewContainer.innerHTML = "";
      tinymce.get("mytextarea").setContent("");
      titleInput.value = "";
      imageInput.value = "";
    } else {
      alert("Выберите ID для удаления");
    }
  });

  document.getElementById("show").addEventListener("click", function () {
    const cardData = {
      title: titleInput.value,
      image: imageInput.value,
      TextContent: tinymce.get("mytextarea").getContent(),
    };

    const card = document.createElement("div");
    card.style.border = "1px solid white";
    card.style.padding = "20px";
    card.style.textAlign = "center";
    card.style.width = "500px";
    card.style.height = "700px";

    const previewTitle = document.createElement("h1");
    previewTitle.textContent = cardData.title;

    const previewImage = document.createElement("img");
    previewImage.src = cardData.image;
    previewImage.alt = "Изображение";
    previewImage.style.maxWidth = "100%";
    previewImage.style.height = "280px";

    const moreButton = document.createElement("button");
    moreButton.textContent = "Подробнее";
    moreButton.style.display = "block";
    moreButton.style.margin = "10px auto";
    moreButton.addEventListener("click", function () {
      alert("Переход к полной статье");
    });

    card.appendChild(previewTitle);
    card.appendChild(previewImage);
    card.appendChild(moreButton);

    previewContainer.innerHTML = "";
    previewContainer.appendChild(card);
  });

  document
    .getElementById("get-editor-data")
    .addEventListener("click", function () {
      const editorContent = tinymce.get("mytextarea").getContent();

      const cardData = {
        title: titleInput.value,
        image: imageInput.value,
        TextContent: editorContent,
      };

      setDoc(doc(db, "articles", cardData.title), cardData)
        .then(() => {
          alert("Карта успешно сохранена с заголовком: " + cardData.title);
        })
        .catch((error) => {
          console.error("Ошибка при сохранении карты: ", error);
        });
    });
});
