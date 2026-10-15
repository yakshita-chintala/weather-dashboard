const elements = {
  time: document.querySelector("#local-time"),
  temperature: document.querySelector("#temperature"),
  icon: document.querySelector("#weather-icon"),
  description: document.querySelector("#description"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind"),
  rain: document.querySelector("#rain"),
  status: document.querySelector("#weather-status"),
};

function updateClock() {
  elements.time.textContent = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function describeWeather(code, isDay) {
  if (code === 0) return ["Clear", isDay ? "☀️" : "🌙"];
  if (code <= 2) return ["Partly cloudy", isDay ? "⛅" : "☁️"];
  if (code === 3) return ["Overcast", "☁️"];
  if (code <= 48) return ["Foggy", "🌫️"];
  if (code <= 67 || (code >= 80 && code <= 82)) return ["Rain", "🌧️"];
  if (code <= 77) return ["Snow", "🌨️"];
  if (code >= 95) return ["Thunderstorm", "⛈️"];
  return ["Cloudy", "☁️"];
}

async function loadWeather() {
  elements.status.textContent = "Loading current weather…";

  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,is_day&temperature_unit=celsius&wind_speed_unit=kmh"
    );
    if (!response.ok) {
      throw new Error(`Weather request failed (${response.status}).`);
    }

    const { current } = await response.json();
    if (!current) {
      throw new Error("Weather data was missing from the response.");
    }

    const [description, icon] = describeWeather(
      current.weather_code,
      current.is_day
    );
    elements.temperature.textContent = `${Math.round(current.temperature_2m)}°`;
    elements.icon.textContent = icon;
    elements.description.textContent = description;
    elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    elements.rain.textContent = `${current.precipitation} mm`;
    elements.status.textContent = "";
  } catch (error) {
    elements.status.textContent =
      "Could not load live weather. Check your connection and try again.";
    console.error("Unable to load weather data:", error);
  }
}

updateClock();
setInterval(updateClock, 60_000);
loadWeather();
setInterval(loadWeather, 15 * 60_000);