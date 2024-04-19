const currentDataLoader = document.querySelector('.current-weather');
const forecastDataLoader = document.querySelector('.ten-day-forecast');
const mapsDataLoader = document.querySelector('.maps');
const historyDataLoader = document.querySelector('.history');
const loadedInformationType = document.querySelector('.information-type');

const locationName = document.querySelector('.location-name h2')
const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.search-icon');
const locationErrorMessage = document.querySelector('.location-error-message');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.wind-speed');
const tempUnit = document.querySelector('.temp-unit');
const speedUnit = document.querySelector('.speed-unit');
const daySummariesContainer = document.querySelector(".day-summaries");

const changeTempUnit = document.querySelectorAll(".temp-unit");
const changeSpeedUnit = document.querySelector('.change-speed-unit');

const weatherAPIKey = 'f5d569859a264cc9bbe131447242503';

var countryName = null;
var cityName = null;
var temperatureC = 0;
var temperatureF = 0;
var windSpeedKph = 0;
var windSpeedMph = 0;


function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log("Latitude = " + latitude + "\nLongitude = " + longitude);

    fetch("https://api.weatherapi.com/v1/search.json?key=" + weatherAPIKey + "&q=" + latitude + "," + longitude)
        .then((res) => res.json())
        .then((data) => {
            if (data && data.length > 0) { // Check if data exists and has elements
                locationName.innerHTML = "<i class='bi bi-crosshair'></i>  " + data[0].name + " , " + data[0].country;
                cityName = data[0].name;
                countryName = data[0].country;
                showCurrentWeatherData();
                createTenDaySummaries();
            } else {
                console.error("Error: No location data found");
                window.alert("Error Finding Your Current Location (No Data)");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            window.alert("Error Finding Your Current Location");
            getLocation("Sri Lanka");
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            window.alert("User denied the request for Geolocation.");
            getLocation("Sri Lanka");
            break;
        case error.POSITION_UNAVAILABLE:
            window.alert("Location information is unavailable.");
            getLocation("Sri Lanka");
            break;
        case error.TIMEOUT:
            window.alert("The request to get user location timed out.");
            getLocation("Sri Lanka");
            break;
        case error.UNKNOWN_ERROR:
            window.alert("An unknown error occurred.");
            getLocation("Sri Lanka");
            break;
    }
}

searchIcon.addEventListener('click', function () {
    validateLocationInput();
});

searchInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        validateLocationInput();
    }
});

function validateLocationInput() {
    let inputLocation = searchInput.value;
    locationErrorMessage.style.display = 'none';

    if (inputLocation === "") {
        showLocationError("Please enter a location", 3500);
        return;
    }
    getLocation(inputLocation);
}

function getLocation(location) {
    fetch("http://api.weatherapi.com/v1/search.json?key=" + weatherAPIKey + "&q=" + location)
        .then((res) => res.json())
        .then((data) => {
            if (data && data.length > 0) { // Check if data exists and has elements
                locationName.innerHTML = "<i class='bi bi-crosshair'></i>  " + data[0].name + " , " + data[0].country;
                cityName = data[0].name;
                countryName = data[0].country;
                showCurrentWeatherData();
                createTenDaySummaries();
            } else {
                showLocationError("Location not found", 15000);
            }
        })
}

function showLocationError(message, time) {
    // Calculate position relative to the input
    let inputRect = searchInput.getBoundingClientRect();
    let inputTop = inputRect.top + window.scrollY;
    let inputLeft = inputRect.left + window.scrollX;

    // Position the message below the input
    locationErrorMessage.style.display = 'block';
    locationErrorMessage.style.top = (inputTop + locationErrorMessage.offsetHeight + 5) + 'px';
    locationErrorMessage.style.left = inputLeft + 'px';
    locationErrorMessage.textContent = message;

    // Hide the message after 3.5 seconds
    setTimeout(function () {
        locationErrorMessage.style.display = 'none';
    }, time);
}

currentDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".ten-day-forecast-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "none";
    document.querySelector(".history-data").style.display = "none";
    document.querySelector(".current-weather-data").style.display = "block";
    loadedInformationType.textContent = "Current Weather";

});

forecastDataLoader.addEventListener('click', function () {
    createTenDaySummaries()
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "none";
    document.querySelector(".history-data").style.display = "none";
    document.querySelector(".ten-day-forecast-data").style.display = "block";
    loadedInformationType.textContent = "10 Day Forecast";

});

mapsDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".ten-day-forecast-data").style.display = "none";
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".history-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "block";
    loadedInformationType.textContent = "Weather Maps";

});

historyDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".ten-day-forecast-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "none";
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".history-data").style.display = "block";
    loadedInformationType.textContent = "Historical Weather Data";

});

function showCurrentWeatherData() {
    let conditionText = document.querySelector('.condition-text');
    let conditionIcon = document.querySelector('.condition-icon');
    let humidity = document.querySelector('.humidity');
    let uvIndex = document.querySelector('.uv-index');

    fetch("http://api.weatherapi.com/v1/current.json?key=" + weatherAPIKey + "&q=" + cityName + "," + countryName)
        .then((res) => res.json())
        .then((data) => {
            if (data) { // Check if data exists and has elements
                console.log("Data Fetched");

                conditionText.textContent = data.current.condition.text;
                conditionIcon.src = setCondition(data.current.is_day, data.current.condition.code);
                humidity.textContent = data.current.humidity;
                uvIndex.textContent = data.current.uv;

                setTemperature(data.current.temp_c, data.current.temp_f);
                setWindSpeed(data.current.wind_kph, data.current.wind_mph);
                setLocalTime(data.location.localtime.split(' ')[1]);
                setDirectionName(data.current.wind_dir);
            }
        })
        .catch((error) => {
            console.error("Error fetching Current Weather data:", error);
            window.alert("Error Fetching Current Weather Data");
        });
}

function setTemperature(tempC, tempF) {
    temperatureC = tempC;
    temperatureF = tempF;

    temperature.textContent = tempC;
    tempUnit.textContent = "C";
}

// Add click event listener to each element
changeTempUnit.forEach(function (tempUnit) {
    tempUnit.addEventListener("click", function () {
        if (tempUnit.textContent === "C") {
            temperature.textContent = temperatureF;
            tempUnit.textContent = "F";
            return;
        }
        temperature.textContent = temperatureC;
        tempUnit.textContent = "C";
    });
});


function setWindSpeed(speedKph, speedMph) {
    windSpeedKph = speedKph;
    windSpeedMph = speedMph;

    windSpeed.textContent = windSpeedKph;
}

changeSpeedUnit.addEventListener('click', function () {
    if (speedUnit.textContent === "kmh") {
        windSpeed.textContent = windSpeedMph;
        changeSpeedUnit.src = "images/mph.png";
        speedUnit.textContent = "mph";
        return;
    }
    windSpeed.textContent = windSpeedKph;
    changeSpeedUnit.src = "images/kmh.png";
    speedUnit.textContent = "kmh";
    return;
});

function setLocalTime(time) {
    let localtime = document.querySelector('.local-time');
    let localtimePeriod = document.querySelector('.local-time-period');

    let hour = parseInt(time.split(":")[0]);
    let minute = parseInt(time.split(":")[1]);
    let timePeriod = "am";

    if (hour >= 13) {
        hour -= 12;
        timePeriod = "pm";
    }

    localtime.textContent = hour + ":" + minute;
    localtimePeriod.textContent = timePeriod;
}

function setCondition(isDay, code) {
    let source = null;
    let folder = "day";

    if (isDay == 0) {
        folder = "night";
    }


    if (code > 1200) {
        switch (code) {
            case 1201:
                return "images/" + folder + "/314.png";
            case 1204:
                return "images/" + folder + "/317.png";
            case 1207:
                return "images/" + folder + "/320.png";
            case 1210:
                return "images/" + folder + "/323.png";
            case 1213:
                return "images/" + folder + "/326.png";
            case 1216:
                return "images/" + folder + "/329.png";
            case 1219:
                return "images/" + folder + "/332.png";
            case 1222:
                return "images/" + folder + "/335.png";
            case 1225:
                return "images/" + folder + "/338.png";
            case 1237:
                return "images/" + folder + "/350.png";
            case 1240:
                return "images/" + folder + "/353.png";
            case 1243:
                return "images/" + folder + "/356.png";
            case 1246:
                return "images/" + folder + "/359.png";
            case 1249:
                return "images/" + folder + "/362.png";
            case 1252:
                return "images/" + folder + "/365.png";
            case 1255:
                return "images/" + folder + "/368.png";
            case 1258:
                return "images/" + folder + "/371.png";
            case 1261:
                return "images/" + folder + "/374.png";
            case 1264:
                return "images/" + folder + "/377.png";
            case 1273:
                return "images/" + folder + "/386.png";
            case 1276:
                return "images/" + folder + "/389.png";
            case 1279:
                return "images/" + folder + "/392.png";
            case 1282:
                return "images/" + folder + "/395.png";
            default:
                window.alert("Error Fetching Current Weather Data");
                return;
        }
    } else if (code > 1100) {
        switch (code) {
            case 1114:
                return "images/" + folder + "/227.png";
            case 1117:
                return "images/" + folder + "/230.png";
            case 1135:
                return "images/" + folder + "/248.png";
            case 1147:
                return "images/" + folder + "/260.png";
            case 1150:
                return "images/" + folder + "/263.png";
            case 1153:
                return "images/" + folder + "/266.png";
            case 1168:
                return "images/" + folder + "/281.png";
            case 1171:
                return "images/" + folder + "/284.png";
            case 1180:
                return "images/" + folder + "/293.png";
            case 1183:
                return "images/" + folder + "/296.png";
            case 1186:
                return "images/" + folder + "/299.png";
            case 1189:
                return "images/" + folder + "/302.png";
            case 1192:
                return "images/" + folder + "/305.png";
            case 1195:
                return "images/" + folder + "/308.png";
            case 1198:
                return "images/" + folder + "/311.png";
            default:
                window.alert("Error Fetching Current Weather Data");
                return;
        }

    } else if (code > 999) {
        switch (code) {
            case 1000:
                // if (folder = "day") {
                //     conditionText.textContent = "Sunny";
                // } else {
                //     conditionText.textContent = "Clear";
                // }
                return "images/" + folder + "/113.png";
            case 1003:
                return "images/" + folder + "/116.png";
            case 1006:
                return "images/" + folder + "/119.png";
            case 1009:
                return "images/" + folder + "/122.png";
            case 1030:
                return "images/" + folder + "/143.png";
            case 1063:
                return "images/" + folder + "/176.png";
            case 1066:
                return "images/" + folder + "/179.png";
            case 1069:
                return "images/" + folder + "/182.png";
            case 1072:
                return "images/" + folder + "/185.png";
            case 1087:
                return "images/" + folder + "/200.png";

            default:
                window.alert("Error Fetching Current Weather Data");
                return;
        }
    }
    return source;
}

function setDirectionName(code) {
    let windDirection = document.querySelector('.wind-direction');
    let codeLength = code.length;

    if (codeLength == 1) {
        switch (code) {
            case "N":
                windDirection.textContent = "North";
                return;

            case "E":
                windDirection.textContent = "East";
                return;

            case "S":
                windDirection.textContent = "South";
                return;

            case "W":
                windDirection.textContent = "West";
                return;

            default:
                windDirection.textContent = "Unspecified";
                return;
        }
    } else if (codeLength == 2) {
        switch (code) {
            case "NE":
                windDirection.textContent = "North East";
                return;

            case "SE":
                windDirection.textContent = "South East";
                return;

            case "SW":
                windDirection.textContent = "South West";
                return;

            case "NW":
                windDirection.textContent = "North West";
                return;

            default:
                windDirection.textContent = "Unspecified";
                return;
        }
    }

    switch (code) {
        case "NNW":
        case "WNW":
            windDirection.textContent = "North West";
            return;

        case "NNE":
        case "ENE":
            windDirection.textContent = "North East";
            return;

        case "ESE":
        case "SSE":
            windDirection.textContent = "South East";
            return;

        case "SSW":
        case "WSW":
            windDirection.textContent = "South West";
            return;

        default:
            windDirection.textContent = "Unspecified";
            return;
    }

    // switch (code) {
    //     case "NNW":
    //         windDirection.textContent = "North West";
    //         return;
    //     case "NNE":
    //         windDirection.textContent = "North East";
    //         return;
    //     case "ENE":
    //         windDirection.textContent = "North East";
    //         return;
    //     case "ESE":
    //         windDirection.textContent = "South East";
    //         return;
    //     case "SSE":
    //         windDirection.textContent = "South East";
    //         return;
    //     case "SSW":
    //         windDirection.textContent = "South West";
    //         return;
    //     case "WSW":
    //         windDirection.textContent = "South West";
    //         return;
    //     case "WNW":
    //         windDirection.textContent = "North West";
    //         return;
    //     default:
    //         windDirection.textContent = "Unspecified";
    //         return;
    // }
}

function createTenDaySummaries() {
    fetch("http://api.weatherapi.com/v1/forecast.json?key=" + weatherAPIKey + "&q=" + cityName + "," + countryName + "&days=10")
        .then((res) => res.json())
        .then((data) => {
            console.log("data fetched");
            const dailyForecasts = data.forecast.forecastday;

            dailyForecasts.forEach((dayData, i) => {
                const daySummary = document.createElement("div");
                daySummary.classList.add("day-summary");

                const date = document.createElement("p");
                date.classList.add("date");
                date.textContent = dayData.date;

                const conditionText = document.createElement("p");
                conditionText.classList.add("forecast-condition-text");
                let dayConditionText = dayData.day.condition.text;
                conditionText.textContent = dayConditionText;

                const conditionIcon = document.createElement("img");
                conditionIcon.classList.add("forecast-condition-icon");
                conditionIcon.src = setCondition(1, dayData.day.condition.code);
                conditionIcon.alt = dayConditionText;

                const avgTemp = document.createElement("span");
                avgTemp.classList.add("avg-temp");
                avgTemp.textContent = dayData.day.avgtemp_c;

                const minTemp = document.createElement("span");
                minTemp.classList.add("min-temp");
                minTemp.textContent = dayData.day.mintemp_c;

                const maxTemp = document.createElement("span");
                maxTemp.classList.add("max-temp");
                maxTemp.textContent = dayData.day.maxtemp_c;

                daySummary.appendChild(date);
                daySummary.appendChild(conditionText);
                daySummary.appendChild(conditionIcon);
                daySummary.appendChild(avgTemp);
                daySummary.appendChild(minTemp);
                daySummary.appendChild(maxTemp);

                daySummariesContainer.appendChild(daySummary);

            });
        }).catch((error) => {
            console.error("Error fetching Current Weather data:", error);
            window.alert("Error Fetching Current Weather Data");
        });
}

//To Toggle between dark mode and light mode
function changeDisplayMode() {
    console.log("Background changed");
    document.documentElement.style.setProperty('--bg-color', '#a013e7');
}