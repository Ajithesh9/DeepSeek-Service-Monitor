// Configuration
const RSS_FEED_URL = "https://status.deepseek.com/history.rss";
const API_KEY = ""; // Get from https://rss2json.com/

// Status indicators
const statusIndicators = {
@@ -8,93 +9,57 @@ const statusIndicators = {
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
    const response = await fetch("/api/fetchStatus");
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        RSS_FEED_URL
      )}&api_key=${API_KEY}`
    );
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
    console.error("Error fetching status:", error);
    document.getElementById("incidents").innerHTML =
      "Unable to load status updates. Please try again later.";
  }
}

// Update UI with status data
function updateStatusUI(incidents) {
  incidentsElement.innerHTML = "";
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
    incidentsElement.appendChild(incidentElement);
            <h3>${incident.title}</h3>
            <p>${new Date(incident.pubDate).toLocaleDateString()}</p>
            <p>${incident.description}</p>
        `;
    incidentsContainer.appendChild(incidentElement);
  });

  lastCheckedElement.textContent = new Date().toLocaleTimeString();
  // Update last checked time
  document.getElementById("last-checked").textContent =
    new Date().toLocaleTimeString();
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
  document.getElementById("response-time").textContent = `${Math.floor(
    Math.random() * 300 + 200
  )}ms`;
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  setInterval(fetchStatus, 300000); // Refresh every 5 minutes
  setInterval(simulateStatusUpdates, 10000); // Simulate updates every 10 seconds
  setInterval(simulateStatusUpdates, 10000); // Update metrics every 10 seconds
});
