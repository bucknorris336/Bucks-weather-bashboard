var searchInput = document.querySelector(".search-input");
var searchForm = document.querySelector("#search-form");
var todayContainer = document.querySelector("#weather-container");
var forecastContainer = document.querySelector("#forecast");
var searchHistoryContainer = document.querySelector("#history");
var searchHistory = [];
var APIKey = "0c6426e6aac7f0e8adddb2e92d819eb4";

function handleSearchFormSubmit(event) {
  event.preventDefault();
  var search = searchInput.value.trim();

  //fetch coords from search-city
  fetchCoords(search);
  searchInput.value = "";
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches(".btn-history")) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute("data-search");
  fetchCoords(search);
}

// Function to display the search history list.
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = "";

  // Start at end of history array and count down to show the most
  //recent at the top.
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-controls", "today forecast");
    btn.classList.add("history-btn", "btn-history");

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // If there is no search term return the function
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);

  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  var storedHistory = localStorage.getItem("search-history");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}
// Function to get the coordanents of the city searched 
function fetchCoords(searchCity) {
  var queryURL =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    searchCity +
    "&appid=" +
    APIKey +
    "&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      fetchWeather(data.coord, data.name);
      appendToHistory(data.name);
    });
}
function fetchWeather(location, name) {
  var { lat } = location;
  var { lon } = location;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  fetch(queryURL2)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("newData", data);
      renderCurrentWeather(data.list, data.city.name);
      renderForecast(data.list, data.city.name);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// Function to display the current weather data fetched from OpenWeather api.
function renderCurrentWeather(weather, city) {
  var date = dayjs().format("M/D/YYYY");
  //Store response data from our fetch request in variables
  var tempF = weather[0].main.temp;
  var windMph = weather[0].wind.speed;
  var humidity = weather[0].main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather[0].weather[0].icon}.png`;
  var iconDescription = weather[0].weather[0].description || weather[0].main;
  console.log("weather", weather, tempF);

  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var heading = document.createElement("h2");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  card.append(cardBody);

  heading.setAttribute("class", "h3 card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  weatherIcon.setAttribute("class", "weather-img");
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, tempEl, windEl, humidityEl);

  todayContainer.innerHTML = "";
  todayContainer.append(card);
}
// Function to display a forecast card given an object from open weather api
// daily forecast.
function renderForecastCard(forecast, city) {
  // variables for data from api
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windMph = forecast.wind.speed;

  // Create elements for a card
  var col = document.createElement("div");
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var cardTitle = document.createElement("h5");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute("class", "col-md");
  col.classList.add("five-day-card");
  card.setAttribute("class", "card bg-primary h-100 text-white");
  cardBody.setAttribute("class", "card-body p-2");
  cardTitle.setAttribute("class", "card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");

  // Add content to elements
  cardTitle.textContent = `${city} (${dayjs(forecast.dt_txt).format(
    "M/D/YYYY"
  )})`;
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(col);
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast, city) {
  // Create unix timestamps for start and end of 5 day forecast
  var startDt = dayjs().add(1, "day").startOf("day").unix();
  var endDt = dayjs().add(6, "day").startOf("day").unix();

  // var headingCol = document.createElement("div");
  // var heading = document.createElement("h4");

  // headingCol.setAttribute("class", "col-12");
  // heading.textContent = "5-Day Forecast:";
  // headingCol.append(heading);

  forecastContainer.innerHTML = "";
  // forecastContainer.append(headingCol);
  for (var i = 0; i < dailyForecast.length; i++) {
    // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      // Then filters through the data and returns only data captured at noon for each day.
      if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        renderForecastCard(dailyForecast[i], city);
      }
    }
  }
}

initSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit);
searchHistoryContainer.addEventListener("click", handleSearchHistoryClick);
