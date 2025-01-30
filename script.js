// Configuration
const RSS_FEED_URL = "https://status.deepseek.com/history.rss";

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

    // Call YOUR secure endpoint instead of the external API
    const response = await fetch("/.netlify/functions/fetchStatus");

    // Check if the response is OK
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
    // Always remove loading states, even if there's an error
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
    if (previousDate && previousDate !== currentDate) {
      const divider = document.createElement("div");
      divider.className = "date-divider";
      divider.setAttribute("data-date", currentDate);
      incidentsElement.appendChild(divider);
    }
    previousDate = currentDate;

    const incidentElement = document.createElement("div");
    incidentElement.className = "incident-item";
    incidentElement.setAttribute("data-date", currentDate);
    incidentElement.innerHTML = `
      <h3>${incident.title}</h3>
      <p class="incident-date">📅 ${currentDate}</p>
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

// Easter Egg Configuration
let isEggActive = false;
let lastTriggerTime = 0;
const EGG_DURATION = 4000; // 4 seconds
const EGG_COOLDOWN = 8000; // 8 seconds
let clickCount = 0;

document.addEventListener("click", () => {
  if (isEggActive || Date.now() - lastTriggerTime < EGG_COOLDOWN) return;

  clickCount++;
  clearTimeout(window.clickTimer);
  window.clickTimer = setTimeout(() => (clickCount = 0), 1000);

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

  // Reduced saturation effect
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
    }, 1000); // Fade-out duration
  }, EGG_DURATION);

  // Play sound
  const audio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2210/2210-preview.mp3"
  );
  audio.play();
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  setInterval(fetchStatus, 300000); // Refresh every 5 minutes
  setInterval(simulateStatusUpdates, 10000); // Simulate updates every 10 seconds
});
