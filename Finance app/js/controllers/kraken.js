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

export function krakenController() {

    const sellAmmountEuro = 100;

    const pairsArray = ['ETHEUR', 'ETHXBT', 'ETCEUR', 'ETCXBT', 'ETCETH', 'REPEUR', 'REPXBT', 'REPETH', 'XBTEUR', 'ICNXBT', 'ICNETH'];

    Data.getKrakenData("https://api.kraken.com/0/public/Ticker?pair=", pairsArray)
        .then(extractData)
        .then((data) => { console.log(data); return data; })
        .then(tickerGetEuroPrices)
        .then(tickerAddMathData)
        .then(findBiggestDiference)
        .then(suggestAction)
}



function suggestAction(data) {
    console.log(data);

    let stepOne,
        stepTwo,
        stepThree,
        stepFour,
        percent = data.bestTicker.diference.percent;

    // if (percent < 0) {

    console.log(percent);
    // } else {

    let tempIndex = data.bestTicker.diference.maxBid.pair.slice(3) + data.bestTicker.diference.minAsk.pair.slice(3);
    console.log(tempIndex);
    if (tempIndex.slice(0, 3) === tempIndex.slice(3)) {
        throw Error("Miax Bid and Min Ask are from the same pair");
    }
    let tempIndexPrice = data.tickers[tempIndex.slice(0, 3)].prices[tempIndex].ask;
    // console.log(tempIndex);
    // console.log(tempIndexPrice);
    stepOne = `Buy ${data.bestTicker.diference.minAsk.pair.slice(0,3)} with ${data.bestTicker.diference.minAsk.pair.slice(3)} at ${data.bestTicker.diference.minAsk.price}`;
    stepTwo = `Sell ${data.bestTicker.diference.maxBid.pair.slice(0,3)} for ${data.bestTicker.diference.maxBid.pair.slice(3)} at ${data.bestTicker.diference.maxBid.price}`;
    stepThree = `Sell ${data.bestTicker.diference.maxBid.pair.slice(3)} for ${data.bestTicker.diference.minAsk.pair.slice(3)} at ${tempIndexPrice}`;
    // stepFour = `Buy ${ticker.diference.minAsk.pair}`;

    console.log('Step 1: ' + stepOne);
    console.log('Step 2: ' + stepTwo);
    console.log('Step 3: ' + stepThree);
    // console.log('Step 4: ' + stepFour);
    // }

}

function findBiggestDiference(tickers) {

    let ticker,
        maxDiference = Number.MIN_SAFE_INTEGER,
        result;
    for (let i in tickers) {
        ticker = tickers[i];
        let percent = ticker.diference.percent;
        if (percent > maxDiference) {
            maxDiference = percent;
            result = ticker;
        }
    }
    // console.log(result);
    return { bestTicker: result, tickers };

}

function tickerAddMathData(tickersArray) {
    let tickers = {},
        diference = {},
        name;

    tickersArray.forEach(ticker => {
        let minAsk = Number.MAX_SAFE_INTEGER,
            maxBid = Number.MIN_SAFE_INTEGER,
            diference = {};
        for (let i in ticker.prices) {

            let EURAsk = ticker.prices[i].EURAsk,
                EURBid = ticker.prices[i].EURBid,
                ask = ticker.prices[i].ask,
                bid = ticker.prices[i].bid;

            if (ask < minAsk) {
                minAsk = EURAsk;
                diference.minAsk = { pair: i, priceEUR: minAsk, price: ask }
            }
            if (bid > maxBid) {
                maxBid = EURBid;
                diference.maxBid = { pair: i, priceEUR: maxBid, price: bid }
            }
            diference.net = maxBid - minAsk;
            diference.percent = ((maxBid / minAsk) - 1) * 100;
        }
        // console.log(diference);
        ticker.diference = diference;
    })

    //Convert array to obj if needed:
    tickersArray.forEach(obj => {
        tickers[obj.name] = obj;
    })
    return tickers;

}

function tickerGetEuroPrices(pairsArray) {

    let resultArray = [];

    let tickers = {};

    for (let pair of pairsArray) {

        let prices = {},
            euroCoeficient = 1,
            pairOutCurency = pair.name.slice(3),
            pairMainCurency = pair.name.slice(0, 3),
            symbol = pairMainCurency + pairOutCurency,
            ticker;

        if (pairOutCurency !== 'EUR') {
            let target = pairsArray.find(i => { return i.name === `${pairOutCurency}EUR` });
            euroCoeficient = target.askPrice;
        }

        prices[symbol] = {
            ask: pair.askPrice,
            bid: pair.bidPrice,
            EURAsk: pair.askPrice * euroCoeficient,
            EURBid: pair.bidPrice * euroCoeficient
        };

        if (resultArray.length > 0) {
            ticker = resultArray.find((ticker) => { return ticker.name === pairMainCurency })
            if (!ticker) {
                ticker = new Ticker(pairMainCurency);
                resultArray.push(ticker);
            }
        } else {
            ticker = new Ticker(pairMainCurency);
            resultArray.push(ticker);
        }
        if (ticker.prices) {
            ticker.prices[symbol] = prices[symbol];
        } else {
            ticker.prices = prices;
        }
    }

    //Convert array to obj if needed!

    // resultArray.forEach(obj => {
    //     tickers[obj.name] = obj;
    // })
    // return tickers;
    // console.log(resultArray);
    return resultArray;
};

function extractData(data) {

    let resultArray = [],
        indexName,
        askPrice,
        bidPrice;
    for (let index in data.result) {
        indexName = index.slice(1, 4) + index.slice(5);
        askPrice = +data.result[index].a[0];
        bidPrice = +data.result[index].b[0];
        let ticker = new Pair(indexName, askPrice, bidPrice);
        resultArray.push(ticker);
    }
    // console.log(resultArray);
    return resultArray;
}







// function findDiferences(tickersCombinedPrices) {
//     let combinedTicker;
//     for (let i in tickersCombinedPrices) {
//         let min = Number.MAX_SAFE_INTEGER,
//             max = Number.MIN_SAFE_INTEGER,
//             diference;
//         combinedTicker = tickersCombinedPrices[i];

//         for (let j in combinedTicker.pricesInEuro) {
//             let pairPrice = combinedTicker.pricesInEuro[j];
//             if (pairPrice < min) {
//                 min = pairPrice;
//             }
//             if (pairPrice > max) {
//                 max = pairPrice;
//             }

//             diference = max - min;
//             combinedTicker.diference = diference;
//             combinedTicker.diferencePercentage = ((max / min) - 1) * 100;
//         }
//     }
//     return tickersCombinedPrices;
// }


// .then((templateData) => {

//     getTemplate('kraken')
//         .then((template) => {
//             $('#data').html(template(templateData));
//         })
//         .then(() => {
//             $("#main-table").tablesorter();
//         })
//         .then(() => {
//             $('.table-body').on('click', (clicked) => {
//                 let clickedTarget = clicked.target.parentElement;
//                 $('.info').removeClass('info');
//                 $(clickedTarget).addClass('info');
//             })
//         })
// })