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

function validateLocationInput(){
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
    loadedInformationType.textContent="Current Weather";   

});

forecastDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "none";
    document.querySelector(".history-data").style.display = "none";
    document.querySelector(".ten-day-forecast-data").style.display = "block"; 
    loadedInformationType.textContent="10 Day Forecast";  

});

mapsDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".ten-day-forecast-data").style.display = "none";
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".history-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "block";   
    loadedInformationType.textContent="Weather Maps";

});

historyDataLoader.addEventListener('click', function () {
    showCurrentWeatherData();
    document.querySelector(".ten-day-forecast-data").style.display = "none";
    document.querySelector(".maps-data").style.display = "none";
    document.querySelector(".current-weather-data").style.display = "none";
    document.querySelector(".history-data").style.display = "block";   
    loadedInformationType.textContent="Historical Weather Data";

});

function showCurrentWeatherData() {
    let humidity = document.querySelector('.humidity');
    let uvIndex = document.querySelector('.uv-index');

    fetch("http://api.weatherapi.com/v1/current.json?key=" + weatherAPIKey + "&q=" + cityName + "," + countryName)
        .then((res) => res.json())
        .then((data) => {
            if (data) { // Check if data exists and has elements
                console.log("Data Fetched");

                humidity.textContent = data.current.humidity;
                uvIndex.textContent = data.current.uv;

                setTemperature(data.current.temp_c, data.current.temp_f);
                setWindSpeed(data.current.wind_kph, data.current.wind_mph);
                setLocalTime(data.location.localtime.split(' ')[1]);
                setCondition(data.current.is_day, data.current.condition.code);
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
    let conditionText = document.querySelector('.condition-text');
    let conditionIcon = document.querySelector('.condition-icon');
    let folder = "day";

    if (isDay == 0) {
        folder = "night";
    }

    if (code > 1200) {
        switch (code) {
            case 1201:
                conditionText.textContent = "Moderate or heavy freezing rain";
                conditionIcon.src = "images/" + folder + "/314.png";
                break;
            case 1204:
                conditionText.textContent = "Light sleet";
                conditionIcon.src = "images/" + folder + "/317.png";
                break;
            case 1207:
                conditionText.textContent = "Moderate or heavy sleet";
                conditionIcon.src = "images/" + folder + "/320.png";
                break;
            case 1210:
                conditionText.textContent = "Patchy light snow";
                conditionIcon.src = "images/" + folder + "/323.png";
                break;
            case 1213:
                conditionText.textContent = "Light snow";
                conditionIcon.src = "images/" + folder + "/326.png";
                break;
            case 1216:
                conditionText.textContent = "Patchy moderate snow";
                conditionIcon.src = "images/" + folder + "/329.png";
                break;
            case 1219:
                conditionText.textContent = "Moderate snow";
                conditionIcon.src = "images/" + folder + "/332.png";
                break;
            case 1222:
                conditionText.textContent = "Patchy heavy snow";
                conditionIcon.src = "images/" + folder + "/335.png";
                break;
            case 1225:
                conditionText.textContent = "Heavy snow";
                conditionIcon.src = "images/" + folder + "/338.png";
                break;
            case 1237:
                conditionText.textContent = "Ice pellets";
                conditionIcon.src = "images/" + folder + "/350.png";
                break;
            case 1240:
                conditionText.textContent = "Light rain shower";
                conditionIcon.src = "images/" + folder + "/353.png";
                break;
            case 1243:
                conditionText.textContent = "Moderate or heavy rain shower";
                conditionIcon.src = "images/" + folder + "/356.png";
                break;
            case 1246:
                conditionText.textContent = "Torrential rain shower";
                conditionIcon.src = "images/" + folder + "/359.png";
                break;
            case 1249:
                conditionText.textContent = "Light sleet showers";
                conditionIcon.src = "images/" + folder + "/362.png";
                break;
            case 1252:
                conditionText.textContent = "Moderate or heavy sleet showers";
                conditionIcon.src = "images/" + folder + "/365.png";
                break;
            case 1255:
                conditionText.textContent = "Light snow showers";
                conditionIcon.src = "images/" + folder + "/368.png";
                break;
            case 1258:
                conditionText.textContent = "Moderate or heavy snow showers";
                conditionIcon.src = "images/" + folder + "/371.png";
                break;
            case 1261:
                conditionText.textContent = "Light showers of ice pellets";
                conditionIcon.src = "images/" + folder + "/374.png";
                break;
            case 1264:
                conditionText.textContent = "Moderate or heavy showers of ice pellets";
                conditionIcon.src = "images/" + folder + "/377.png";
                break;
            case 1273:
                conditionText.textContent = "Patchy light rain with thunder";
                conditionIcon.src = "images/" + folder + "/386.png";
                break;
            case 1276:
                conditionText.textContent = "Moderate or heavy rain with thunder";
                conditionIcon.src = "images/" + folder + "/389.png";
                break;
            case 1279:
                conditionText.textContent = "Patchy light snow with thunder";
                conditionIcon.src = "images/" + folder + "/392.png";
                break;
            case 1282:
                conditionText.textContent = "Moderate or heavy snow with thunder";
                conditionIcon.src = "images/" + folder + "/395.png";
                break;
            default:
                window.alert("Error Fetching Current Weather Data");
                break;
        }
    } else if (code > 1100) {
        switch (code) {
            case 1114:
                conditionText.textContent = "Blowing snow";
                conditionIcon.src = "images/" + folder + "/227.png";
                break;
            case 1117:
                conditionText.textContent = "Blizzard";
                conditionIcon.src = "images/" + folder + "/230.png";
                break;
            case 1135:
                conditionText.textContent = "Fog";
                conditionIcon.src = "images/" + folder + "/248.png";
                break;
            case 1147:
                conditionText.textContent = "Freezing fog";
                conditionIcon.src = "images/" + folder + "/260.png";
                break;
            case 1150:
                conditionText.textContent = "Patchy light drizzle";
                conditionIcon.src = "images/" + folder + "/263.png";
                break;
            case 1153:
                conditionText.textContent = "Light drizzle";
                conditionIcon.src = "images/" + folder + "/266.png";
                break;
            case 1168:
                conditionText.textContent = "Freezing drizzle";
                conditionIcon.src = "images/" + folder + "/281.png";
                break;
            case 1171:
                conditionText.textContent = "Heavy freezing drizzle";
                conditionIcon.src = "images/" + folder + "/284.png";
                break;
            case 1180:
                conditionText.textContent = "Patchy light rain";
                conditionIcon.src = "images/" + folder + "/293.png";
                break;
            case 1183:
                conditionText.textContent = "Light rain";
                conditionIcon.src = "images/" + folder + "/296.png";
                break;
            case 1186:
                conditionText.textContent = "Moderate rain at times";
                conditionIcon.src = "images/" + folder + "/299.png";
                break;
            case 1189:
                conditionText.textContent = "Moderate rain";
                conditionIcon.src = "images/" + folder + "/302.png";
                break;
            case 1192:
                conditionText.textContent = "Heavy rain at times";
                conditionIcon.src = "images/" + folder + "/305.png";
                break;
            case 1195:
                conditionText.textContent = "Heavy rain";
                conditionIcon.src = "images/" + folder + "/308.png";
                break;
            case 1198:
                conditionText.textContent = "Light freezing rain";
                conditionIcon.src = "images/" + folder + "/311.png";
                break;
            default:
                window.alert("Error Fetching Current Weather Data");
                return;
        }

    } else {
        switch (code) {
            case 1000:
                if (folder = "day") {
                    conditionText.textContent = "Sunny";
                } else {
                    conditionText.textContent = "Clear";
                }
                conditionIcon.src = "images/" + folder + "/113.png";
                return;
            case 1003:
                conditionText.textContent = "Partly cloudy";
                conditionIcon.src = "images/" + folder + "/116.png";
                return;
            case 1006:
                conditionText.textContent = "Cloudy";
                conditionIcon.src = "images/" + folder + "/119.png";
                break;
            case 1009:
                conditionText.textContent = "Overcast";
                conditionIcon.src = "images/" + folder + "/122.png";
                break;
            case 1030:
                conditionText.textContent = "Mist";
                conditionIcon.src = "images/" + folder + "/143.png";
                break;
            case 1063:
                conditionText.textContent = "Patchy rain possible";
                conditionIcon.src = "images/" + folder + "/176.png";
                break;
            case 1066:
                conditionText.textContent = "Patchy snow possible";
                conditionIcon.src = "images/" + folder + "/179.png";
                break;
            case 1069:
                conditionText.textContent = "Patchy sleet possible";
                conditionIcon.src = "images/" + folder + "/182.png";
                break;
            case 1072:
                conditionText.textContent = "Patchy freezing drizzle possible";
                conditionIcon.src = "images/" + folder + "/185.png";
                break;
            case 1087:
                conditionText.textContent = "Thundery outbreaks possible";
                conditionIcon.src = "images/" + folder + "/200.png";
                break;

            default:
                window.alert("Error Fetching Current Weather Data");
                return;
        }
    }
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