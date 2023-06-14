function getWeather() {
  var locationInput = document.getElementById("locationInput");
  var location = locationInput.value.trim();

  if (!location) {
    showError("Please enter a location");
    return;
  }

  // Check if the location is a valid city name or pincode
  var isValidLocation = /^[a-zA-Z\s\d]+$/.test(location);

  if (!isValidLocation) {
    showError("Invalid location. Please enter a valid city or pincode.");
    return;
  }

  var apiKey = "a5d35c53a7af4610a850facef6f9f3ad";
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Please enter a valid location..");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      showError(error.message);
    });
}

function displayWeather(data) {
  var weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = "";

  var unitSwitch = document.getElementById("unitSelect");
  var temperatureUnit = unitSwitch.value;

  var createWeatherItem = (
    title,
    date,
    temperature,
    description,
    humidity,
    windSpeed,
    icon,
    main
  ) => {
    var weatherElement = document.createElement("div");
    weatherElement.classList.add("weather-item");

    var iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    weatherElement.innerHTML = `
    <img src="${iconUrl}" alt="Weather Icon" />
    <div class="weather-item__title">
      <h2>${title}</h2>
      <h3>${main}</h3>
    </div>
    <h6>${description}</h6>
    <p>Date: ${date}</p>
    <p>Temperature: ${temperature}${temperatureUnit}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} mph</p>
    `;

    return weatherElement;
  };

  var currentTemperature = data.list[0].main.temp;
  var currentDescription = data.list[0].weather[0].description;
  var currentHumidity = data.list[0].main.humidity;
  var currentWindSpeed = data.list[0].wind.speed;
  var currentWeatherIconCode = data.list[0].weather[0].icon;
  var currentWeatherMain = data.list[0].weather[0].main;
  var forecastDate = new Date(data.list[0].dt_txt).toDateString();

  var currentWeatherInfo = createWeatherItem(
    "Current Weather",
    forecastDate,
    convertTemperature(currentTemperature),
    currentDescription,
    currentHumidity,
    currentWindSpeed,
    currentWeatherIconCode,
    currentWeatherMain
  );

  weatherDisplay.appendChild(currentWeatherInfo);

  var forecastList = data.list.slice(0, 5);

  var forecastInfo = document.createElement("div");
  forecastInfo.classList.add("forecast-container");
  forecastInfo.innerHTML = "<h2>5-Day Forecast</h2>";

  forecastList.forEach((forecast) => {
    var forecastDate = new Date(forecast.dt_txt).toDateString();
    var forecastTemperature = forecast.main.temp;
    var forecastDescription = forecast.weather[0].description;
    var forecastHumidity = forecast.main.humidity;
    var forecastWindSpeed = forecast.wind.speed;
    var forecastWeatherIconCode = forecast.weather[0].icon;
    var forecastWeatherMain = forecast.weather[0].main;

    var forecastItem = createWeatherItem(
      forecastDate,
      forecastDate,
      convertTemperature(forecastTemperature),
      forecastDescription,
      forecastHumidity,
      forecastWindSpeed,
      forecastWeatherIconCode,
      forecastWeatherMain
    );

    forecastInfo.appendChild(forecastItem);
  });

  weatherDisplay.appendChild(forecastInfo);
}

function convertTemperature(temp) {
  var unitSwitch = document.getElementById("unitSelect");
  var isCelsius = unitSwitch.value === "C";

  if (isCelsius) {
    return Math.round(temp - 273.15);
  } else {
    return Math.round(((temp - 273.15) * 9) / 5 + 32);
  }
}

function showError(message) {
  var errorElement = document.createElement("p");
  errorElement.classList.add("error-message");
  errorElement.textContent = message;

  var weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = "";
  weatherDisplay.appendChild(errorElement);
}
