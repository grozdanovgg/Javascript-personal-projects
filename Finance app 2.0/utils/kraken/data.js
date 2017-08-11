const KrakenClient = require('kraken-api');
const indexes = require('../DataTools/indexes');
const config = require('../../config/config');

const key = '/Wssk/nmVmB8MGRXgYgajq6z26WvCSO7fiNQG5fKl7Bq78bwl6+MfgAu'; // API Key
const secret = 'TNMOaDROEAODqKNnm4eWG1IOFAhaN37XF55/XbEL+uFPr572zQBBCUxbyJHBjF7lqClz28LJqFzrGK7c8WRy3w=='; // API Private Key


const mockKrakenData = {
    result: {
        BTCETH: [
            [1, 1, 2, 3, 1],
            [1, 2, 3, 4, 2],
            [1, 3, 4, 5, 3],
            [1, 4, 5, 6, 4],
            [1, 5, 6, 7, 5],
            [1, 6, 7, 8, 6],
        ]
    }
}

function processKrekenData(rawData, pair, interval) {
    // console.log(rawData);
    const pairKrakenName = Object.getOwnPropertyNames(rawData.result)[0];
    const firstData = rawData.result[pairKrakenName];
    const openings = [];
    const highests = [];
    const lowests = [];
    const closings = [];

    firstData.map((moment) => {
        openings.push(+(+moment[1]).toFixed(4));
        highests.push(+(+moment[2]).toFixed(4));
        lowests.push(+(+moment[3]).toFixed(4));
        closings.push(+(+moment[4]).toFixed(4));
    });
    openings.reverse();
    highests.reverse();
    lowests.reverse();
    closings.reverse();

    const result = {
        exchange: 'kraken',
        pair,
        interval,
        openings,
        highests,
        lowests,
        closings
    };
    // console.log(result);
    const nPeriod = config.indexes.nPeriod;

    result.SMA = indexes.SMA(result, nPeriod);
    result.BB = indexes.BB(result, nPeriod);

    return result;
}

const get = {
    OHLC: async(pair, interval) => {
        try {
            const kraken = new KrakenClient(key, secret);
            // @ts-ignore
            const rawData = await kraken.api('OHLC', { pair, interval });
            const result = processKrekenData(rawData, pair, interval);
            return result;
        } catch (err) {
            console.log('in the error of kraken util, OHLC method');
            return console.log(err);
        }
    }
}
module.exports = get;
