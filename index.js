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

let temp = document.querySelector("#current-temp");

function changeCelToFar(event) {
  event.preventDefault();
  if (isCelsius) {
    let far = 1.8 * temp.innerHTML + 32;
    temp.innerHTML = far.toFixed();
    isCelsius = false;
  }
}

let farTemp = document.querySelector("#farengheit");
farTemp.addEventListener("click", changeCelToFar);

function changeFarToCelsius(event) {
  event.preventDefault();
  if (!isCelsius) {
    let cel = (temp.innerHTML - 32) * 0.5556;
    temp.innerHTML = cel.toFixed();
    isCelsius = true;
  }
}

let celTemp = document.querySelector("#celsius");
celTemp.addEventListener("click", changeFarToCelsius);

let apiKey = "b7a1189e9feeae19225df090063776bd";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather";

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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
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

//   function showLocationTemp(event) {
//     event.preventDefault();
//     navigator.geolocation.getCurrentPosition(showCurrentPosition);
//   }

//   let locationButton = document.querySelector("#current-location");
//   locationButton.addEventListener("click", showLocationTemp);
