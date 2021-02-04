var weatherRequestUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var uvDataRequestUrl = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?=";
var date = luxon.DateTime.local().toFormat('MMMM dd, yyyy');
var appId = "&appid=a4c652c907710a1f2d2945bf22dbd9fe";
var forecastAppId = "&354d52307addeb47490a94487c9e0164";
var cityInput = document.querySelector("#user-city");
var currentCity = document.querySelector("#current-city");
var currentWeather = document.querySelector("#current-weather");
var redirectUrl = './error.html';
var savedList = [" ", " ", " ", " ", " ",]
var userCity = cityInput.value;


document.querySelector("#search").addEventListener("click", function () {
    console.log("successful click!");
    var fiveday = document.querySelector("#five-day");
    fiveday.innerHTML = "";
    var userCity = cityInput.value;
    console.log(userCity);
    getData(userCity);
    saveCity();
});


$(".list-group-item").click(function () {
    console.log(this);
    console.log(this.textContent);
    var fiveday = document.querySelector("#five-day");
    fiveday.innerHTML = "";
    var userCity = this.textContent;
    console.log(userCity);
    getData(userCity);
})

function saveCity() {
    var userCity = cityInput.value;
    console.log(userCity)
    console.log(savedList)
    savedList.unshift(userCity)

    localStorage.setItem("cities", JSON.stringify(savedList));
    renderCities();
};

function renderCities() {
    var first = document.querySelector("#first");
    var second = document.querySelector("#second");
    var third = document.querySelector("#third");
    var fourth = document.querySelector("#fourth");
    var fifth = document.querySelector("#fifth");

    first.innerHTML = savedList[0];
    second.innerHTML = savedList[1];
    third.innerHTML = savedList[2];
    fourth.innerHTML = savedList[3];
    fifth.innerHTML = savedList[4];

}
function init() {

    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        savedList = storedCities;
        console.log(storedCities)
        console.log(savedList)
    } else { return }
    renderCities();
}


function getData(userCity) {
    var url = `${weatherRequestUrl}${userCity}&units=imperial${appId}`;
    fetch(url)

        .then(function (response) {
            console.log(url)
            if (response.ok) {
                console.log(response)
                response.json().then(function (data) {
                    console.log(data)
                    displayData(data)
                    getUV(data);
                    getForecast(data);
                    return data;

                });
            }
            else {
                document.location.replace(redirectUrl);
            }
        })
        .catch(function (error) {
            console.log(error)
        });

    function getUV(data) {
        var lat = data.coord.lat;
        console.log(lat);
        var lon = data.coord.lon
        console.log(lon);
        var uvUrl = `${uvDataRequestUrl}&lat=${lat}&lon=${lon}${appId}`
        console.log(uvUrl)

        fetch(uvUrl)
            .then(function (response) {
                if (response.ok) {
                    console.log(response)
                    response.json().then(function (uvData) {
                        console.log(uvData)
                        displayUvData(uvData)
                        return uvData;
                    });
                }
                else {
                    document.location.replace(redirectUrl);
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    function getForecast(data) {
        var city = data.name;
        console.log(city);
        var lat = data.coord.lat;
        console.log(lat);
        var lon = data.coord.lon
        console.log(lon);
        var forecast = `${forecastUrl}&lat=${lat}&lon=${lon}&exclude=minutely$exclude=hourly&exclude=alerts&units=imperial${appId}`
        console.log(forecast)

        fetch(forecast)
            .then(function (response) {
                if (response.ok) {
                    console.log(response)
                    response.json().then(function (forecastData) {
                        console.log(forecastData)
                        displayForecast(forecastData)
                        return forecastData;
                    });
                }
                else {
                    document.location.replace(redirectUrl);
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }

}

function displayForecast(forecastData) {
    var fiveday = document.querySelector("#five-day");
    var title = document.querySelector('#daily');
    var day1weather = forecastData.daily[0].weather[0].icon
    var day2weather = forecastData.daily[1].weather[0].icon
    var day3weather = forecastData.daily[2].weather[0].icon
    var day4weather = forecastData.daily[3].weather[0].icon
    var day5weather = forecastData.daily[4].weather[0].icon

    var day1temp = forecastData.daily[0].temp.max + "\u00B0 F"
    var day2temp = forecastData.daily[1].temp.max + "\u00B0 F"
    var day3temp = forecastData.daily[2].temp.max + "\u00B0 F"
    var day4temp = forecastData.daily[3].temp.max + "\u00B0 F"
    var day5temp = forecastData.daily[4].temp.max + "\u00B0 F"

    var day1humidity = forecastData.daily[0].humidity + "%"
    var day2humidity = forecastData.daily[1].humidity + "%"
    var day3humidity = forecastData.daily[2].humidity + "%"
    var day4humidity = forecastData.daily[3].humidity + "%"
    var day5humidity = forecastData.daily[4].humidity + "%"

    var dailytemps = [day1temp, day2temp, day3temp, day4temp, day5temp];
    var humidity = [day1humidity, day2humidity, day3humidity, day4humidity, day5humidity];
    var images = [day1weather, day2weather, day3weather, day4weather, day5weather]

    title.textContent = "5-Day Forecast"

    for (var i = 0; i < dailytemps.length; i++) {
        var card = document.createElement('div');
        card.className = ' col-auto card text-white bg-primary m-2';
        card.style = 'width: 12rem;';
        var body = document.createElement('div');
        body.className = 'card-body';
        card.appendChild(body);
        var heading = document.createElement('h5');
        heading.className = 'card-title';
        heading.textContent = luxon.DateTime.local().plus({ days: [i] }).toFormat('MMMM dd, yyyy');
        body.appendChild(heading);
        var temp = document.createElement('h6');
        temp.className = 'card-text';
        temp.textContent = "High: " + dailytemps[i];
        var hum = document.createElement('h6');
        hum.className = 'card-text';
        hum.textContent = "Humidity: " + humidity[i];
        var img = document.createElement('img');
        img.src = "./Assets/images" + images[i] + ".png";

        body.appendChild(heading)
        body.appendChild(img)
        body.appendChild(temp)
        body.appendChild(hum)
        fiveday.append(card)
    }

}

function displayData(data) {
    currentCity.textContent = data.name;
    currentCity.append(" " + date);

    var temp = document.querySelector('#temp');
    temp.textContent = "Temperatue: " + data.main.temp + "\u00B0 F";
    temp.className = "fs-3"


    var humidity = document.querySelector('#humidity');
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    humidity.className = "fs-3"

    var wind = document.querySelector('#wind');
    wind.textContent = "Wind Speed: " + data.wind.speed + "mph";
    wind.className = "fs-3"
}

function displayUvData(uvData) {
    var uvValue = uvData.value

    var uv = document.querySelector('#uv');
    uv.textContent = "UV Index: ";
    uv.className = 'fs-3';


    var uvIndex = document.querySelector('#uvindex');
    uvIndex.textContent = uvValue;
    uvIndex.className = 'fs-3';

    if (uvValue > 11) {
        uvIndex.style.backgroundColor = "purple"
        uvIndex.className = 'fs-3 text-light'
    }
    else if (uvValue > 8) {
        uvIndex.style.backgroundColor = "red"
        uvIndex.className = 'fs-3 text-light'
    }
    else if (uvValue > 6) {
        uvIndex.style.backgroundColor = "orange"
    }
    else if (uvValue > 3) {
        uvIndex.style.backgroundColor = "yellow"
    }
    else {
        uvIndex.style.backgroundColor = "green"
        uvIndex.className = 'fs-3 text-light'
    }

}

init();