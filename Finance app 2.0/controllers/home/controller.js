const { Router } = require('express');
const KrakenClient = require('kraken-api');
const Pair = require('../../utils/Pair');
const config = require('../../config/config');
const dataHandler = require('../../utils/DataTools/DataHandler');

const showHome = (req, res) => {

    // const pairs = config.exchanges[0].pairs;
    // const interval = config.exchanges[0].interval;
    // const etheurKraken = new Pair(pairs[0], exchange);

    const exchanges = config.exchanges;

    exchanges.forEach((exchange) => {
        dataHandler.getAllExchangePairsOHCL(exchange)
            .then((result) => {
                console.log(result);
            })
    });
    res.render('home');
}

module.exports = { showHome };
