const RSS_FEED_URL = "https://status.deepseek.com/history.rss";
const API_KEY = ""; // Get from https://rss2json.com/

// Status indicators
const statusIndicators = {
  operational: "operational",
  degraded: "degraded",
  outage: "outage",
};

// DOM Elements
const lastCheckedElement = document.getElementById("last-checked");
const responseTimeElement = document.getElementById("response-time");
const incidentsElement = document.getElementById("incidents");

// Easter Egg Configuration
let isEggActive = false;
let lastTriggerTime = 0;
const EGG_DURATION = 4000; // 4 seconds
const EGG_COOLDOWN = 8000; // 8 seconds
let clickCount = 0;

// Helper function for loading states
const toggleLoading = (element, isLoading) => {
  isLoading
    ? element.classList.add("loading-pulse")
    : element.classList.remove("loading-pulse");
};

// Fetch and parse RSS feed
async function fetchStatus() {
  try {
    toggleLoading(lastCheckedElement, true);
    toggleLoading(responseTimeElement, true);
    toggleLoading(incidentsElement, true);

    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        RSS_FEED_URL
      )}&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "ok") {
      updateStatusUI(data.items);
    } else {
      throw new Error("Invalid data format received from the API");
    }
  } catch (error) {
    handleError(error);
  } finally {
    toggleLoading(lastCheckedElement, false);
    toggleLoading(responseTimeElement, false);
    toggleLoading(incidentsElement, false);
  }
}

// Update UI with status data
function updateStatusUI(incidents) {
  incidentsElement.innerHTML = "";
  let previousDate = null;

  incidents.forEach((incident) => {
    const currentDate = new Date(incident.pubDate).toLocaleDateString();
    const incidentElement = document.createElement("div");
    incidentElement.className = "incident-item";
    incidentElement.innerHTML = `
      <h3>${incident.title}</h3>
      <p>${currentDate}</p>
      <p>${incident.description}</p>
    `;
    incidentsElement.appendChild(incidentElement);
  });

  lastCheckedElement.textContent = new Date().toLocaleTimeString();
}

// Simulate status updates
function simulateStatusUpdates() {
  toggleLoading(responseTimeElement, true);
  setTimeout(() => {
    responseTimeElement.textContent = `${Math.floor(
      Math.random() * 300 + 200
    )}ms`;
    toggleLoading(responseTimeElement, false);
  }, 800);
}

// Error handling
function handleError(error) {
  console.error("Error fetching status:", error);
  incidentsElement.innerHTML = `
    <div class="error-message">
      Unable to load status updates. Please try again later.
      <p><small>Error: ${error.message}</small></p>
    </div>
  `;
}

// Easter Egg Handler
document.addEventListener("click", () => {
  if (isEggActive || (Date.now() - lastTriggerTime) < EGG_COOLDOWN) return;
  
  clickCount++;
  clearTimeout(window.clickTimer);
  window.clickTimer = setTimeout(() => clickCount = 0, 1000);

  if (clickCount === 3) {
    triggerEasterEgg();
    clickCount = 0;
  }
});

function triggerEasterEgg() {
  isEggActive = true;
  lastTriggerTime = Date.now();
  
  const header = document.querySelector(".header");
  const existingMessage = header.querySelector(".easter-egg-message");
  if (existingMessage) existingMessage.remove();

  header.style.filter = "saturate(0.7)";
  header.style.animation = "rainbow 2s infinite";

  const message = document.createElement("div");
  message.className = "easter-egg-message";
  message.textContent = "🎉 You found the Easter egg! 🎉";
  header.appendChild(message);

  setTimeout(() => {
    message.style.opacity = "0";
    setTimeout(() => {
      header.style.filter = "";
      header.style.animation = "";
      message.remove();
      isEggActive = false;
    }, 1000);
  }, EGG_DURATION);

  // Optional: Add sound effect
  const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2210/2210-preview.mp3");
  audio.play();
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  setInterval(fetchStatus, 300000);
  setInterval(simulateStatusUpdates, 10000);
});
