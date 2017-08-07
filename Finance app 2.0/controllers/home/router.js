const { Router } = require('express');
const controller = require('./controller');

const attach = (app) => {
    const router = new Router();
    router
        .get('/', (req, res) => {
            controller.showHome(req, res)
        })
    app.use('/', router);
}

module.exports = { attach };
