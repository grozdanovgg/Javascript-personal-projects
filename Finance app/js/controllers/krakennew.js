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
import { Kraken } from '../util/krakenData';

let pairs = ['ETHEUR', 'ETHXBT', 'ETCEUR', 'ETCXBT', 'ETCETH', 'REPEUR', 'REPXBT', 'REPETH', 'XBTEUR', 'ICNXBT', 'ICNETH', 'XRPEUR', 'XRPXBT', 'EOSETH', 'EOSEUR'];
// let pairs = [];
// Request.get('https://api.kraken.com/0/public/AssetPairs')
//     .then((data) => {
//         for (let ticker in data.result) {
//             console.log(ticker);
//             pairs.push(ticker.altname);
//         }
//         console.log(pairs);
//     });
// const euroToSpend = 4400;
// const ETHToSpend = 20;

let promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let prom = Kraken.getDepth(pair);
    promArray.push(prom);
    namesArray.push(pair);
});

let exchangesPromise = Request.get("http://api.fixer.io/latest");
let xbtPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=XBTEUR");
let ethPricePromise = Request.get("https://api.kraken.com/0/public/Ticker?pair=ETHEUR");

promArray.push(exchangesPromise);
promArray.push(xbtPricePromise);
promArray.push(ethPricePromise);
// console.log(promArray);

export function krakenController(moneyToSpend) {
    // console.log(moneyToSpend);
    return Promise.all(promArray)
        .then((rawData) => calculateRealAskBid(rawData, moneyToSpend))
}



function calculateRealAskBid(rawData, moneyToSpend) {
    // console.log(moneyToSpend);
    const euroToSpend = moneyToSpend.eur;
    // console.log(rawData);
    //Remove X and Z drom rowData names
    for (let i = 0; i < rawData.length - 3; i += 1) {
        let obj = rawData[i];
        let nameRaw = Object.keys(obj.result)[0];
        let indexDataObj = rawData[i].result[nameRaw];
        let mainIndex = nameRaw.slice(1, 4);
        let secondIndex = nameRaw.slice(5);
        let name = mainIndex + secondIndex;
        rawData[i].result[name] = indexDataObj;
        delete rawData[i].result[nameRaw];
    }

    let convertionCoeff = 1;
    let tickerArray = [];
    let result = {};
    let exchangePromise = rawData[rawData.length - 3];
    let xbtPricePromise = rawData[rawData.length - 2];
    let ethPricePromise = rawData[rawData.length - 1];

    // let exchangeData = getEuroTHBExchangeRate(exchangePromise);
    // let thbForEur = exchangeData.thbForEur;
    // let eurForThb = exchangeData.eurForThb;
    let eurForXbt = +xbtPricePromise.result.XXBTZEUR.a[0];
    let eurForEth = +ethPricePromise.result.XETHZEUR.a[0];

    // console.log(namesArray);
    for (let i = 0; i < rawData.length - 3; i += 1) {
        let objData = rawData[i];
        // console.log(objData);
        let nameRaw = Object.keys(objData.result)[0];
        let asks = objData.result[nameRaw].asks;
        let bids = objData.result[nameRaw].bids;
        let name = namesArray[i].toUpperCase();
        // console.log(name);

        if (name.slice(3) === 'EUR') {
            convertionCoeff = 1;
        } else if (name.slice(3) === 'ETH') {
            convertionCoeff = eurForEth;
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
            averageBidPrice = 0,
            avgAskOrigCurrency = 0,
            avgBidOrigCurrency = 0;

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

            avgAskOrigCurrency = (euroToSpend / askBoughtVolume) / convertionCoeff;
            avgBidOrigCurrency = (euroToSpend / bidSoldVolume) / convertionCoeff;
        }

        if (!result[name.slice(0, 3)]) {
            result[name.slice(0, 3)] = {};
        }
        result[name.slice(0, 3)][name] = { name, asks, bids, asksEuro, bidsEuro, averageAskPrice, averageBidPrice, avgAskOrigCurrency, avgBidOrigCurrency };
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

// function getEuroTHBExchangeRate(data) {
//     let thbForEur = data.rates.THB;
//     let eurForThb = 1 / thbForEur;
//     return { thbForEur, eurForThb }
// }