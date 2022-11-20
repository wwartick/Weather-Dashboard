var userFormEl = document.querySelector("#user-form"); 
var cityInputEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#search-history");
var weatherDataEl = document.querySelector("#weather-data");

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
               // displayForecast(data);      //displays forecast for city
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
            // console.log(newSearch + " has already been searched"); test function
        }
        else {
            localStorage.setItem("cities", [...[cityHistoryList], newSearch]);
        }
    }
}

var searchAgain = function(event){
    var historyBtn = event.target.textContent;
    getCityData(historyBtn);
}

var displaySearchHistory = function() {

    if (localStorage.getItem("cities")) {
        searchHistoryEl.textContent = "";

        var searchContainer = document.createElement("div");
        var searchHistoryList = localStorage.getItem("cities").split(",");

        for (var i=1; i < searchHistoryList.length; i++){
            var citySearchEl = document.createElement("button");
            citySearchEl.classList = "btn btn-primary col-12 mt-1";
            citySearchEl.textContent = searchHistoryList[i];
            
            searchContainer.appendChild(citySearchEl);
            citySearchEl.addEventListener("click", searchAgain);
        };
    }
    searchHistoryEl.appendChild(searchContainer);
}

var displayCurrentCity = function (data,city) {
    console.log(data);
    //displays error if city is not found
    if(data.length === 0) {
        alert("City not found");
        return;
    }

    //resets the container
    weatherDataEl.textContent = "";

    var currentCityDivEl = document.createElement("div");
     currentCityDivEl.classList=  "pl-0";

    var currentCityH2El = document.createElement("h2");
     currentCityH2El.classList =  'mt-1 font-weight-bold'
    cityDisplayEl = document.createElement("span");
    cityDisplayEl.textContent = city;

    var dateDisplayEl = document.createElement("span");
    var date = new Date(data.current.dt * 1000);
    var dateDisplay = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    dateDisplayEl.textContent = " " + dateDisplay + " ";

    var iconDisplayEl = document.createElement("img");
    iconDisplayEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");
    iconDisplayEl.setAttribute("alt", data.current.weather[0].description + " icon");

    var tempDisplayEl = document.createElement("div");
    tempDisplayEl.innerHTML = "Current temperature: " + data.current.temp + " &#176;F";

    var windDisplayEl = document.createElement("div");
    windDisplayEl.innerHTML = "Wind: " + data.current.wind_speed + " mph";

    var humidityDisplayEl = document.createElement("div");
    humidityDisplayEl.innerHTML = "Humidity: " + data.current.humidity + " %";

   
    weatherDataEl.appendChild(currentCityDivEl);

    currentCityDivEl.appendChild(currentCityH2El);

    currentCityH2El.appendChild(cityDisplayEl);
    currentCityH2El.appendChild(dateDisplayEl);
    currentCityH2El.appendChild(iconDisplayEl);

    currentCityDivEl.appendChild(tempDisplayEl);
    currentCityDivEl.appendChild(windDisplayEl);
    currentCityDivEl.appendChild(humidityDisplayEl);
   
};



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

displaySearchHistory();
/*Event Handlers (starters) */
userFormEl.addEventListener("submit", formSubmitHandler);