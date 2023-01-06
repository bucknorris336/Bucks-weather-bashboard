var APIKey = "0c6426e6aac7f0e8adddb2e92d819eb4";
var city = "Durham";

var queryURL =
  `http://api.openweathermap.org/data/2.5/weather?q=` +
  city +
  "&appid=" +
  APIKey +
  "&units=imperial";

fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    getFiveDay(data.coord.lat, data.coord.lon);
    console.log(data);
  });
function getFiveDay(lat, lon) {
  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  fetch(queryURL2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

//https://api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
