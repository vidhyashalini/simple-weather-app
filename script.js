const apiKey = 'dd3becdfe2b7d421ec6a7c2f8effe628'; 
const weatherInfoDiv = document.getElementById('weather-info');
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const conditionElement = document.getElementById('condition');
const saveCityBtn = document.getElementById('save-city-btn');
const cityInput = document.getElementById('city-input');

const comparisonResultsDiv = document.getElementById('comparison-results');
const city1Input = document.getElementById('city1-input');
const city2Input = document.getElementById('city2-input');
const city1NameElement = document.getElementById('city1-name');
const temperature1Element = document.getElementById('temperature1');
const humidity1Element = document.getElementById('humidity1');
const condition1Element = document.getElementById('condition1');
const city2NameElement = document.getElementById('city2-name');
const temperature2Element = document.getElementById('temperature2');
const humidity2Element = document.getElementById('humidity2');
const condition2Element = document.getElementById('condition2');

const favoriteList = document.getElementById('favorite-list');
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
renderFavoriteCities();

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            cityNameElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            humidityElement.textContent = `${data.main.humidity}%`;
            conditionElement.textContent = data.weather[0].description;
            weatherInfoDiv.classList.remove('hidden');
        } else {
            alert(data.message || 'Could not fetch weather data.');
            weatherInfoDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data. Please try again later.');
        weatherInfoDiv.classList.add('hidden');
    }
}

async function getWeatherForComparison(cityId, cityNameElement, tempElement, humidityElement, conditionElement) {
    const city = document.getElementById(cityId).value.trim();
    if (!city) {
        alert(`Please enter a city name for comparison.`);
        return null;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            cityNameElement.textContent = data.name;
            tempElement.textContent = `${Math.round(data.main.temp)}°C`;
            humidityElement.textContent = `${data.main.humidity}%`;
            conditionElement.textContent = data.weather[0].description;
            return true;
        } else {
            alert(data.message || `Could not fetch weather data for ${city}.`);
            return false;
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert(`Failed to fetch weather data for ${city}. Please try again later.`);
        return false;
    }
}

async function compareWeather() {
    const city1Fetched = await getWeatherForComparison('city1-input', city1NameElement, temperature1Element, humidity1Element, condition1Element);
    const city2Fetched = await getWeatherForComparison('city2-input', city2NameElement, temperature2Element, humidity2Element, condition2Element);

    if (city1Fetched && city2Fetched) {
        comparisonResultsDiv.classList.remove('hidden');
    } else {
        comparisonResultsDiv.classList.add('hidden');
    }
}

saveCityBtn.addEventListener('click', () => {
    const cityToSave = cityNameElement.textContent;
    if (cityToSave && !favoriteCities.includes(cityToSave)) {
        favoriteCities.push(cityToSave);
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        renderFavoriteCities();
        alert(`${cityToSave} added to favorites!`);
    } else if (favoriteCities.includes(cityToSave)) {
        alert(`${cityToSave} is already in your favorites!`);
    } else {
        alert('No city to save. Please fetch weather first.');
    }
});

function renderFavoriteCities() {
    favoriteList.innerHTML = '';
    favoriteCities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.classList.add('favorite-item');
        listItem.textContent = city;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFavoriteCity(city));
        listItem.appendChild(removeButton);
        favoriteList.appendChild(listItem);
    });
}

function removeFavoriteCity(cityToRemove) {
    favoriteCities = favoriteCities.filter(city => city !== cityToRemove);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    renderFavoriteCities();
    alert(`${cityToRemove} removed from favorites.`);
}
