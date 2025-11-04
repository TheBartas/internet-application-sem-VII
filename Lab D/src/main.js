const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
        console.log('GET send to current!');
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
        console.log('GET send to forecast!');
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.resultsBlock.innerHTML = '';
        if (!this.forecast || this.forecast.length === 0) return;

        const HOURS = [1, 4, 7, 10, 13, 16, 19, 22];
        const grouped = {};

        const currentDate = new Date(this.currentWeather.dt * 1000);
        const currentDayKey = currentDate.toISOString().split('T')[0];
        if (!grouped[currentDayKey]) grouped[currentDayKey] = [];
        grouped[currentDayKey].push(this.currentWeather);

        for (let item of this.forecast) {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0];
            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(item);
        }

        console.log(grouped);

        const days = Object.keys(grouped).slice(0, 5);

        const container = document.createElement("div");
        container.className = "forecast-grid";
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(${days.length}, 1fr)`;
        container.style.gap = "20px";

        for (let day of days) {
            const col = document.createElement("div");
            col.className = "forecast-day-col";

            const dayTitle = document.createElement("h3");
            const dateObj = new Date(day);
            dayTitle.innerText = dateObj.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });
            col.appendChild(dayTitle);

            const dayData = grouped[day];
            const hourMap = {};
            for (let entry of dayData) {
                const h = new Date(entry.dt * 1000).getHours();
                hourMap[h] = entry;
            }

            for (let h of HOURS) {
                const weather = hourMap[h];
                if (weather) {
                    const temperature = weather.main.temp;
                    const feelsLikeTemperature = weather.main.feels_like;
                    const iconName = weather.weather[0].icon;
                    const description = weather.weather[0].description;
                    const block = this.createWeatherBlock(
                        `${h}:00`,
                        temperature,
                        feelsLikeTemperature,
                        iconName,
                        description
                    );
                col.appendChild(block);
                } else {
                    const emptyBlock = document.createElement("div");
                    emptyBlock.className = "weather-block-empty";
                    emptyBlock.innerHTML = `<div class="weather-date">${h}:00</div><div>—</div>`;
                    col.appendChild(emptyBlock);
                }
            }

            container.appendChild(col);
        }   

        this.resultsBlock.appendChild(container);
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-temperature-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

const KEY = "6e4214b47f0e6ada0782be79600da958";

document.weatherApp = new WeatherApp(KEY, "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
