console.log("hoiscript.js");

// HTML-Elemente holen
const lexikonBtn = document.querySelector("#lexikonBtn");
const closeLexikonBtn = document.querySelector("#closeLexikonBtn");
const lexikonOverlay = document.querySelector("#lexikonoverlay");
const chatbar = document.querySelector("#chatbar");
const sendBtn = document.querySelector("#sendBtn");
const answer = document.querySelector("#answer");
const asked_spell = document.querySelector("#asked_spell");
const suggestionsContainer = document.getElementById("suggestions");

let spells = []; // global speichern

// Spells von API laden
async function loadSpells() {
  const url = "https://hp-api.onrender.com/api/spells";
  try {
    const response = await fetch(url);
    spells = await response.json();
    console.log(spells); // Zeige alle Zauber in der Konsole
  } catch (error) {
    console.error("Fehler beim Laden der API:", error);
  }
}

// Spell finden und anzeigen
function findSpell(spellName) {
  const spell = spells.find(
    (s) => s.name.toLowerCase() === spellName.toLowerCase()
  );

  // Create and add the spell asked message
  const askedDiv = document.createElement("div");
  askedDiv.classList.add("user-message");
  askedDiv.innerText = spell ? spell.name : spellName;
  chatMessages.appendChild(askedDiv);

  // Create and add a placeholder answer message (for loading delay)
  const answerDiv = document.createElement("div");
  answerDiv.classList.add("bot-message");
  answerDiv.innerText = "...";
  chatMessages.appendChild(answerDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // After delay, update answer
  setTimeout(() => {
    if (spell) {
      answerDiv.innerText = spell.description;
    } else {
      answerDiv.innerHTML = `not found`;
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);
}

// Wenn Enter gedrückt wird
chatbar.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && chatbar.value.trim().length >= 1) {
    findSpell(chatbar.value.trim());
    chatbar.value = "";
  }
});

// Wenn Button geklickt wird
sendBtn.addEventListener("click", function () {
  if (chatbar.value.trim().length >= 1) {
    findSpell(chatbar.value.trim());
    chatbar.value = "";
  }
});

lexikonBtn.addEventListener("click", () => {
  lexikonOverlay.classList.add("open");
});

lexikonBtn.addEventListener("click", () => {
  lexikonOverlay.classList.add("open");
});

closeLexikonBtn.addEventListener("click", () => {
  lexikonOverlay.classList.remove("open");
});

function handleSpellClick(spellName) {
  findSpell(spellName);
  chatbar.value = "";
  lexikonOverlay.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const spellItems = document.querySelectorAll("#lexikonoverlay ul li");
  spellItems.forEach((item) => {
    item.addEventListener("click", () => {
      const spellName = item.textContent.trim();
      handleSpellClick(spellName);
    });
  });
});

chatbar.addEventListener("input", function () {
  const input = chatbar.value.toLowerCase();
  suggestionsContainer.innerHTML = "";

  if (input.length < 1) return;

  const matches = spells
    .filter((spell) => spell.name.toLowerCase().startsWith(input))
    .slice(0, 5); // Limit to 5 suggestions

  matches.forEach((spell) => {
    const suggestionDiv = document.createElement("div");
    suggestionDiv.textContent = spell.name;
    suggestionDiv.addEventListener("click", () => {
      suggestionsContainer.innerHTML = "";
      chatbar.value = "";
      findSpell(spell.name);
    });
    suggestionsContainer.appendChild(suggestionDiv);
  });
});

// Hide suggestions on blur
chatbar.addEventListener("blur", () => {
  setTimeout(() => (suggestionsContainer.innerHTML = ""), 100);
});
// Lade Zauber beim Start
loadSpells();
