var userFormEl = document.querySelector("#user-form"); 
var cityInputEl = document.querySelector("#city");

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
}

var getCityWeather = function(data,city) {

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