const express = require('express')
const app = express()
const path = require('path');
const forceSSL = require('force-ssl-heroku');
const weatherController = require('./controllers/weather-controller.js')();

// console.log(weatherController.getWeatherData());
// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
app.use(forceSSL);

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/../dist'));

// Routing
app.get('/api/v1/weather/:city', weatherController.getWeatherData);

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.use('/', (req, res) => {
    res
        .status(200)
        .sendFile(path.join(__dirname, '/../dist/index.html'));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080, () => console.log('Weather app listening on port 8080'));
