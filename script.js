const API_ID  = "99e7ff8fb1279abf56cc487aa14808d1"

const currentWeather = document.querySelector(".weather-data .current-weather");
const sysDate = document.querySelector(".date");
const btn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherList = document.querySelector(".weather-cards");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


// // display date
let day = new Date();
let month = day.toLocaleString("default",{month:"long"});
let date = day.getDate();
let year = day.getFullYear();
sysDate.textContent = `${date} ${month} ${year}`;

//add event
btn.addEventListener("click",()=>{

    //check empty value
    if(cityInput.value !== ""){
        const search = cityInput.value;
        cityInput.value = "";
        findLocation(search);
    }
});

const findLocation = async (name) =>{
    try{
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_ID}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if(result.cod !== "404"){
            const updatedHtml = displayImageContent(result);
            displayForeCast(result.coord.lat, result.coord.lon);

            currentWeather.innerHTML = updatedHtml;
        }
        else{
            const errorHtml = defaultContent(result.cod,result.message);

            currentWeather.innerHTML = errorHtml;
        }
        
    }catch(error){
        
    }
}

// display image content and temp
const displayImageContent = (data) =>{
           return  `<div class="details">
                    <h3 class="title">City : ${data.name}</h3>
                    <h6>Temp : ${Math.round(data.main.temp-275.15)} °C</h6>
                    <h6>Max : ${Math.round(data.main.temp_max-275.15)} °C</h6>
                    <h6>Min : ${Math.round(data.main.temp_min-275.15)} °C</h6>
                    <h6>Humidity : ${data.main.humidity}%</h6>
                    <h6>Wind Speed : ${data.wind.speed} m/s</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"></img>
                    <h6>${data.weather[0].description}</h6>
                </div>`
};

const defaultContent = (code,message) =>{
    return  `<div class="details">
                    <h3 class="title">City : ${message}</h3>
                    <h6>Temp : ${code}°C</h6>
                    <h6>Max : X°C</h6>
                    <h6>Min : X°C</h6>
                    <h6>humidity : 0%</h6>
                    <h6>Wind Speed : 0m/s</h6>
                </div>`
};

const displayForeCast = async (lat,long) =>{
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_ID}`
    const data = await fetch(ForeCast_API);
        const result = await data.json();
        
        //filter the forecast
        const uniqueForeCastDays = [];
        const daysForecast = result.list.filter((forecast) =>{
            const foreCastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForeCastDays.includes(foreCastDate)){
                return uniqueForeCastDays.push(foreCastDate);
            }
        });
        weatherList.innerHTML = "";
        daysForecast.forEach((content,index) =>{
            if(index<=4){
                weatherList.insertAdjacentHTML("beforeend",foreCast(content));
            }
        });
    
}


// forecast html element data
const foreCast = (frContent) =>{
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("",3);
    const joinDay = splitDay.join("");
        return  `<li class="card">
                <h6>${joinDay}</h6>
                <h6>${Math.round(frContent.main.temp-275.15)} °C</h6>
                <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png"></img>
                <h6 class="desc">${frContent.weather[0].description}</h6>
                </li>`
};
