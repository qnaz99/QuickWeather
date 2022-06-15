temp = document.getElementById("temp");
temp.innerHTML = "loading...";

high = document.getElementById("high");
low = document.getElementById("low");
fl = document.getElementById("fl");
icon = document.getElementById("icon");
wind = document.getElementById("wind");
time = document.getElementById("time");
sunrise = document.getElementById("sunrise");
sunset = document.getElementById("sunset");






var today = new Date();

console.log();

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


const latlonurl = "https://geolocation-db.com/json/";
const key = '093039fc39a2f45e6c040b180c684fdc';


var lat, lon, weatherurl, iconurl;

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
            console.log(data);
            iconurl = "https://www.openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
            if (data.weather[0].icon.charAt(2) == 'n'){
                document.getElementById("ht").style.backgroundColor = "black";

                document.getElementById("ht").style.backgroundImage = "url(\"night.png\")";
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
