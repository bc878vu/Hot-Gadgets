// EXISTING CODE (UNCHANGED)
const container = document.getElementById("phones-container");
const input = document.getElementById("search-input");
const btn = document.getElementById("search-btn");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");
const showAllBtn = document.getElementById("show-all-btn");
const spinner = document.getElementById("spinner");

let allPhones = [];

// ENTER KEY SEARCH
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btn.click();
});

// LOAD DEFAULT
window.onload = () => {
  loadPhones("iphone");
};

// SEARCH
btn.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return alert("Enter phone name");
  loadPhones(value);
});

// FETCH
const loadPhones = async (text) => {
  container.innerHTML = "";
  spinner.classList.remove("hidden");

  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${text}`);
    const data = await res.json();

    allPhones = data.data;

    displayPhones(allPhones.slice(0, 6));

    if (allPhones.length > 6) {
      showAllBtn.classList.remove("hidden");
    } else {
      showAllBtn.classList.add("hidden");
    }

  } catch (err) {
    container.innerHTML = "<h3>Error loading data 😢</h3>";
  }

  spinner.classList.add("hidden");
};

// DISPLAY
const displayPhones = (phones) => {
  container.innerHTML = "";

  if (phones.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;">
        <h3>No phones found 😢</h3>
      </div>
    `;
    return;
  }

  phones.forEach(phone => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${phone.image}">
      <h3>${phone.phone_name}</h3>
      <p>${phone.brand}</p>
      <button onclick="showDetails('${phone.slug}')">Show Details</button>
    `;

    container.appendChild(div);
  });
};

// SHOW ALL
showAllBtn.addEventListener("click", () => {
  displayPhones(allPhones);
  showAllBtn.classList.add("hidden");
});

// DETAILS
const showDetails = async (id) => {
  modal.classList.remove("hidden");
  modalBody.innerHTML = "<p>Loading...</p>";

  const res = await fetch(`https://openapi.programming-hero.com/api/phone/${id}`);
  const data = await res.json();

  const phone = data.data;

  modalBody.innerHTML = `
    <img src="${phone.image}" style="width:120px;display:block;margin:auto;">
    <h2 style="text-align:center">${phone.name}</h2>
    <p><b>Brand:</b> ${phone.brand}</p>
    <p><b>Release:</b> ${phone.releaseDate || "N/A"}</p>
    <p><b>Chipset:</b> ${phone.mainFeatures?.chipSet || "N/A"}</p>
    <p><b>Display:</b> ${phone.mainFeatures?.displaySize || "N/A"}</p>
    <p><b>Memory:</b> ${phone.mainFeatures?.memory || "N/A"}</p>
  `;
};

// CLOSE MODAL
closeModal.onclick = () => modal.classList.add("hidden");

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

// LOGIN MODAL
document.querySelector(".login-btn").onclick = () => {
  document.getElementById("login-modal").classList.remove("hidden");
};

function closeLogin() {
  document.getElementById("login-modal").classList.add("hidden");
}

// NEW: LOGIN SYSTEM (LOCAL STORAGE)
function loginUser() {
  const user = document.getElementById("username").value;
  if (!user) return alert("Enter username");

  localStorage.setItem("user", user);
  alert("Login Successful ✅");
  closeLogin();
}

