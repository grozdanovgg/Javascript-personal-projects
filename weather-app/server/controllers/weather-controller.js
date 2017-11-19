const fetch = require('node-fetch')

module.exports = () => {
    return {
        getWeatherData(req, res) {
            const url = `http://api.apixu.com/v1/forecast.json?key=29d83fa2298a47d29bb121845161212&days=3&q=${req.params.city}`;
            fetch(url)
                .then((response) => {
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