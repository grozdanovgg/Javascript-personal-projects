const fetch = require('node-fetch')
const utf8 = require('utf8');
const weatherConfig = require('../config/weather-config');
module.exports = () => {
    return {
        getWeatherData(req, res) {
            const url = weatherConfig.baseUrl + req.params.city;
            const urlEncoded = utf8.encode(url);
            fetch(urlEncoded)
                .then((response) => {
                    // response.json().then(res => console.log(res));
                    return response.json();
                })
                .then((json) => {
                    return res.status(200)
                        .json({ results: json });
                })
                .catch((err) => {
                    return res.status(400)
                        .json({ errorMessage: 'Could not fetch weather data!' });
                })
        }
    }
}