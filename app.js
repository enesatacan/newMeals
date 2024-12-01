const app = document.querySelector(".app");
const container = document.querySelector(".container");
const ui = document.querySelector(".ui");
const search = document.querySelector(".search");
const inputBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".searchBtn");
const randomBtn = document.querySelector("#random");

const functionRandom = async () => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    if (!response.ok) {
      throw new Error("API isteği başarısız oldu");
    }
    const data = await response.json();
    console.log(data);
    let meal = data.meals[0].strMeal;
    console.log(meal);
    inputBox.value = meal;
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
};
const functionSearch = async () => {
  const userInput = inputBox.value.trim();
  if (userInput !== "") {
    console.log(userInput);
    inputBox.value = "";
    const uiElement = container.querySelector(".ui .main");
    const uiElement2 = container.querySelector(".ui .search");
    if (uiElement) {
      uiElement.remove();
      uiElement2.remove();
      ui.classList.add("newUi");
      await loading();
      await getMeal(userInput);
      setTimeout(() => {
        const spinnerElement = ui.querySelector(".spinner");
        if (spinnerElement) {
          spinnerElement.remove();
        }
      }, 2000);
    }
  } else {
    console.log("boş");
    const alertElement = `
    <p class="alert text-center text-danger fw-bolder mt-3">
          Please Enter a Valid Food Preference...
    </p>`;
    container.insertAdjacentHTML("beforeend", alertElement);
    setTimeout(() => {
      const alertElement = container.querySelector(".alert");
      if (alertElement) {
        alertElement.remove();
      }
    }, 1500);
  }
};
const getMeal = async (mealName) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );
    if (!response.ok) {
      throw new Error("API isteği başarısız oldu");
    }
    const data = await response.json();
    if (!data.meals) {
      const alertElement = `
       <div class="d-block py-5">
        <button onclick="anasayfa()" class="btn btn-light">Homepage</button>
      </div>
    <p class="alert text-center text-light fw-bolder mt-3">
      No Meals Found    
    </p>`;
      ui.insertAdjacentHTML("beforeend", alertElement);
      throw new Error("no meals found!");
    }
    const mealData = data.meals[0];
    const mealImg = mealData.strMealThumb;
    const mealCat = mealData.strCategory;
    const mealArea = mealData.strArea;
    const mealIns = mealData.strInstructions;

    const malzemeler = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        malzemeler.push(`${measure ? measure : ""} ${ingredient}`.trim());
      }
    }

    let choose = "malzemeler";
    const meal = `
      <div class="d-block py-5">
        <button onclick="anasayfa()" class="btn btn-light">Homepage</button>
        <button onclick="repeat()" class="btn btn-dark">
          <i class="fa-solid fa-repeat"></i>
        </button>
      </div>
      <div class="meal d-flex justify-content-center align-items-center">
        <div class="col-3">
          <img lazy src="${mealImg}" alt="${mealName}" class="meal-img">
        </div>
        <div class="col-3 justify-content-center align-items-center text-white">
          <h3 class="meal-name">${mealName}</h3>
          <p class="meal-category">Category: ${mealCat}</p>
          <p class="meal-area">Area: ${mealArea}</p>
          <button id="malzemeBtn" class="btn btn-warning">Ingredients <i class="fs-6 fa-solid fa-circle-info"></i> </button>
          <button id="tarifBtn" class="btn btn-warning">Description <i class="fs-6 fa-solid fa-book-open"></i> </button>
        </div>
      </div>
      <div id="mealDetail" class="d-block my-5 text-white">
            <span class="my-auto p-2">
              ${
                choose === "malzemeler"
                  ? malzemeler.map((m) => `<li>${m}</li>`).join("")
                  : mealIns
              }
            </span>
      </div>
    `;

    ui.innerHTML = meal;

    document.getElementById("malzemeBtn").addEventListener("click", () => {
      choose = "malzemeler";
      document.getElementById("mealDetail").innerHTML = `
      ${malzemeler.map((m) => `<li class="size-md">${m}</li>`).join("")}
      `;
    });

    document.getElementById("tarifBtn").addEventListener("click", () => {
      choose = "tarif";
      document.getElementById("mealDetail").innerHTML = `
      <div class="d-flex justify-content-center align-items-center text-center  my-5">
        <div class="col-7">
          <span class="p-2 size-md">
            ${mealIns}
          </span>
        </div>
      </div>
      `;
    });
  } catch (error) {
    console.error("Hata oluştu:", error.message);
  }
};
const loading = async () => {
  const spinner = `
    <div class="spinner text-white spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
  ui.insertAdjacentHTML("beforeend", spinner);

  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};
randomBtn.addEventListener("click", functionRandom);
searchBtn.addEventListener("click", functionSearch);

const defaultUI = ui.innerHTML;

const anasayfa = () => {
  ui.innerHTML = defaultUI;

  if (ui.classList.contains("newUi")) {
    ui.classList.remove("newUi");
  }
  console.log("anasayfa");
  document.querySelector("#random").addEventListener("click", async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      if (!response.ok) {
        throw new Error("API isteği başarısız oldu");
      }
      const data = await response.json();
      console.log(data);
      let meal = data.meals[0].strMeal;
      console.log(meal);
      document.querySelector(".search input").value = meal;
      inputBox.value = meal;
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  });
  document
    .querySelector(".searchBtn")
    .addEventListener("click", functionSearch);
};

const repeat = async () => {
  console.log("repeat");
  ui.innerHTML = "";
  await randomBtn.click();
  await loading();
  const mealName = inputBox.value;
  await getMeal(mealName);
};
const show = () => {
  console.log("show");
};
