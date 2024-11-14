import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
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
const db = getFirestore();
let isEditing = false;

document.addEventListener("DOMContentLoaded", function () {
  var targetElements = document.querySelectorAll("[id^='info']");
  targetElements.forEach(function (targetElement) {
    targetElement.classList.add("editable");

    targetElement.addEventListener("click", function (event) {
      if (event.target.id === "editTextBtn") {
        if (targetElement.contentEditable === "true") {
          disableEditing(targetElement);
        } else {
          enableEditing(targetElement);
        }
      }

      if (event.target.id === "saveTextBtn") {
        saveText(targetElement);
      }
    });
  });
});

function enableEditing(element) {
  alert("Редактирование включено");
  element.contentEditable = true;
  isEditing = true;
}

function disableEditing(element) {
  alert("Редактирование выключено");
  element.contentEditable = false;
  isEditing = false;
}

async function saveText(element) {
  var info = element;
  if (info) {
    const planetName = info.dataset.collection;
    const planetNameLower = planetName.toLowerCase();
    const collectionName = "planets";
    let docName;
    switch (planetNameLower) {
      case "earthinfo":
        docName = "Earth";
        break;
      case "marsinfo":
        docName = "Mars";
        break;
      case "mooninfo":
        docName = "Moon";
        break;
      case "venusinfo":
        docName = "Venus";
        break;
      case "mercuryinfo":
        docName = "Mercury";
        break;
      case "jupiterinfo":
        docName = "Jupiter";
        break;
      case "saturninfo":
        docName = "Saturn";
        break;
      case "uranusinfo":
        docName = "Uranus";
        break;
      case "neptuneinfo":
        docName = "Neptune";
        break;
      case "suninfo":
        docName = "Sun";
        break;
      default:
        console.error("Некорректное имя документа.");
        alert("Некорректное имя документа.");
        return;
    }
    const infoCollection = collection(db, collectionName);
    const docRef = doc(infoCollection, docName);
    const titles = [];
    const descriptions = [];
    const imageUrl = info.dataset.imageUrl;

    info.querySelectorAll("h1, h2").forEach((header) => {
      if (header.tagName === "H1") {
        titles.push(header.innerText);
      } else if (header.tagName === "H2") {
        const description = header.nextElementSibling.innerText;
        descriptions.push({
          title: header.innerText,
          description: description,
        });
      }
    });

    if (!imageUrl) {
      console.error("imageUrl is undefined for document: ", docName);
      alert("Не удалось сохранить: отсутствует imageUrl.");
      return;
    }

    setDoc(docRef, {
      [planetNameLower]: {
        titles: titles,
        descriptions: descriptions,
        imageUrl: imageUrl,
      },
      createdAt: new Date(),
    })
      .then(() => {
        console.log(`Данные успешно сохранены в документе ${docName}.`);
        alert(`Данные успешно сохранены в Firebase в документе ${docName}!`);
      })
      .catch((error) => {
        console.error("Ошибка при сохранении данных:", error);
        alert("Ошибка сохранения данных в Firebase.");
      });
  }
}

async function loadAllPlanetsData() {
  try {
    const planetsRef = collection(db, "planets");
    const snapshot = await getDocs(planetsRef);
    snapshot.docs.forEach((doc) => {
      const planet = doc.data();
      let info, name, imageUrl;

      if (planet.earthinfo) {
        info = planet.earthinfo;
        name = "earth";
        imageUrl = planet.imageUrl || planet.earthinfo.imageUrl;
      } else if (planet.marsinfo) {
        info = planet.marsinfo;
        name = "mars";
        imageUrl = planet.imageUrl || planet.marsinfo.imageUrl;
      } else if (planet.mercuryinfo) {
        info = planet.mercuryinfo;
        name = "mercury";
        imageUrl = planet.imageUrl || planet.mercuryinfo.imageUrl;
      } else if (planet.jupiterinfo) {
        info = planet.jupiterinfo;
        name = "jupiter";
        imageUrl = planet.imageUrl || planet.jupiterinfo.imageUrl;
      } else if (planet.saturninfo) {
        info = planet.saturninfo;
        name = "saturn";
        imageUrl = planet.imageUrl || planet.saturninfo.imageUrl;
      } else if (planet.uranusinfo) {
        info = planet.uranusinfo;
        name = "uranus";
        imageUrl = planet.imageUrl || planet.uranusinfo.imageUrl;
      } else if (planet.neptuneinfo) {
        info = planet.neptuneinfo;
        name = "neptune";
        imageUrl = planet.imageUrl || planet.neptuneinfo.imageUrl;
      } else if (planet.mooninfo) {
        info = planet.mooninfo;
        name = "moon";
        imageUrl = planet.imageUrl || planet.mooninfo.imageUrl;
      } else if (planet.suninfo) {
        info = planet.suninfo;
        name = "sun";
        imageUrl = planet.imageUrl || planet.suninfo.imageUrl;
      } else if (planet.venusinfo) {
        info = planet.venusinfo;
        name = "venus";
        imageUrl = planet.imageUrl || planet.venusinfo.imageUrl;
      } else {
        info = {
          titles: planet.titles,
          descriptions: planet.descriptions,
        };
        name = doc.id;
        imageUrl = planet.imageUrl;
      }

      if (info && info.titles && info.descriptions && imageUrl) {
        const infoId = "info" + name.toLowerCase();
        const element = document.getElementById(infoId);
        if (element) {
          const titlesHTML = info.titles
            .map(
              (title) => `
                      <h1 class="planet-title">${title}</h1>
                  `
            )
            .join("");
          const descriptionsHTML = info.descriptions
            .map(
              (desc) => `
                      <div>
                          <h2 class="planet-title2">${desc.title}</h2>
                          <p class="planet-description">${desc.description}</p>
                      </div>
                  `
            )
            .join("");
          element.innerHTML = `
                      <div class="planet-container">
                          ${titlesHTML}
                          <img src="${imageUrl}" alt="${name}" class="planet-image">
                          ${descriptionsHTML}
                          <button id="editTextBtn">&#9998;</button>
                          <button id="saveTextBtn">Сохранить</button>
                          <button id="closeinfo" onclick="hideInfo('${infoId}')">Закрыть</button>
                      </div>
                  `;
        } else {
          console.error("Element with ID " + infoId + " not found.");
        }
      } else {
        console.error(
          "Planet data is incomplete for document: ",
          doc.id,
          planet
        );
      }
    });
  } catch (error) {
    console.error("Error loading planets data: ", error);
  }
}

loadAllPlanetsData();
