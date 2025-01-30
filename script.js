// Configuration
const RSS_FEED_URL = "https://status.deepseek.com/history.rss";
const API_KEY = ""; // Get from https://rss2json.com/

// Status indicators
const statusIndicators = {
  operational: "operational",
  degraded: "degraded",
  outage: "outage",
};

// Fetch and parse RSS feed
async function fetchStatus() {
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        RSS_FEED_URL
      )}&api_key=${API_KEY}`
    );
    const data = await response.json();

    if (data.status === "ok") {
      updateStatusUI(data.items);
    }
  } catch (error) {
    console.error("Error fetching status:", error);
    document.getElementById("incidents").innerHTML =
      "Unable to load status updates. Please try again later.";
  }
}

// Update UI with status data
function updateStatusUI(incidents) {
  const incidentsContainer = document.getElementById("incidents");
  incidentsContainer.innerHTML = "";

  incidents.forEach((incident) => {
    const incidentElement = document.createElement("div");
    incidentElement.className = "incident-item";
    incidentElement.innerHTML = `
            <h3>${incident.title}</h3>
            <p>${new Date(incident.pubDate).toLocaleDateString()}</p>
            <p>${incident.description}</p>
        `;
    incidentsContainer.appendChild(incidentElement);
  });

  // Update last checked time
  document.getElementById("last-checked").textContent =
    new Date().toLocaleTimeString();
}

// Simulate status updates
function simulateStatusUpdates() {
  document.getElementById("response-time").textContent = `${Math.floor(
    Math.random() * 300 + 200
  )}ms`;
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  setInterval(fetchStatus, 300000); // Refresh every 5 minutes
  setInterval(simulateStatusUpdates, 10000); // Update metrics every 10 seconds
});
