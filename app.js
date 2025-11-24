const apiKey = "YOUR_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const saveFavBtn = document.getElementById("saveFavBtn");
const favList = document.getElementById("favList");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const conditions = document.getElementById("conditions");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function getWeather(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
        alert("City not found");
        return;
    }

    const data = await res.json();
    displayCurrent(data);
    getForecast(city);
}

function displayCurrent(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp}°C`;
    conditions.textContent = data.weather[0].description.toUpperCase();

    const icon = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    updateBackground(data.weather[0].main);
}

async function getForecast(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    forecastContainer.innerHTML = "";
    const list = data.list.filter(i => i.dt_txt.includes("12:00:00"));

    list.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("forecast-item");
        div.innerHTML = `
            <p>${day.dt_txt.split(" ")[0]}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
            <p>${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(div);
    });
}

saveFavBtn.onclick = () => {
    const city = cityName.textContent;
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    }
};

function loadFavorites() {
    favList.innerHTML = "";
    favorites.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.style.cursor = "pointer";
        li.onclick = () => getWeather(city);
        favList.appendChild(li);
    });
}

locBtn.onclick = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        displayCurrent(data);
        getForecast(data.name);
    });
};

function updateBackground(condition) {
    const images = {
        Clear: "sunny.jpg",
        Clouds: "cloudy.jpg",
        Rain: "rain.jpg",
        Snow: "snow.jpg",
        Thunderstorm: "storm.jpg",
        Mist: "mist.jpg"
    };

    document.body.style.backgroundImage =
        `url('assets/${images[condition] || "default.jpg"}')`;
}

searchBtn.onclick = () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
};

loadFavorites();
