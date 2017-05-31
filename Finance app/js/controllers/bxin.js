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
import { Bxin } from '../util/bxinData';

let pairs = [{ "id": "1", "name": "BTCTHB" }, { "id": "21", "name": "ETHTHB" }, { "id": "20", "name": "ETHBTC" }, { "id": "25", "name": "XRPTHB" }]


const euroToSpend = 2000;

let promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let id = pair.id;
    let prom = Bxin.getDepth(id);
    promArray.push(prom);
    namesArray.push(pair.name);
});

let exchangesPromise = Request.get("http://api.fixer.io/latest");
let xbtPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=XBTEUR");

promArray.push(exchangesPromise);
promArray.push(xbtPricePromise);


export function bxinController(euroToSpend) {
    return Promise.all(promArray)
        .then(calculateRealAskBid)
}



function calculateRealAskBid(rawData) {
    let convertionCoeff = 1;
    let tickerArray = [];
    let result = {};
    let exchangePromise = rawData[rawData.length - 2];
    let xbtPricePromise = rawData[rawData.length - 1];

    let exchangeData = getEuroTHBExchangeRate(exchangePromise);
    let thbForEur = exchangeData.thbForEur;
    let eurForThb = exchangeData.eurForThb;
    let eurForXbt = xbtPricePromise.result.XXBTZEUR.a[0];
    // console.log(namesArray);
    for (let i = 0; i < rawData.length - 2; i += 1) {
        let objData = JSON.parse(rawData[i]);
        // console.log(objData);
        let asks = objData.asks;
        let bids = objData.bids;
        let name = namesArray[i].toUpperCase();
        // console.log(name);

        if (name.slice(3) === 'THB') {
            convertionCoeff = eurForThb;
        } else {
            convertionCoeff = eurForXbt;
        }
        let asksEuro = asks.map(x => { return { price: (x[0] * convertionCoeff), volume: x[1], positionPrice: (x[0] * convertionCoeff * x[1]) } });
        let bidsEuro = bids.map(x => { return { price: (x[0] * convertionCoeff), volume: x[1], positionPrice: (x[0] * convertionCoeff * x[1]) } });
        let arrLength = 0;

        if (asksEuro.length < bidsEuro.length) {
            arrLength = asksEuro.length;
        } else {
            arrLength = bidsEuro.length;
        }

        let realPriceForMyOrder = 0,
            askBoughtVolume = 0,
            bidSoldVolume = 0,
            remainingAskMoney = euroToSpend,
            remainingBidMoney = euroToSpend,
            averageAskPrice = 0,
            averageBidPrice = 0;

        for (let j = 0; j < arrLength; j += 1) {

            let askPositionPrice = asksEuro[j].positionPrice;
            let bidPositionPrice = bidsEuro[j].positionPrice;

            if (askPositionPrice < remainingAskMoney) {
                askBoughtVolume += +asksEuro[j].volume;
                remainingAskMoney -= askPositionPrice;
            } else {
                askBoughtVolume += +(remainingAskMoney / asksEuro[j].price);
                remainingAskMoney = 0;
            }

            if (bidPositionPrice < remainingBidMoney) {
                bidSoldVolume += +bidsEuro[j].volume;
                remainingBidMoney -= bidPositionPrice;
            } else {
                bidSoldVolume += +(remainingBidMoney / bidsEuro[j].price);
                remainingBidMoney = 0;
            }

            averageAskPrice = euroToSpend / askBoughtVolume;
            averageBidPrice = euroToSpend / bidSoldVolume;
        }

        if (!result[name.slice(0, 3)]) {
            result[name.slice(0, 3)] = {};
        }

        result[name.slice(0, 3)][name] = { name, asks, bids, asksEuro, bidsEuro, averageAskPrice, averageBidPrice };
        // console.log({ name, asks, bids, asksEuro, bidsEuro, averageAskPrice, averageBidPrice });
        // console.log(averageAskPrice);
        // console.log('------------------');
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