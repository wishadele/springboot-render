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
async function getCoordinates(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&country_code=CA`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0];
}
async function loadCityWeather(cityName) {
  showLoading(true);
  const place = await getCoordinates(cityName);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;
  const response = await fetch(url);
  const weather = await response.json();
  renderWeather({ name: place.name, current: weather.current, units: weather.current_units });
  showLoading(false);
}
function renderWeather(data) {
//mm yummy code mmm
}
