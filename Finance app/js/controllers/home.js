import { krakenController } from '../controllers/krakennew'
import { bittrexController } from '../controllers/bittrex';
import { yunbiController } from '../controllers/yunbi';
import { bxinController } from '../controllers/bxin';

function diff(arr, arr2) {
    var ret = [];
    arr.sort();
    arr2.sort();
    for (var i = 0; i < arr.length; i += 1) {
        if (arr2.indexOf(arr[i]) > -1) {
            ret.push(arr[i]);
        }
    }
    return ret;
}

export function homeController() {

    let p1 = krakenController(),
        p2 = yunbiController(),
        p3 = bxinController();
    Promise.all([p1, p2, p3])
        .then((data) => {
            let krakenData = data[0],
                yunbiData = data[1],
                bxinData = data[2],
                krakenTickers = [],
                yunbiTickers = [],
                bxinTickers = [],
                yunbiCommonTickers = [],
                bxinCmmonTickers = [];
            console.log(krakenData);
            console.log(yunbiData);
            console.log(bxinData);

            for (let i in krakenData) {
                let ticker = krakenData[i];
                // console.log(ticker);
                krakenTickers.push(ticker.name);
            }

            for (let ticker in yunbiData) {
                if (yunbiData[ticker].name === 'BTCCNY') {
                    yunbiData[ticker].name = 'XBTCNY';
                }

                // yunbiTickers.push(yunbiData[ticker].name);
                // yunbiData[yunbiData[ticker].name.slice(0, 3)] = yunbiData[ticker];
                // delete yunbiData[ticker];
            }


            for (let i in bxinData) {
                let ticker = bxinData[i];

                if (ticker.name === 'BTCTHB') {
                    ticker.name = 'XBTTHB';
                }
                if (ticker.name === 'ETHBTC') {
                    ticker.name = 'ETHXBT';
                }
                // bxinTickers.push(ticker.name);
                // // // console.log(bxinData[bxinData[ticker].name.slice(0, 3)]);
                // let tickerName = ticker.name.slice(0, 3);
                // // console.log(tickerName);
                // if (bxinData[tickerName]) {
                //     bxinData[tickerName][ticker.name] = ticker;
                //     delete bxinData[i];
                // } else {
                //     bxinData[tickerName] = {};
                //     bxinData[tickerName][ticker.name] = ticker;
                //     delete bxinData[i];
                // }


            }

            yunbiCommonTickers = diff(yunbiTickers, krakenTickers);
            bxinCmmonTickers = diff(bxinTickers, krakenTickers);
            console.log(yunbiCommonTickers);
            console.log(bxinCmmonTickers);
            // console.log(bxinTickers);
            // console.log(commonTickers);
            // console.log(krakenData);
            // console.log(yunbiData);

            yunbiCommonTickers.forEach((ticker) => {
                console.log(ticker);
                let tick = {
                    ticker,
                    askKraken: krakenData[ticker].diference.minAsk.priceEUR,
                    askYunbi: yunbiData[ticker].averageAskPrice,
                    bidKraken: krakenData[ticker].diference.maxBid.priceEUR,
                    bidYunbi: yunbiData[ticker].averageBidPrice,
                    diference: { yunbi: yunbiData[ticker].averageBidPrice - krakenData[ticker].diference.minAsk.priceEUR, bxin: bxinData[ticker].averageBidPrice - krakenData[ticker].diference.minAsk.priceEUR },
                    percentage: { yunbi: (yunbiData[ticker].averageBidPrice / krakenData[ticker].diference.minAsk.priceEUR - 1) * 100, bxin: (bxinData[ticker].averageBidPrice / krakenData[ticker].diference.minAsk.priceEUR - 1) * 100 }
                }

                console.log(tick);

                // console.log(krakenData[ticker]);
                // console.log(yunbiData[ticker]);
                console.log('----------');

            })


        })






}