import axios from 'axios';

const API_KEY = 'bea584add64b7aea06bbfc2e6846a522' 

const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/weather',
    headers: {
        "Access-Control-Allow-Origin": "*"
    }

})

export const getWeatherData = (city: string) => {
    return instance.get(`?q=${city}&appid=${API_KEY}`).then(response => response.data).catch(error => console.log(error))
}
