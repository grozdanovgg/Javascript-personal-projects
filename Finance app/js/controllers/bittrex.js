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
import { Bittrex } from '../util/bittrexData';

let pairs = ['btc-ltc', 'btc-eth', 'btc-xrp', 'btc-rep'];


const euroToSpend = 4400;

let promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let name = pair;
    let prom = Bittrex.getDepth(name, 50);
    promArray.push(prom);
    let i1 = name.slice(0, 3);
    let i2 = pair.slice(4);
    namesArray.push(i2 + i1);
});

let ethPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=ETHEUR");
let xbtPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=XBTEUR");
let ltcPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=LTCEUR");
let repPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=REPEUR");
let xrpPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=XRPEUR");

promArray.push(ethPricePromise);
promArray.push(xbtPricePromise);
promArray.push(ltcPricePromise);
promArray.push(repPricePromise);
promArray.push(xrpPricePromise);

export function bittrexController(euroToSpend) {

    return Promise.all(promArray)
        .then(calculateRealAskBid)
}

function calculateRealAskBid(rawData) {
    let convertionCoeff = 1;
    let tickerArray = [];
    let result = {};

    let ethPricePromise = rawData[rawData.length - 5];
    let xbtPricePromise = rawData[rawData.length - 4];
    let ltcPricePromise = rawData[rawData.length - 3];
    let repPricePromise = rawData[rawData.length - 2];
    let xrpPricePromise = rawData[rawData.length - 1];

    let eurForEth = +ethPricePromise.result.XETHZEUR.a[0];
    let eurForXbt = +xbtPricePromise.result.XXBTZEUR.a[0];
    let eurForLtc = +ltcPricePromise.result.XLTCZEUR.a[0];
    let eurForRep = +repPricePromise.result.XREPZEUR.a[0];
    let eurForXrp = +xrpPricePromise.result.XXRPZEUR.a[0];

    for (let i = 0; i < rawData.length - 5; i += 1) {
        let asks = rawData[i].result.buy;
        let bids = rawData[i].result.sell;
        let mainCurrency = namesArray[i].slice(0, 3);
        let secondCurrency = namesArray[i].slice(3);
        let name = (mainCurrency + secondCurrency).toUpperCase();
        // console.log(asks);
        // LTC, REP, XRP

        if (name.slice(3) === 'ETH') {
            convertionCoeff = eurForEth;
        } else if (name.slice(3) === 'LTC') {
            convertionCoeff = eurForLtc;
        } else if (name.slice(3) === 'REP') {
            convertionCoeff = eurForRep;
        } else if (name.slice(3) === 'XRP') {
            convertionCoeff = eurForXrp;
        } else {
            convertionCoeff = eurForXbt;
        }


        // console.log(asks);
        // console.log(convertionCoeff);
        let asksEuro = asks.map(x => { return { price: (x.Rate * convertionCoeff), volume: x.Quantity, positionPrice: (x.Rate * convertionCoeff * x.Quantity) } });
        let bidsEuro = bids.map(x => { return { price: (x.Rate * convertionCoeff), volume: x.Quantity, positionPrice: (x.Rate * convertionCoeff * x.Quantity) } });
        let arrLength = 0;
        // console.log(asksEuro);
        // console.log(bidsEuro);

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

        if (name.slice(0, 3) === 'BTC') {
            name = 'XBT' + name.slice(3);
        }
        if (name.slice(3) === 'BTC') {
            name = name.slice(0, 3) + 'XBT';
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

    // console.log(tickerArray);
}






function getPairsDepth(promArray) {
    return Promise.all(promArray)
}

function getEuroCnyExchangeRate(data) {
    let cnyForEur = data.rates.CNY;
    let eurForCny = 1 / cnyForEur;
    return { cnyForEur, eurForCny }
}