const input = document.querySelector('#city-input');
const button = document.querySelector('#get-weather-btn');
const weatherInfo = document.querySelector('.weather-info');
const result = weatherInfo.querySelectorAll('p');

async function getWeather() {
  const city = input.value.trim();

  if (!city) {
    alert('Введите название города');
    return;
  }

  button.disabled = true;
  button.textContent = 'Загрузка...';

  try {
    const cityResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`
    );

    const cityData = await cityResponse.json();

    if (!cityData.results || cityData.results.length === 0) {
      throw new Error('Город не найден');
    }

    const foundCity = cityData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${foundCity.latitude}&longitude=${foundCity.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`
    );

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    result[0].textContent =
      `Температура: ${current.temperature_2m} °C`;

    result[1].textContent =
      `Влажность: ${current.relative_humidity_2m}%`;

    result[2].textContent =
      `Скорость ветра: ${current.wind_speed_10m} км/ч`;

    result[3].textContent =
      `Погода на данный момент: ${current.weather_code}`;


    input.value = foundCity.name;
  } catch (error) {
    result[0].textContent = 'Не удалось получить данные';
    result[1].textContent = '';
    result[2].textContent = '';
    result[3].textContent = '';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Получить погоду';
  }
}

button.addEventListener('click', getWeather);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getWeather();
  }
});