const KrakenClient = require('kraken-api');
const indexes = require('../DataTools/indexes');
const config = require('../../config/config');

const key = '/Wssk/nmVmB8MGRXgYgajq6z26WvCSO7fiNQG5fKl7Bq78bwl6+MfgAu'; // API Key
const secret = 'TNMOaDROEAODqKNnm4eWG1IOFAhaN37XF55/XbEL+uFPr572zQBBCUxbyJHBjF7lqClz28LJqFzrGK7c8WRy3w=='; // API Private Key


const mockKrakenData = {
    result: {
        BTCETH: [
            // [1, 1, 2, 3, 86.16],
            // [1, 1, 2, 3, 89.09],
            // [1, 1, 2, 3, 88.78],
            // [1, 1, 2, 3, 90.32],
            // [1, 1, 2, 3, 89.07],
            // [1, 1, 2, 3, 91.15],
            // [1, 1, 2, 3, 89.44],
            // [1, 1, 2, 3, 89.18],
            // [1, 1, 2, 3, 86.93],
            // [1, 1, 2, 3, 87.68],
            // [1, 1, 2, 3, 86.96],
            // [1, 1, 2, 3, 89.43],
            // [1, 1, 2, 3, 89.32],
            // [1, 1, 2, 3, 88.72],
            // [1, 1, 2, 3, 87.45],
            // [1, 1, 2, 3, 87.26],
            // [1, 1, 2, 3, 89.50],
            // [1, 1, 2, 3, 87.90],
            // [1, 1, 2, 3, 89.13],
            // [1, 1, 2, 3, 90.70],
            // [1, 1, 2, 3, 92.90],
            // [1, 1, 2, 3, 92.98],
            // [1, 1, 2, 3, 91.80],
            // [1, 1, 2, 3, 92.66],
            // [1, 1, 2, 3, 92.68],
            // [1, 1, 2, 3, 92.30],
            // [1, 1, 2, 3, 92.77],
            // [1, 1, 2, 3, 92.54],
            // [1, 1, 2, 3, 92.95],
            // [1, 1, 2, 3, 93.20],
            // [1, 1, 2, 3, 91.07],
            // [1, 1, 2, 3, 89.83],
            // [1, 1, 2, 3, 89.74],
            // [1, 1, 2, 3, 90.40],
            // [1, 1, 2, 3, 90.74],
            // [1, 1, 2, 3, 88.02],
            // [1, 1, 2, 3, 88.09],
            // [1, 1, 2, 3, 88.84],
            // [1, 1, 2, 3, 90.78],
            // [1, 1, 2, 3, 90.54],
            // [1, 1, 2, 3, 91.39],
            // [1, 1, 2, 3, 90.65],
            [1, 1, 2, 3, 22.2734],
            [1, 1, 2, 3, 22.194],
            [1, 1, 2, 3, 22.0847],
            [1, 1, 2, 3, 22.1741],
            [1, 1, 2, 3, 22.184],
            [1, 1, 2, 3, 22.1344],
            [1, 1, 2, 3, 22.2337],
            [1, 1, 2, 3, 22.4323],
            [1, 1, 2, 3, 22.2436],
            [1, 1, 2, 3, 22.2933],
            [1, 1, 2, 3, 22.1542],
            [1, 1, 2, 3, 22.3926],
            [1, 1, 2, 3, 22.3816],
            [1, 1, 2, 3, 22.6109],
            [1, 1, 2, 3, 23.3558],
            [1, 1, 2, 3, 24.0519],
            [1, 1, 2, 3, 23.753],
            [1, 1, 2, 3, 23.8324],
            [1, 1, 2, 3, 23.9516],
            [1, 1, 2, 3, 23.6338],
            [1, 1, 2, 3, 23.8225],
            [1, 1, 2, 3, 23.8722],
            [1, 1, 2, 3, 23.6537],
            [1, 1, 2, 3, 23.187],
            [1, 1, 2, 3, 23.0976],
            [1, 1, 2, 3, 23.326],
            [1, 1, 2, 3, 22.6805],
            [1, 1, 2, 3, 23.0976],
            [1, 1, 2, 3, 22.4025],
            [1, 1, 2, 3, 22.1725]
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
    result.SD = indexes.SD(result, nPeriod);
    result.EMA = indexes.EMA(result, nPeriod);

    return result;
}

const get = {
    OHLC: async(pair, interval) => {
        try {
            // const kraken = new KrakenClient(key, secret);
            // // @ts-ignore
            // const rawData = await kraken.api('OHLC', { pair, interval });
            const result = processKrekenData(mockKrakenData, pair, interval);
            return result;
        } catch (err) {
            console.log('in the error of kraken util, OHLC method');
            return console.log(err);
        }
    }
}
module.exports = get;
