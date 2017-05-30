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

let pairs = [{ "id": "btccny", "name": "BTC/CNY" }, { "id": "ethcny", "name": "ETH/CNY" }, { "id": "dgdcny", "name": "DGD/CNY" }, { "id": "btscny", "name": "BTS/CNY" }, { "id": "dcscny", "name": "DCS/CNY" }, { "id": "sccny", "name": "SC/CNY" }, { "id": "etccny", "name": "ETC/CNY" }, { "id": "1stcny", "name": "1SŦ/CNY" }, { "id": "repcny", "name": "REP/CNY" }, { "id": "anscny", "name": "ANS/CNY" }, { "id": "zeccny", "name": "ZEC/CNY" }, { "id": "zmccny", "name": "ZMC/CNY" }, { "id": "gntcny", "name": "GNT/CNY" }, { "id": "qtumcny", "name": "QTUM/CNY" }]

var url = 'https://yunbi.com//api/v2/depth.json?market=btccny&limit=50';

let promArray = [],
    namesArray = [],
    cnyForEur = 7.64,
    eurForCny = 0.1308;

pairs.forEach(pair => {
    let name = pair.id;
    let prom = Yunbi.getDepth(name, 500);
    promArray.push(prom);
    namesArray.push(name);
});

const euroToSpend = 1000;
export function yunbiController() {
    // let exchanges = Request.get("http://api.fixer.io/latest")
    //     .then(getEuroCnyExchangeRate);

    return Promise.all(promArray)
        .then(calculateRealAskBid)
}

function calculateRealAskBid(rawData) {
    let tickerArray = [];
    let result = {};
    // console.log(rawData);


    for (let i = 0; i < rawData.length; i += 1) {
        let asks = rawData[i].asks.reverse();
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
        result[name] = { name, asks, bids, asksEuro, bidsEuro, averageAskPrice, averageBidPrice };
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
    cnyForEur = data.rates.CNY;
    eurForCny = 1 / cnyForEur;
    return { cnyForEur, eurForCny }
}