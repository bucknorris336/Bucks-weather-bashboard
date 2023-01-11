var searchInput = document.querySelector(".search-input");
var searchForm = document.querySelector("#search-form");
var searchHistory = [];
var APIKey = "0c6426e6aac7f0e8adddb2e92d819eb4";

function handleSearchFormSubmit(event) {
  event.preventDefault();
  var search = searchInput.value.trim();
  console.log("input", event, search);
  //fetch coordenants from search-city
  fetchCoords(search);
}

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
      console.log(data);
      fetchWeather(data.coord);
    });

  function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var queryURL2 =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&cnt=6&appid=" +
      APIKey;
    fetch(queryURL2)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log("newData", data);
        renderItems(city, data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }
function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  // renderForecast(data.list);
}
  function renderCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  // Store response data from our fetch request in variables
  var tempF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');
  function renderCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  // Store response data from our fetch request in variables
  var tempF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');
  // var APIUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&lmit=5&appid=${APIKey}`;
  // fetch(APIUrl)
  //   .then(function (res) {
  //     return res.json();
  //   })
  //   .then(function (data) {
  //     if (!data[0]) {
  //       alert("Location not found");
  //     } else {
  //       //appendToHistory(search);
  //       fetchWeather(data[0]);
  //       console.log(data[0]);
  //     }
  //   })
  //   .catch(function (err) {
  //     console.error(err);
  //   });
}
function fetchWeather(location) {
  var { lat, lon } = location;
  console.log("data", lat, lon, location);
}

searchForm.addEventListener("submit", handleSearchFormSubmit);
