let isCelsius = true;
let city = "";

function formatDate(myDate) {
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date = myDate.getDate();
  let hour = myDate.getHours();
  let minutes = myDate.getMinutes();
  let twoDigitMinutes = minutes.toString().padStart(2, "0");
  let month = allMonths[myDate.getMonth()];
  let day = weekDays[myDate.getDay()];

  return `${day}, ${month} ${date}, ${hour} : ${twoDigitMinutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let dateElement = document.querySelector("#current-date-time");
dateElement.innerHTML = formatDate(new Date());

function searchCityName(event) {
  event.preventDefault();
  let cityNameInput = document.querySelector("#new-city-input");

  city = cityNameInput.value;

  axios
    .get(`${apiUrl}?appId=${apiKey}&q=${city}&units=metric`)
    .then(showTemperature);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCityName);

let tempCurr = document.querySelector("#current-temp");

function changeCelToFar(event) {
  event.preventDefault();
  if (isCelsius) {
    let far = 1.8 * tempCurr.innerHTML + 32;
    tempCurr.innerHTML = far.toFixed();
    isCelsius = false;
  }
}

let farTemp = document.querySelector("#farengheit");
farTemp.addEventListener("click", changeCelToFar);

function changeFarToCelsius(event) {
  event.preventDefault();
  if (!isCelsius) {
    let cel = (tempCurr.innerHTML - 32) * 0.5556;
    tempCurr.innerHTML = cel.toFixed();
    isCelsius = true;
  }
}

let celTemp = document.querySelector("#celsius");
celTemp.addEventListener("click", changeFarToCelsius);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="card text-center">
          <div class="card-header bg-warning text-black">${formatDay(
            forecastDay.dt
          )}</div>
          <div class="card-body">
            <img
              class="current-weather-icon"
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              id="weather-icon"
            />
           <p class="card-text">${Math.round(forecastDay.temp.day)}°C</p>
          </div>
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let apiKey = "b7a1189e9feeae19225df090063776bd";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather";

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "b7a1189e9feeae19225df090063776bd";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let tempData = Math.round(response.data.main.temp);
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = ` ${tempData}`;
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `Wind speed is ${Math.round(
    response.data.wind.speed
  )} m/s`;
  let weatherIconElemet = document.querySelector("#weather-icon");
  weatherIconElemet.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
  );
  getForecast(response.data.coord);
}

function showCurrentPosition(position) {
  let latitude = position.coords.latitude;

  let longitude = position.coords.longitude;

  axios
    .get(
      `${apiUrl}?appid=${apiKey}&lat=${latitude}&lon=${longitude}&units=metric`
    )
    .then(showTemperature);
}
function showCurrentPosition(position) {
  let latitude = position.coords.latitude;

  let longitude = position.coords.longitude;

  axios
    .get(
      `${apiUrl}?appid=${apiKey}&lat=${latitude}&lon=${longitude}&units=metric`
    )
    .then(showTemperature);
}

function showLocationTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

let locationButton = document.querySelector("#current-location");
window.addEventListener("load", showLocationTemp);
