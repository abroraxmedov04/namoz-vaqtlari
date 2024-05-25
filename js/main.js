const form = document.querySelector(".form");
const input = document.querySelector(".search-input");
const list = document.querySelector(".list");
const countryName = document.querySelector(".country-name");
const timesDate = document.querySelector(".times__time");
const countriesTimer = document.querySelector(".countries__time");
const selectOption = document.querySelector("#date__format-select");
const tableBody = document.querySelector(".table__body");
const table = document.querySelector(".fl-table");
const titleTop = document.querySelector(".weekly-time-title");

table.style.visibility = "hidden";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = capitalizeFirstLetter(input.value.trim());
  const selectOptionValue = selectOption.value;

  if (inputValue && selectOptionValue) {
    fetchData(inputValue, selectOptionValue);
  }

  input.value = "";
});

function renderTable(data, node) {
  node.innerHTML = "";

  data.forEach((element, i) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${++i}</td>
      <td>${element.weekday}</td>
      <td>${element.date}</td>
      <td>${element.times.tong_saharlik}</td>
      <td>${element.times.quyosh}</td>
      <td>${element.times.peshin}</td>
      <td>${element.times.asr}</td>
      <td>${element.times.shom_iftor}</td>
      <td>${element.times.hufton}</td>
    `;

    node.appendChild(row);
  });
}

async function fetchData(region, option) {
  try {
    let apiUrl;
    switch (option) {
      case "day":
        apiUrl = `https://islomapi.uz/api/present/day?region=${region}`;
        break;
      case "week":
        apiUrl = `https://islomapi.uz/api/present/week?region=${region}`;
        break;
      case "monthly":
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        apiUrl = `https://islomapi.uz/api/monthly?region=${region}&month=${month}`;
        break;
      default:
        throw new Error("Invalid option");
    }

    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch data: ${response.status}`);

    const data = await response.json();

    if (option === "day") {
      countryName.textContent = `«${data.region}»`;
      list.style.display = "block";
      list.style.display = "flex";
      tableBody.innerHTML = "";
      table.style.visibility = "hidden";
      titleTop.textContent = "";

      renderList(data.times, list);
    } else if (option === "week") {
      titleTop.textContent = "Haftalik";
      list.style.display = "none";
      table.style.visibility = "visible";

      countryName.textContent = `«${data[0].region}»`;
      renderTable(data, tableBody);
    } else if (option === "monthly") {
      list.style.display = "none";
      titleTop.textContent = "Oylik table";
      table.style.visibility = "visible";
      countryName.textContent = `«${data[0].region}»`;
      renderTable(data, tableBody);
    } else {
      table.style.visibility = "hidden";
    }
  } catch (error) {
    console.error(error.message);
  }
}

function renderList(times, node) {
  const dayNames = {
    tong_saharlik: "Tong 🌤",
    quyosh: "Quyosh ☀",
    peshin: "Peshin ☀",
    asr: "Asr 🌓",
    shom_iftor: "Shom 🌥",
    hufton: "Hufton 🌚",
  };

  const items = Object.keys(times)
    .map(
      (key) => `
    <li class="list__item">
      <p class="list__item-day">${dayNames[key] || key}</p>
      <time class="list__item-time">${times[key]}</time>
    </li>
  `
    )
    .join("");

  node.innerHTML = items;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertDate() {
  const months = {
    1: "Yanvar",
    2: "Fevral",
    3: "Mart",
    4: "Aprel",
    5: "May",
    6: "Iyun",
    7: "Iyul",
    8: "Avgust",
    9: "Sentabr",
    10: "Oktabr",
    11: "Noyabr",
    12: "Dekabr",
  };

  const weeks = {
    0: "Yakshanba",
    1: "Dushanba",
    2: "Seshanba",
    3: "Chorshanba",
    4: "Payshanba",
    5: "Juma",
    6: "Shanba",
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = months[currentDate.getMonth() + 1];
  const date = currentDate.getDate();
  const day = weeks[currentDate.getDay()];

  return `${year} yil ${date}-${month}, ${day}`;
}

function timer() {
  const date = new Date();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${hour}:${minute}:${second}`;
}

function updateClock() {
  countriesTimer.textContent = timer();
}

setInterval(updateClock, 1000);

fetchData("Toshkent", "day");
updateClock();
timesDate.textContent = convertDate();
