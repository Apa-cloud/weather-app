function getWeather() {
    const apiKey = '68ede4765cdf04bc870b17b7478c5436';  /* API Key from Openweathermap.org */ 
    const city = document.getElementById('city').value; /* Taking user input of city */

    if (!city) {                               /* alert if empty input */
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)   /* Fetching current weather data */
        .then(response => response.json())  /* Passing response as json */
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {   /* error handling */
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)                /* Fetching hourly forcast data */
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

/* Taking weather data, extracting info, updating the html elements, displaying error if any issue with API request */

function displayWeather(data) {   /* Updating the html elements with information about weather data received by api */
    const tempDivInfo = document.getElementById('temp-div');    /* References to all the html elements */
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    /* Clear all previous content  */
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;  /* display error msg in weatherInfoDiv */
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        /* Extracting all the data */

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;
        
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {

    /* Reference to html elements */

    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); /* Display the next 24 hours (3-hour intervals), extracting first 8 items from hourly data */
    
    /* Iterating over each hourly data item */
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        
        
        /* string for each hourly forecast item */
        const hourlyItemHtml = `      
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;  
    });
}

function showImage() {  
    const weatherIcon = document.getElementById('weather-icon');  // getting reference to an icon image element 
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}