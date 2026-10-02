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