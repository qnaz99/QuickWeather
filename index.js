//import { createClient } from 'pexels';
//const {createClient} = require('pexels');


const latlonurl = "https://geolocation-db.com/json/";
const key = '093039fc39a2f45e6c040b180c684fdc';
const pexelKey = '563492ad6f91700001000001d90704aef5914a938e6fe3789b15da38'
var lat, lon, weatherurl, iconurl, cityurl, city, backgroundurl;
var isNight = false;

//const client = createClient(pexelKey);

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






var today = new Date();



const month = {
    0  : "January",
    1  : "February",
    2  : "March",
    3  : "April",
    4  : "May",
    '5'  : "June",
    6  : "July",
    7  : "August",
    8  : "September",
    9  : "October",
    10 : "November",
    11 : "December" 
};







function test(){
    fetch(latlonurl).then((response) => {
        return response.json();
    })
    .then((data) => {
        lat = data.latitude;
        lon = data.longitude;
        weatherurl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + key;
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
                //document.getElementById("ht").style.backgroundColor = "black";

                //document.getElementById("ht").style.backgroundSize = "cover";


                //document.getElementById("ht").style.background = "linear-gradient(to top, #283E51, #0A2342)";
            }
            temp.innerHTML =   parseInt(data.main.temp     - 273.15) + "°, " + data.weather[0].description;
            high.innerHTML =   "Expected high: "    + parseInt(data.main.temp_max   - 273.15) + "°";
            low.innerHTML  =   "Expected low: "     + parseInt(data.main.temp_min   - 273.15) + "°";
            fl.innerHTML   =   "Feels like: "       + parseInt(data.main.feels_like - 273.15) + "°";
            wind.innerHTML =   "Wind: "             + parseInt(data.wind.speed*3.6) + "km/h";
            //var mins;
            // if (today.getMinutes().toString.length == 1){
            //     mins = "0" + today.getMinutes();
            // }
            // else{
            //     mins = today.getMinutes();
            // }
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
                loc.innerHTML = city;

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
                    //document.getElementById("ht").style.backgroundSize = "contain";
                    //document.getElementById("ht").style.height = "100%";
                    //document.getElementById("ht").style.backgroundRepeat = "no-repeat";
                    //document.getElementById("ht").style.backgroundPosition = "center";

  
                });
                //client.photos.search({ city, per_page: 1}).then((backgroundData) =>{
                //    console.log(backgroundData);
                //})
            })
        })
    })
}



test()

/* fetch(latlonurl).then((response) => {
    return response.json();
})
.then((data) => {
    lat = data.latitude;
    lon = data.longitude;
    const weatherurl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + key;
})


console.log(weatherurl); */

// async function getLatLon(latlonurl){
//     const response = await fetch(latlonurl);

//     var data = await response.json();
//     //console.log(data);
//     return data;
// }

// var data = getLatLon(latlonurl);
// console.log(data);
