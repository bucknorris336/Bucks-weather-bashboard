$(function () {
  var APIKey = "0c6426e6aac7f0e8adddb2e92d819eb4";
  function createCard(date, temp, humidity, wind, index) {
    if (i != 0) {
      var card = `       
       <div class="card full-height">
        <h5 class="card-title">${date}</h5>
         <p class="card-text">temp: ${temp}</p>
         <p class="card-text">humidity: ${humidity}</p>
         <p class="card-text">wind: ${wind}</p>
        </div>`;

      $("#forecast").html(card);
    } else {
      var todaysWeather = `       <div class="todays-weather">
      <h2>${date}.</h2>
     <p>temp: ${temp}</p>
     <p>humidity: ${humidity}</p>
     <p>wind: ${wind}</p>
     </div>`;
      $("#forecast").html(todaysWeather);
    }
  }

  function mapData(weatherArray) {
    for (var i = 0; i < weatherArray.length; i++) {
      var day = weatherArray[i];
      var date = day.name + " (" + new Date().toLocaleDateString();
      var temp = day.main.temp;
      var humidity = day.main.humidity;
      var windSpeed = day.wind.speed;
      createCard(date, temp, humidity, windSpeed, i);
      // console.log(day);
    }
  }

  function getFiveDay(lat, lon) {
    var queryURL2 =
      "https://api.openweathermap.org/day/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&cnt=6&appid=" +
      APIKey;
    fetch(queryURL2)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        mapData(data.list);
      });
  }

  function handleSubmit(value) {
    console.log("value=", value);
    var queryURL =
      `http://api.openweathermap.org/data/2.5/weather?q=` +
      value +
      "&appid=" +
      APIKey +
      "&units=imperial";
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        getFiveDay(data.coord.lat, data.coord.lon);
      });
  }

  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    var inputValue = event.target.form[0].value;
    handleSubmit(inputValue);
  });
  //https://api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
});
