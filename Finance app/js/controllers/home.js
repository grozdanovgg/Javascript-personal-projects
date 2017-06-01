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
                bxinCmmonTickers = [],
                yunbiArbitrage = {},
                bxInArbitrage = {};
            // console.log('Kraken:');
            // console.log(krakenData);
            // console.log('Yunbi:');
            // console.log(yunbiData);
            // console.log('bx.in:');
            // console.log(bxinData);

            krakenTickers = Object.keys(krakenData);
            yunbiTickers = Object.keys(yunbiData);
            bxinTickers = Object.keys(bxinData);

            // for (let i in krakenData) {
            //     let ticker = krakenData[i];
            //     // console.log(ticker);
            //     // krakenTickers.push(ticker.name);
            // }

            for (let ticker in yunbiData) {
                // let key = Object.keys(yunbiData)[ticker];
                // console.log(key);
                // console.log(yunbiData);
                // console.log(ticker);
                // console.log(yunbiData[ticker]);
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
            }
            yunbiCommonTickers = diff(yunbiTickers, krakenTickers);
            bxinCmmonTickers = diff(bxinTickers, krakenTickers);

            //To fix only EURO price get....
            // console.log(yunbiData);
            // console.log(bxinData);



            krakenTickers.forEach((ticker) => {
                // console.log(ticker);
                // console.log(krakenData[ticker][ticker + 'EUR']);
                // console.log(yunbiData[ticker][ticker + 'CNY']);
                // console.log('----------');]

                // console.log(`----------------------------${ticker} arbitrage:`);
                if (yunbiData[ticker] && krakenData[ticker]) {
                    if (krakenData[ticker][ticker + 'EUR'] && yunbiData[ticker][ticker + 'CNY']) {

                        yunbiArbitrage[ticker] = {
                            askKraken: krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            askYunbi: yunbiData[ticker][ticker + 'CNY'].averageAskPrice,
                            bidKraken: krakenData[ticker][ticker + 'EUR'].averageBidPrice,
                            bidYunbi: yunbiData[ticker][ticker + 'CNY'].averageBidPrice,
                            diference: yunbiData[ticker][ticker + 'CNY'].averageBidPrice - krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            percentage: (yunbiData[ticker][ticker + 'CNY'].averageBidPrice / krakenData[ticker][ticker + 'EUR'].averageAskPrice - 1) * 100
                        }



                        // console.log(`                      Yunbi/Kraken is ${yunbiArbitrage[ticker].percentage.toFixed(2)}%`);
                        // console.log(yunbiArbitrage);
                    }
                };
                // console.log(ticker);
                // console.log(bxinData[ticker]);
                // console.log(krakenData[ticker]);
                // console.log(bxinData);
                // console.log(krakenData);
                if (bxinData[ticker] && krakenData[ticker]) {
                    if (krakenData[ticker][ticker + 'EUR'] && bxinData[ticker][ticker + 'THB']) {
                        bxInArbitrage[ticker] = {
                            askKraken: krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            askBxin: bxinData[ticker][ticker + 'THB'].averageAskPrice,
                            bidKraken: krakenData[ticker][ticker + 'EUR'].averageBidPrice,
                            bidBxin: bxinData[ticker][ticker + 'THB'].averageBidPrice,
                            diference: bxinData[ticker][ticker + 'THB'].averageBidPrice - krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            percentage: (bxinData[ticker][ticker + 'THB'].averageBidPrice / krakenData[ticker][ticker + 'EUR'].averageAskPrice - 1) * 100
                        }


                        // console.log(`                      Bx.in/Kraken is ${bxInArbitrage[ticker].percentage.toFixed(2)}%`);
                        // console.log(bxInArbitrage);
                    }
                }
            })
            console.log('------------Yunbi arbitrage:------------');
            for (let i in yunbiArbitrage) {
                let percent = yunbiArbitrage[i].percentage;
                console.log(`------------${i} is ${percent.toFixed(2)}%`);
            }
            console.log(yunbiArbitrage);

            console.log('********************************************');
            console.log('------------Bx.in.th arbitrage:------------');
            for (let i in bxInArbitrage) {
                let percent = bxInArbitrage[i].percentage;
                console.log(`------------${i} is ${percent.toFixed(2)}%`);
            }
            console.log(bxInArbitrage);
            console.log('********************************************');


        })
}