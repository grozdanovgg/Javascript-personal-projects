const KrakenClient = require('kraken-api');

const key = '/Wssk/nmVmB8MGRXgYgajq6z26WvCSO7fiNQG5fKl7Bq78bwl6+MfgAu'; // API Key
const secret = 'TNMOaDROEAODqKNnm4eWG1IOFAhaN37XF55/XbEL+uFPr572zQBBCUxbyJHBjF7lqClz28LJqFzrGK7c8WRy3w=='; // API Private Key

const get = {
    OHLC: async(pair, interval) => {
        try {
            const kraken = new KrakenClient(key, secret);
            // @ts-ignore
            return await kraken.api('OHLC', { pair, interval });
        } catch (err) {
            console.log('in the error of kraken util, OHLC method');
            return console.log(err);
        }
    }
}
module.exports = get;
