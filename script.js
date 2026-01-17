// --- OnDemand API CONFIG ---
// NOTE: exposing real keys in frontend is okay for hackathon demo only.
// In production, call this through a backend.
const ONDEMAND_API_KEY = "HHmMbFemXENx1MEoRnq9RKpVRHsKnsUE";
const BOT_ID = "6969ecc90cac070971e52ae0";

// Call OnDemand HTTP API (curl => fetch)
async function callOnDemand(message) {
  const url = "https://api.on-demand.io/chat/v1/sessions/query";

  const body = {
    query: message,
    endpointId: "predefined-openai-gpt4.1-nano",
    responseMode: "sync",
    botId: BOT_ID,
    contextVariables: [
      { key: "source", value: "HackPS-frontend" }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ONDEMAND_API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error("OnDemand API error: " + res.status);
  }

  const data = await res.json();
  // data looks like: { message: "...", data: { answer: "...", ... } }

  const answer =
    data?.data?.answer ??
    data?.data?.statusLogs?.[data.data.statusLogs.length - 1]?.answer ??
    "No answer field in response.";

  return answer;
}

// --- SCROLL ANIMATION LOGIC ---
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      } else {
        entry.target.classList.remove("reveal-active");
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".reveal-left, .reveal-right")
  .forEach((el) => scrollObserver.observe(el));

// --- SIDEBAR TOGGLE ---
function toggleAgent() {
  document
    .getElementById("ai-agent-sidebar")
    .classList.toggle("translate-x-full");
}

// --- CHAT HANDLER (USES OnDemand) ---
async function sendMessage() {
  const input = document.getElementById("agent-input");
  const chat = document.getElementById("agent-chat");
  const text = input.value.trim();
  if (!text) return;

  // user bubble
  chat.innerHTML += `
    <div class="text-right text-xs bg-white/5 p-2 rounded-lg ml-8 mb-2">
      ${text}
    </div>`;
  chat.scrollTop = chat.scrollHeight;
  input.value = "";

  // temporary "thinking" bubble
  const thinkingId = "thinking-" + Date.now();
  chat.innerHTML += `
    <div id="${thinkingId}" class="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 text-gray-400 text-xs italic">
      HackPS agent is thinking...
    </div>`;
  chat.scrollTop = chat.scrollHeight;

  try {
    const reply = await callOnDemand(text);

    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) thinkingEl.remove();

    chat.innerHTML += `
      <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 text-gray-300 text-xs">
        ${reply}
      </div>`;
  } catch (e) {
    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) thinkingEl.remove();

    chat.innerHTML += `
      <div class="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-gray-300 text-xs">
        Error talking to HackPS agent: ${e.message}
      </div>`;
  }

  chat.scrollTop = chat.scrollHeight;
}

// --- ENTER KEY SUPPORT ---
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("agent-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
