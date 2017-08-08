const { Router } = require('express');
const KrakenClient = require('kraken-api');
const Pair = require('../../utils/Pair');
const config = require('../../config/config');
const dataHandler = require('../../utils/DataTools/DataHandler');
const indexes = require('../../utils/DataTools/Indexes');

const showHome = (req, res) => {

    // const pairs = config.exchanges[0].pairs;
    // const interval = config.exchanges[0].interval;
    // const etheurKraken = new Pair(pairs[0], exchange);

    // Standad for pairData
    const mockupData = {
            openings: [200, 210, 220, 230, 230, 230, 240, 241, 242, 243],
            highests: [205, 215, 225, 235, 235, 235, 245, 246, 247, 248],
            lowests: [190, 200, 210, 220, 220, 220, 230, 231, 232, 233],
            closings: [202, 212, 222, 232, 232, 232, 242, 243, 244, 245],
        }
        // const testSMAArray = indexes.SMA(mockupData, 4);
    const testSDArray = indexes.BB(mockupData, 4);
    // console.log(testSMAArray);
    // console.log(testSDArray);

    // const exchanges = config.exchanges;
    // dataHandler.getAllExchangesOHCL(exchanges)
    //     .then((exchangesData) => {
    //         console.log(exchangesData[0][0].result.XETHZEUR);
    //         res.render('home', { data: exchangesData[0][0].result.XETHZEUR });
    //     })
    //     .catch((err) => {
    //         console.log('Error in home controller');
    //         return new Error(err);
    //     })
}

module.exports = { showHome };
