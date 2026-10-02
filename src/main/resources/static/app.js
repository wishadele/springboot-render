const TOP_CITIES = ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton",
  "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Halifax"];

function buildCityList() {
  const list = document.getElementById("city-list");
  TOP_CITIES.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => loadCityWeather(city));
    list.appendChild(li);
  });
}

buildCityList();
function showLoading(isLoading) {
  document.getElementById("loading").hidden = !isLoading;
}

function showError(message) {
  const el = document.getElementById("error");
  el.textContent = message;
  el.hidden = !message;
}

async function loadCityWeather(cityName) {
  showError("");
  showLoading(true);
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&country_code=CA`
    );
    const geo = await geoRes.json();
    if (!geo.results || geo.results.length === 0) {
      throw new Error(`Couldn't find a city called "${cityName}".`);
    }
    const { latitude, longitude, name } = geo.results[0];

    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
    );
    if (!wxRes.ok) throw new Error("Weather service request failed.");
    const wx = await wxRes.json();

    renderWeather({ name, current: wx.current, units: wx.current_units });
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  } finally {
    showLoading(false);
  }
}

function handleViewCity() {
  const input = document.getElementById("city-input");
  const cityName = input.value.trim();
  if (cityName === "") {
    showError("Please type a city name.");
    return;
  }
  loadCityWeather(cityName);
}

document.getElementById("view-city-btn").addEventListener("click", handleViewCity);


document.getElementById("view-city-btn").addEventListener("click", handleViewCity);
function renderWeather(data) {
  document.getElementById("weather-city").textContent = "Weather in " + data.name;
  document.getElementById("weather-temp").textContent =
    "Temp: " + data.current.temperature_2m + data.units.temperature_2m;
  document.getElementById("weather-wind").textContent =
    "Wind: " + data.current.wind_speed_10m + " " + data.units.wind_speed_10m;
  document.getElementById("weather-extra").textContent =
    "Humidity: " + data.current.relative_humidity_2m + "%";
}