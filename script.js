const apikeyInput = document.getElementById("apikey");
const tetelInput = document.getElementById("tetel");
const generateBtn = document.getElementById("generate");
const cardsDiv = document.getElementById("cards");
const tantargySelect = document.getElementById("tantargy");
const modeToggle = document.getElementById("modeToggle");

let lightMode = false;

modeToggle.addEventListener("click", () => {
  lightMode = !lightMode;
  document.body.classList.toggle("light", lightMode);
});

generateBtn.addEventListener("click", async () => {
  const apikey = apikeyInput.value.trim();
  const tetel = tetelInput.value.trim();
  const tantargy = tantargySelect.value;

  if (!apikey || !tetel) {
    alert("Add meg az API-kulcsot és a tételt!");
    return;
  }

  const prompt = `Kérlek, készíts tanulókártyákat az alábbi érettségi tételből "${tantargy}" tantárgyhoz. Minden kártya egy kérdés-válasz páros legyen.

${tetel}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "Nem sikerült a generálás.";

  const lines = text.split("\n").filter(l => l.trim() !== "");
  cardsDiv.innerHTML = "";

  lines.forEach((line) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = line;
    card.onclick = () => {
      card.classList.toggle("flipped");
      card.textContent = card.textContent.includes("Kérdés:")
        ? card.textContent.replace("Kérdés:", "Válasz:")
        : card.textContent.replace("Válasz:", "Kérdés:");
    };
    cardsDiv.appendChild(card);
  });
});
