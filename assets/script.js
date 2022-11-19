var userFormEl = document.querySelector("#user-form"); 
var cityInputEl = document.querySelector("#city");

// gets the city data from API
var getCityData = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + "922574b9d5d83d1199eae45856020dd5";

    fetch(apiUrl)
    .then(function(res) {
        if (res.ok) {
            res.json().then(function(data) {
                getCityWeather(data,city);
            });
        }
        else {
            alert("Error with openweathermap")
        }
    });
};

// gets the latitude and longtitude to input into the weather API
var getCityWeather = function(data,city) {
    if (!data[0]) {
        alert("Weather data for this city cannot be found");
    }   
    else {
        var lat = data[0].lat;
        var lon = data[0].lon;
    }
    // api call
    var newApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + "9686278b56b94a147e1e2facc0a2671a";

    fetch(newApiUrl)
    .then(function(res) {
        if (res.ok) {
            res.json().then(function(data) {
                addToHistory(city); //adds to search history
                displayCurrentCity(data,city); //displays searched city data
                displayForecast(data);      //displays forecast for city
            });
        } 
        else {
            alert("Cannot find weather data");
        }
    })
    .catch(function(err) {
        console.log("Unable to connect to API");
    });
};

var addToHistory = function(city) {

    if (city) {

        if (localStorage.getItem("cities")) {
            var cityHistoryList = localStorage.getItem("cities");
        }
        else {
            var cityHistoryList = [];
        }

        var newSearch = city;

        if (cityHistoryList.includes(newSearch)) {
            console.log(newSearch + " had already been searched");
        }
        else {
            localStorage.setItem("cities", [...[cityHistoryList], newSearch]);
        }
    }

}


var formSubmitHandler = function(event){
    event.preventDefault();

    var currentLocation = cityInputEl.value.trim();

    if (currentLocation) {
        getCityData(currentLocation);
        cityInputEl.value="";
    }
    else {
        alert("Please enter a city")
    }
};

/*Event Handlers (starters) */
userFormEl.addEventListener("submit", formSubmitHandler);