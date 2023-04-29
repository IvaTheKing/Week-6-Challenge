const apiKey = 'f7a371cdc2ff75085b5079065e50338c';

const searchForm = document.querySelector('#city-input');
const searchHistory = document.querySelector('#search-list');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#future-weather');

let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];


async function getCurrentWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}


async function getForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}


function displayCurrentWeather(data) {
  const city = data.name;
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  const temperature = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  currentWeather.innerHTML = `
    <h2>${city} (${date}) <img src="${icon}" alt="${data.weather[0].description}"></h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;
}


function displayForecast(data) {
  let forecastHTML = '';
  data.list.forEach((item, index) => {
    if (index % 8 === 0) { 
      const date = new Date(item.dt * 1000).toLocaleDateString();
      const icon = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
      const temperature = Math.round(item.main.temp);
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;

      forecastHTML += `
        <div>
          <p>${date}</p>
          <img src="${icon}" alt="${item.weather[0].description}">
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
      `;
    }
  });
  forecast.innerHTML = forecastHTML;
}


function displaySearchHistory() {
  let searchHistoryHTML = '';
  searchHistoryList.forEach((item) => {
    searchHistoryHTML += `<li>${item}</li>`;
  });
  searchHistory.innerHTML = searchHistoryHTML;
}


searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (!city) {
    return;
  }
  const currentWeatherData = await getCurrentWeather(city);
  if (currentWeatherData.cod === '404') {
    alert('City not found!');
    return;
  }
  const forecastData = await getForecast(city);
  searchHistoryList.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));
  displaySearchHistory();
  displayCurrentWeather(currentWeatherData);
  displayForecast(forecastData);
  });
  
  
  searchHistory.addEventListener('click', async (event) => {
  const city = event.target.textContent;
  const currentWeatherData = await getCurrentWeather(city);
  const forecastData = await getForecast(city);
  displayCurrentWeather(currentWeatherData);
  displayForecast(forecastData);
  });
  
 
  displaySearchHistory();
