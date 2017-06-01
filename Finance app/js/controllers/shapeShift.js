import $ from 'jquery';
import { Calculate } from '../calculations';
import { Ichimoku } from '../util/ichimokuAnalytics';
import { getTemplate } from '../util/templater';
import { Request } from '../util/requester';
import { tickerPoints } from '../util/tickerPoints';
import { Coloriser } from '../util/coloriser';
//@ts-ignore
import { tablesorter } from 'tablesorter';
import { Data } from '../util/Data';
import { Ticker } from '../util/Ticker';
import { Pair } from '../util/Pair';
import { CryptoJS as hmac_sha512 } from '../../node_modules/node.bittrex.api/hmac-sha512.js';
import { ShapeShift } from '../util/shapeShiftData';


let pairs = ['eth_btc', 'eth_rep', 'eth_xrp', 'eth_etc'];

// Temporary not exchanging XRP;
// let pairs = ['eth_btc', 'etc_btc', 'rep_btc', 'rep_eth', 'icn_btc', 'icn_eth', 'xrp_btc'];


const euroToSpend = 2000;

let promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let prom = ShapeShift.getDepth(pair);
    promArray.push(prom);
    namesArray.push(pair);
});

let xbtPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=XBTEUR");
let ethPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=ETHEUR");
let repPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=REPEUR");
let etcPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=ETCEUR");

promArray.push(xbtPricePromise);
promArray.push(ethPricePromise);
promArray.push(repPricePromise);
promArray.push(etcPricePromise);

export function shapeShiftController(euroToSpend) {
    return Promise.all(promArray)
        .then(calculateRealAskBid)
}



function calculateRealAskBid(rawData) {
    // console.log(rawData);

    //Remove _ from rowData names
    for (let i = 0; i < rawData.length - 4; i += 1) {
        if (rawData[i].pair) {
            let obj = rawData[i];
            // console.log(obj);
            let nameRaw = obj.pair;
            let mainIndex = nameRaw.slice(0, 3).toUpperCase();
            let secondIndex = nameRaw.slice(4).toUpperCase();
            let name = mainIndex + secondIndex;
            rawData[i].pair = name;
        }
    }

    let convertionCoeff = 1;
    let tickerArray = [];
    let result = {};
    let xbtPricePromise = rawData[rawData.length - 4];
    let ethPricePromise = rawData[rawData.length - 3];
    let repPricePromise = rawData[rawData.length - 2];
    let etcPricePromise = rawData[rawData.length - 1];

    let eurForXbt = +xbtPricePromise.result.XXBTZEUR.a[0];
    let eurForEth = +ethPricePromise.result.XETHZEUR.a[0];
    let eurForRep = +repPricePromise.result.XREPZEUR.a[0];
    let eurForEtc = +etcPricePromise.result.XETCZEUR.a[0];

    for (let i = 0; i < rawData.length - 4; i += 1) {
        if (rawData[i].pair) {
            let objData = rawData[i];
            // console.log(objData);
            let name = objData.pair;

            if (name.slice(3) === 'EUR') {
                convertionCoeff = 1;
            } else if (name.slice(3) === 'ETH') {
                convertionCoeff = eurForEth;
            } else if (name.slice(3) === 'REP') {
                convertionCoeff = eurForRep;
            } else if (name.slice(3) === 'ETC') {
                convertionCoeff = eurForEtc;
            } else {
                convertionCoeff = eurForXbt;
            }

            let averageAskPrice = objData.rate * convertionCoeff;
            let OriginalPrice = objData.rate;
            if (!result[name.slice(0, 3)]) {
                result[name.slice(0, 3)] = {};
            }
            result[name.slice(0, 3)][name] = { name, averageAskPrice, OriginalPrice };
        }
    }
    // console.log(result);
    return result;
}




function getPairsDepth(promArray) {
    return Promise.all(promArray)
}

function getEuroTHBExchangeRate(data) {
    let thbForEur = data.rates.THB;
    let eurForThb = 1 / thbForEur;
    return { thbForEur, eurForThb }
}