const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const home = require('../controllers/home/router');

const init = (serverConnfig) => {

    const app = express();
    app.use(express.static(__dirname));
    app.use('/static', express.static(path.join(__dirname, './static')));
    app.use('/libs', express.static(path.join(__dirname, './node_modules')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('views');
    app.set('view engine', 'pug');


    home.attach(app);

    return Promise.resolve(app);
}

module.exports = { init };
