var searchInput = document.querySelector('.search-input');
var searchIcon = document.querySelector('.search-icon');
var locationErrorMessage = document.querySelector('.location-error-message');

const weatherAPIKey='f5d569859a264cc9bbe131447242503';

function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude = " + latitude + "\nLongitude = " + longitude);
    fetch("https://api.weatherapi.com/v1/search.json?key=" + weatherAPIKey + "&q=" + latitude + "," + longitude)
        .then((res) => res.json())
        .then((data) => {
            data.forEach(element => {
                console.log(element.name);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            window.alert("Error Finding Your Current Location");
        });
}

function showError(error) {
    switch(error.code) {
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
    var inputLocation=searchInput.value;
    locationErrorMessage.style.display = 'none';

    if (inputLocation === "") {
        showLocationError("Please enter a location",3500);
        return;
    }
    getLocation(inputLocation);
});

function getLocation(location) {
    fetch("http://api.weatherapi.com/v1/search.json?key="+weatherAPIKey+"&q="+location)
            .then((res) => res.json())
            .then((data) =>{
                if (data && data.length==1) {
                    console.log("Valid location");
                } else {
                    showLocationError("Location not found",15000);
                }
            })
}

function showLocationError(message, time) {
    // Calculate position relative to the input
    var inputRect = searchInput.getBoundingClientRect();
    var inputTop = inputRect.top + window.scrollY;
    var inputLeft = inputRect.left + window.scrollX;

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