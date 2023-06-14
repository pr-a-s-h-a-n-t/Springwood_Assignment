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
        throw new Error("Please enter a valid location.");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
      console.log(data);
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
    date,
    minTemp,
    maxTemp,
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
        <h3>${date}</h3>
        <h4>${main}</h4>
      </div>
      <h6>${description}</h6>
      <p>Temperature: Min ${minTemp}${temperatureUnit}, Max ${maxTemp}${temperatureUnit}</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} mph</p>
    `;

    return weatherElement;
  };

  var forecastData = {};

  // Group forecast data by date
  data.list.forEach((forecast) => {
    var forecastDate = new Date(forecast.dt_txt).toDateString();

    if (!forecastData[forecastDate]) {
      forecastData[forecastDate] = {
        date: forecastDate,
        minTemp: Number(forecast.main.temp_min - 273.15).toFixed(1),
        maxTemp: Number(forecast.main.temp_max - 273.15).toFixed(1),
        description: forecast.weather[0].description,
        humidity: forecast.main.humidity,
        windSpeed: forecast.wind.speed,
        icon: forecast.weather[0].icon,
        main: forecast.weather[0].main,
      };
    }
  });

  // Get city name from API response
  var cityName = data.city.name;

  // Create container for current weather
  var currentWeatherContainer = document.createElement("div");
  currentWeatherContainer.classList.add("current-weather-container");

  // Create heading tag for current weather
  var currentWeatherHeading = document.createElement("h2");
  currentWeatherHeading.textContent = "Current Weather in " + cityName;

  currentWeatherContainer.appendChild(currentWeatherHeading);

  // Create current weather card
  var currentWeather = data.list[0];
  var currentWeatherItem = createWeatherItem(
    "Today",
    Number(currentWeather.main.temp_min - 273.15).toFixed(1),
    Number(currentWeather.main.temp_max - 273.15).toFixed(1),
    currentWeather.weather[0].description,
    currentWeather.main.humidity,
    currentWeather.wind.speed,
    currentWeather.weather[0].icon,
    currentWeather.weather[0].main
  );

  currentWeatherContainer.appendChild(currentWeatherItem);

  // Append current weather container to the main weather display container
  weatherDisplay.appendChild(currentWeatherContainer);

  // Create container for forecasted weather cards
  var forecastContainer = document.createElement("div");
  forecastContainer.classList.add("forecast-container");

  // Create heading tag for forecasted weather
  var forecastHeading = document.createElement("h2");
  forecastHeading.textContent = "Next 5-Days Forecast";

  forecastContainer.appendChild(forecastHeading);

  // Create forecast cards for the next 5 days
  var forecastDates = Object.keys(forecastData).slice(1, 6); // Exclude the current day
  forecastDates.forEach((date) => {
    var forecast = forecastData[date];
    var forecastItem = createWeatherItem(
      forecast.date,
      forecast.minTemp,
      forecast.maxTemp,
      forecast.description,
      forecast.humidity,
      forecast.windSpeed,
      forecast.icon,
      forecast.main
    );

    forecastContainer.appendChild(forecastItem);
  });

  // Append forecast container to the main weather display container
  weatherDisplay.appendChild(forecastContainer);
}

function showError(message) {
  var errorElement = document.createElement("p");
  errorElement.classList.add("error-message");
  errorElement.textContent = message;

  var weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = "";
  weatherDisplay.appendChild(errorElement);
}
