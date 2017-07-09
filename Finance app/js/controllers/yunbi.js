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
import { Yunbi } from '../util/yunbiData';

let pairs = [{ "id": "btccny", "name": "BTC/CNY" }, { "id": "ethcny", "name": "ETH/CNY" }, { "id": "dgdcny", "name": "DGD/CNY" }, { "id": "etccny", "name": "ETC/CNY" }, { "id": "repcny", "name": "REP/CNY" }, { "id": "eoscny", "name": "EOS/CNY" }, { "id": "zeccny", "name": "ZEC/CNY" }]

// var url = 'https://yunbi.com//api/v2/depth.json?market=btccny&limit=50';

// const euroToSpend = 4400;
// const ETHToSpend = 20;

let promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let name = pair.id;
    let prom = Yunbi.getDepth(name, 500);
    promArray.push(prom);
    namesArray.push(name);
});
// cnyForEur = 7.64,
// eurForCny = 0.1308;

let exchangesPromise = Request.get("http://api.fixer.io/latest");
promArray.push(exchangesPromise);

export function yunbiController(moneyToSpend) {

    return Promise.all(promArray)
        .then((rawData) => calculateRealAskBid(rawData, moneyToSpend))
}

function calculateRealAskBid(rawData, moneyToSpend) {
    const euroToSpend = moneyToSpend.eur;

    let tickerArray = [];
    let result = {};
    let exchangePromise = rawData[rawData.length - 1];

    let exchangeData = getEuroCnyExchangeRate(exchangePromise);
    let cnyForEur = +exchangeData.cnyForEur;
    let eurForCny = +exchangeData.eurForCny;


    for (let i = 0; i < rawData.length - 1; i += 1) {
        let asks = rawData[i].asks.slice().reverse();
        let bids = rawData[i].bids;
        let name = namesArray[i].toUpperCase();

        // console.log(eurForCny);
        let asksEuro = asks.map(x => { return { price: (x[0] * eurForCny), volume: x[1], positionPrice: (x[0] * eurForCny * x[1]) } });
        let bidsEuro = bids.map(x => { return { price: (x[0] * eurForCny), volume: x[1], positionPrice: (x[0] * eurForCny * x[1]) } });
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

            avgAskOrigCurrency = (euroToSpend / askBoughtVolume) * cnyForEur;
            avgBidOrigCurrency = (euroToSpend / bidSoldVolume) * cnyForEur;
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

        result[name.slice(0, 3)][name] = { name, asks, bids, asksEuro, bidsEuro, averageAskPrice, averageBidPrice, avgAskOrigCurrency, avgBidOrigCurrency };
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