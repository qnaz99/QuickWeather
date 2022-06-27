const latlonurl = "https://geolocation-db.com/json/";
const openWeatherKey = '093039fc39a2f45e6c040b180c684fdc';
const pexelKey = '563492ad6f91700001000001d90704aef5914a938e6fe3789b15da38'
var lat, lon, weatherurl, iconurl, cityurl, city, backgroundurl;
var isNight = false;

//geoDB api options
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fb582c5974mshdf634aaac906961p1af8cbjsn9ba4f484ac30',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};


temp = document.getElementById("temp");
temp.innerHTML = "Loading...";

high = document.getElementById("high");
low = document.getElementById("low");
fl = document.getElementById("fl");
icon = document.getElementById("icon");
wind = document.getElementById("wind");
time = document.getElementById("time");
loc = document.getElementById("loc");
sunrise = document.getElementById("sunrise");
sunset = document.getElementById("sunset");
searchIcon = document.getElementById("search-icon");
searchBar = document.getElementById("search-bar");
searchResults = document.getElementById("search-results");
darkTint = document.getElementById("dark-tint");
main = document.getElementById("main");


var today = new Date();

const month = {
    0  : "January",
    1  : "February",
    2  : "March",
    3  : "April",
    4  : "May",
    5  : "June",
    6  : "July",
    7  : "August",
    8  : "September",
    9  : "October",
    10 : "November",
    11 : "December" 
};





//***event listener + function to change css to show search bar when search icon is clicked***
searchIcon.addEventListener("click", showSearch);

function showSearch(){
    //console.log("here");
    
    searchBar.style.display = "flex";
    document.getElementById("loc").style.display = "none"
    searchIcon.style.display = "none";
    searchBar.focus();
}
//************************************************************************************************


//***event listener + function to hide search bar on click-away
document.getElementById("body").addEventListener("click", hideSearch);

function hideSearch(){
    if(document.activeElement != searchBar){
        searchBar.style.display = "none";
        document.getElementById("loc").style.display = "flex";
        searchIcon.style.display = "flex";
        document.getElementById("result0").innerHTML = "";
        document.getElementById("result1").innerHTML = "";
        document.getElementById("result2").innerHTML = "";
        document.getElementById("result3").innerHTML = "";
        document.getElementById("result4").innerHTML = "";
        searchResults.style.display = "none";

    }
}
//************************************************************************************************




window.addEventListener("resize", fixTintResize);

function fixTintResize(){
    //darkTint.style.width = (temp.offsetWidth + window.innerWidth*0.2) + "px";
    if (window.innerWidth < 820 ){
        darkTint.style.width = "100%"
    }
    else{
        darkTint.style.width = "50%";
    }
    //console.log(window.innerWidth);
}

fixTintResize();





searchBar.addEventListener('input', searchCityPrefix);

function searchCityPrefix(){
    //console.log(searchBar.value);
    if (searchBar.value.length > 2){
        searchResults.style.display = "block";
        fetch('https://wft-geo-db.p.rapidapi.com//v1/geo/cities?limit=5&offset=0&sort=-population&namePrefix=' + searchBar.value, options)
	    .then(response => response.json())
	    .then(response => {
		   console.log(response);
            //console.log(response.data.length)
            for (let i = 0; i < response.data.length; i++){
                resultNumber = 'result' + i;
                document.getElementById(resultNumber).innerHTML = response.data[i].city + ", " + response.data[i].country;
                document.getElementById(resultNumber).city = response.data[i].city;
                document.getElementById(resultNumber).lat  = response.data[i].latitude;
                document.getElementById(resultNumber).long  = response.data[i].longitude;
                document.getElementById(resultNumber).country  = response.data[i].country;
                document.getElementById(resultNumber).addEventListener("click", clickedSearchResult)
            }
	    })
    }
}

function clickedSearchResult(){
    searchBar.value = "";
    const newWeather = { 
        city:    this.city,
        country: this.country,
        lat:     this.lat,
        long:    this.long
    }
    getWeather(newWeather);
}


function getWeather(searchedCity){
    if (searchedCity == null){
        fetch(latlonurl).then((response) => {
            return response.json();
        })
        .then((data) => {
            lat = data.latitude;
            lon = data.longitude;
            weatherurl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherKey;
            //temp.innerHTML = lat;    
        })
        .then(() => {
            fetch(weatherurl).then((response) => {
                return response.json();
            })
            .then((data) => {
                //console.log(data);
                iconurl = "https://www.openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
                if (data.weather[0].icon.charAt(2) == 'n'){
                    isNight = true;
                }
                temp.innerHTML =   parseInt(data.main.temp     - 273.15) + "°, " + data.weather[0].description;
                high.innerHTML =   "Expected high: "    + parseInt(data.main.temp_max   - 273.15) + "°";
                low.innerHTML  =   "Expected low: "     + parseInt(data.main.temp_min   - 273.15) + "°";
                fl.innerHTML   =   "Feels like: "       + parseInt(data.main.feels_like - 273.15) + "°";
                wind.innerHTML =   "Wind: "             + parseInt(data.wind.speed*3.6) + "km/h";

                time.innerHTML =   month[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear() + " | " + today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0');
                let unixrise = data.sys.sunrise;
                let unixset  = data.sys.sunset;
                var daterise = new Date(unixrise * 1000);
                var dateset  = new Date(unixset  * 1000);
                sunrise.innerHTML = "Sunrise: " + daterise.getHours() + ":" + String(daterise.getMinutes()).padStart(2, '0') + " AM";
                sunset.innerHTML  = "Sunset: "  + dateset.getHours()  + ":" + String(dateset.getMinutes()).padStart(2, '0') + " PM";
                icon.src = iconurl;
                icon.alt = data.weather[0].main;
                cityurl = 'https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json&zoom=10';


                fetch(cityurl).then((cityData) => {
                    return cityData.json();
                })
                .then((data) => {
                    //console.log(data);
                    city = data.address.city;
                    //console.log(city);
                    loc.innerHTML = city ;

                    if (!isNight){
                        if(window.innerHeight > window.innerWidth){
                            searchUrl = 'https://api.pexels.com/v1/search?query=' + city + '&per_page=1&orientation=portrait'
                        }
                        else{
                            searchUrl = 'https://api.pexels.com/v1/search?query=' + city + '&per_page=1&orientation=landscape'
                        }
                        
                    }
                    else{
                        if(window.innerHeight > window.innerWidth){
                            searchUrl = 'https://api.pexels.com/v1/search?query=' + city + ' Night&per_page=1&orientation=portrait'
                        }
                        else{
                            searchUrl = 'https://api.pexels.com/v1/search?query=' + city + ' Night&per_page=1&orientation=landscape'
                        }
                    }
                    
                    fetch (searchUrl,{ method: 'GET', headers: {Accept: 'application/json', Authorization: pexelKey}}).then((backgroundData) =>{
                        return backgroundData.json();
                    }).then((imageData) => {
                        //console.log(imageData);
                        backgroundurl = imageData.photos[0].src.original;
                        document.getElementById("ht").style.backgroundImage = "url(" + backgroundurl +")";
                    });
                })
            })
        })
        .catch(err => {
            console.error(err);
            temp.innerHTML = "Unable to determine your location, please search"

        });
    }
    else {
        //console.log(searchedCity.country);
        //document.body.innerHTML = "";
        weatherurl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + searchedCity.lat + '&lon=' + searchedCity.long + '&appid=' + openWeatherKey;

        fetch(weatherurl).then((response) => {
            return response.json();
        })
        .then((data) => { 
            //console.log(data);

            iconurl = "https://www.openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
            if (data.weather[0].icon.charAt(2) == 'n'){
                isNight = true;
            }
            temp.innerHTML =   parseInt(data.main.temp     - 273.15) + "°, " + data.weather[0].description;
            high.innerHTML =   "Expected high: "    + parseInt(data.main.temp_max   - 273.15) + "°";
            low.innerHTML  =   "Expected low: "     + parseInt(data.main.temp_min   - 273.15) + "°";
            fl.innerHTML   =   "Feels like: "       + parseInt(data.main.feels_like - 273.15) + "°";
            wind.innerHTML =   "Wind: "             + parseInt(data.wind.speed*3.6) + "km/h";

            time.innerHTML =   month[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear() + " | " + today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0');
            let unixrise = data.sys.sunrise;
            let unixset  = data.sys.sunset;
            var daterise = new Date(unixrise * 1000);
            var dateset  = new Date(unixset  * 1000);
            sunrise.innerHTML = "Sunrise: " + daterise.getHours() + ":" + String(daterise.getMinutes()).padStart(2, '0') + " AM";
            sunset.innerHTML  = "Sunset: "  + dateset.getHours()  + ":" + String(dateset.getMinutes()).padStart(2, '0') + " PM";
            //console.log(dateset.getHours());
            icon.src = iconurl;
            icon.alt = data.weather[0].main;

            loc.innerHTML = searchedCity.city;

            if (!isNight){
                if(window.innerHeight > window.innerWidth){
                    searchUrl = 'https://api.pexels.com/v1/search?query=' + searchedCity.city + " " + searchedCity.country + '&per_page=1&orientation=portrait';
                }
                else{
                    searchUrl = 'https://api.pexels.com/v1/search?query=' + searchedCity.city + " " + searchedCity.country + '&per_page=1&orientation=landscape';
                }
                
            }
            else{
                if(window.innerHeight > window.innerWidth){
                    searchUrl = 'https://api.pexels.com/v1/search?query=' + searchedCity.city + " " + searchedCity.country + ' Night&per_page=1&orientation=portrait';
                }
                else{
                    searchUrl = 'https://api.pexels.com/v1/search?query=' + searchedCity.city + " " + searchedCity.country + ' Night&per_page=1&orientation=landscape';
                }
            }

            fetch (searchUrl,{ method: 'GET', headers: {Accept: 'application/json', Authorization: pexelKey}}).then((backgroundData) =>{
                return backgroundData.json();
            }).then((imageData) => {
                //console.log(imageData);
                backgroundurl = imageData.photos[0].src.original;
                document.getElementById("ht").style.backgroundImage = "url(" + backgroundurl +")";
            });


        })

    }
    

    
}



getWeather(null);
