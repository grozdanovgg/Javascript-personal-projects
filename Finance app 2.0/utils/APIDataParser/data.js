const kraken = require('../kraken/data');
const { Router } = require('express');
const KrakenClient = require('kraken-api');
const config = require('../../config/config');


const data = {
    OHLC: (pair, exchange, interval) => {
        switch (exchange) {
            case 'kraken':
                return kraken.OHLC(pair, interval);
            default:
                console.log('in case default(not kraken)');
                break;
        }
    }
};

module.exports = data;
