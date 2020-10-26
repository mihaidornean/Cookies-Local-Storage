"use strict"

const url = "https://api.openweathermap.org/data/2.5/weather?q=Brasov,Ro&appid=c7da641777760054e5ca6164eb47580a";
const unitOptions = document.querySelectorAll('[data-select-unit]');


function getCookiesAsObject() {
    const cookies = document.cookie.split('; ');

    const cookieObj = cookies.reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;

        return acc;
    }, {})

    return cookieObj;
}

const selectedOption = getCookiesAsObject().selectedTemperatureUnit;

console.log(selectedOption);    

unitOptions.forEach((element) => {
    if(selectedOption === element.value) {
        element.checked = true;
        convertTemperatures(element);   
    }

    element.addEventListener('change', () => convertTemperatures(element));
});

function convertTemperatures(element) {
    document.cookie = `selectedTemperatureUnit=${element.value}`;
    getTheWeather(element.value);
}


//  Local Storage
// unitOptions.forEach((element) => {
//     const storedUnit = localStorage.getItem("selectedTemperatureUnit");

//     element.addEventListener('change', () => convertTemperatures(element));

//     if(element.value === storedUnit) {
//         element.checked = true;
//         convertTemperatures(element);
//     }
// });

// function convertTemperatures(element) {
//     localStorage.setItem('selectedTemperatureUnit', element.value);
//     getTheWeather(element.value);
// }

function getTheWeather(unit) {
    fetch(url)
    .then(response => response.json())
    .then((data) => getDataFromApi(data, unit))
}

function getDataFromApi(data, unit) {
    const container = document.querySelector('[data-container]');
    container.classList.remove('d-none')

    const city = document.querySelector('[data-city]');
    city.innerText = data.name;

    const sunrise = document.querySelector('[data-sunrise]');
    sunrise.innerText = new Date((data.sys.sunrise)*1000);
    const sunset = document.querySelector('[data-sunset]');
    sunset.innerText = new Date((data.sys.sunset)*1000);

    const image = document.querySelector('[data-image]')
    image.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

    const description = document.querySelector('[data-description]');
    description.innerText = data.weather[0].description;

    unit === 'c' ?
    calculateCelsius(data):
    calculateFahrenheit(data)
}

function calculateCelsius(data) {
    const tempNow = document.querySelector('[data-temp-now]');
    tempNow.innerText = `${Math.floor(data.main.temp - 273.15)} °C`;

    const feelsLike = document.querySelector('[data-feels]');
    feelsLike.innerText = `${Math.floor(data.main.feels_like - 273.15)} °C`;
}

function calculateFahrenheit(data) {
    const tempNow = document.querySelector('[data-temp-now]');
    tempNow.innerText = `${Math.floor(data.main.temp * 9/5 - 459.67)} °F`;

    const feelsLike = document.querySelector('[data-feels]');
    feelsLike.innerText = `${Math.floor(data.main.feels_like * 9/5 - 459.67)} °F`;
}