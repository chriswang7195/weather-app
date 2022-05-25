const apiKey = '999d1267963deff6e9aaefd07cb6f22a';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const defaultPos = {'lat': 40.730610, 'lon': -73.935242};
const citySearch = document.querySelector('.search-city');
const getWeatherBtn = document.querySelector('.city-weather');
const myLocationBtn = document.querySelector('.my-weather');
const weatherScreen = document.querySelector('.weather-screen');

async function fetchData(url) {
  const promise = await fetch(url);
  if (promise.status === 200) {
    const response = await promise.json();
    return response;
  } else {
    citySearch.value = 'Invalid city or state';
  }
}

async function getWeather(query) {
  const weather = await fetchData(`${baseUrl}${query}&appid=${apiKey}`);
  return weather;
}

function byPos(pos) {
  return `lat=${pos['lat']}&lon=${pos['lon']}`;
}

function byCity(cityName) {
  return `q=${cityName.toLowerCase()}`;
}

function getCurrentLocation() {
 return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      resolve({'lat': lat, 'lon': lon});
    });
 });
}

async function displayWeather(pos) {
  const weather = await getWeather(pos);
  weatherScreen.innerHTML = `
    <p class="city">${toTitleCase(weather['name'])}</p>
    <p><span class="temp">${kToF(weather['main']['temp'])}°</span></p>    
    <p class="desc">${toTitleCase(weather['weather'][0]['description'])}</p>    
    <p class="range">H: ${kToF(weather['main']['temp_max'])}° L: ${kToF(weather['main']['temp_min'])}°</p>
    `   

  return weather;
}

function toTitleCase(str) {
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }).join(' ');
}

function kToF(k) {
 const result = (((k - 273.15) * 9) / 5) + 32;
 return parseInt(result);
}

displayWeather(byPos(defaultPos));

myLocationBtn.addEventListener('click', (event) => {
  event.preventDefault();
  getCurrentLocation().then(async pos => { 
    let weather = await displayWeather(byPos(pos));
    citySearch.value = weather['name'];
  });
});

getWeatherBtn.addEventListener('click', (event) => {
  event.preventDefault();
  let cityName = citySearch.value;
  displayWeather(byCity(cityName))
});