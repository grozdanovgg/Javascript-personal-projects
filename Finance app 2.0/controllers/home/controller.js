const { Router } = require('express');
const KrakenClient = require('kraken-api');

const showHome = (req, res) => {
    const key = '/Wssk/nmVmB8MGRXgYgajq6z26WvCSO7fiNQG5fKl7Bq78bwl6+MfgAu'; // API Key
    const secret = 'TNMOaDROEAODqKNnm4eWG1IOFAhaN37XF55/XbEL+uFPr572zQBBCUxbyJHBjF7lqClz28LJqFzrGK7c8WRy3w=='; // API Private Key
    const kraken = new KrakenClient(key, secret);
    console.log('here 0');
    (async() => {
        // Display user's balance
        console.log('here');
        // console.log(await kraken.api('Balance'));
        console.log(await kraken.api('Time'));

        // Get Ticker Info
        // console.log(await kraken.api('Ticker', { pair: 'XXBTZUSD' }))
    })();
    res.render('home');
}

module.exports = { showHome };
