import { krakenController } from '../controllers/krakennew'
import { bittrexController } from '../controllers/bittrex';
import { yunbiController } from '../controllers/yunbi';
import { bxinController } from '../controllers/bxin';
import { shapeShiftController } from '../controllers/shapeShift';

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
        p2 = shapeShiftController(),
        p3 = bittrexController(),
        p4 = yunbiController(),
        p5 = bxinController();
    let promiseArray = [p1, p2, p3, p4, p5];
    // console.log(promiseArray);
    Promise.all(promiseArray)
        .then((data) => {
            // console.log('here');
            let krakenData = data[0],
                shapeShiftData = data[1],
                bittrexData = data[2],
                yunbiData = data[3],
                bxinData = data[4],

                krakenTickers = [],
                shapeShiftTickers = [],
                bittrexTickers = [],
                yunbiTickers = [],
                bxinTickers = [],

                yunbiCommonTickersKraken = [],
                bxinCmmonTickersKraken = [],
                yunbiCommonTickersShapeShift = [],
                bxinCommonTickersShapeShift = [],
                yunbiCommonTickersBittrex = [],
                bxinCommonTickersBittrex = [],

                yunbiArbitrageKraken = {},
                bxInArbitrageKraken = {},
                yunbiArbitrageShapeShift = {},
                bxinArbitrageShapeShift = {},
                yunbiArbitrageBittrex = {},
                bxinArbitrageBittrex = {};
            // shapeShiftInArbitrage = {};
            // console.log('Kraken:');
            // console.log(krakenData);
            // console.log('Yunbi:');
            // console.log(yunbiData);
            // console.log('bx.in:');
            // console.log(bxinData);

            krakenTickers = Object.keys(krakenData);
            shapeShiftTickers = Object.keys(shapeShiftData);
            bittrexTickers = Object.keys(bittrexData);
            yunbiTickers = Object.keys(yunbiData);
            bxinTickers = Object.keys(bxinData);



            for (let ticker in yunbiData) {
                if (yunbiData[ticker].name === 'BTCCNY') {
                    yunbiData[ticker].name = 'XBTCNY';
                }
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
            // yunbiCommonTickersKraken = diff(yunbiTickers, krakenTickers);
            // bxinCmmonTickersKraken = diff(bxinTickers, krakenTickers);



            //Kraken arbitrage analitycs
            //To fix only EURO price get....
             
            krakenTickers.forEach((ticker) => {

                

                if (yunbiData[ticker] && krakenData[ticker]) {
                    console.log(yunbiData[ticker]);
                    console.log(krakenData[ticker]);
                    console.log(ticker)
                    
                    
                    if( ticker === 'ETH'){
                        yunbiArbitrageKraken[ticker] = {
                            askKraken: krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            askYunbi: yunbiData[ticker][ticker + 'CNY'].averageAskPrice,
                            bidKraken: krakenData[ticker][ticker + 'EUR'].averageBidPrice,
                            bidYunbi: yunbiData[ticker][ticker + 'CNY'].averageBidPrice,
                            diference: yunbiData[ticker][ticker + 'CNY'].averageAskPrice - krakenData[ticker][ticker + 'EUR'].averageBidPrice,
                            percentage: (yunbiData[ticker][ticker + 'CNY'].averageAskPrice / krakenData[ticker][ticker + 'EUR'].averageBidPrice - 1) * 100
                        };
                    } else if (krakenData[ticker][ticker + 'ETH'] && yunbiData[ticker][ticker + 'CNY']) {
                        yunbiArbitrageKraken[ticker] = {
                            askKraken: krakenData[ticker][ticker + 'ETH'].averageAskPrice,
                            askYunbi: yunbiData[ticker][ticker + 'CNY'].averageAskPrice,
                            bidKraken: krakenData[ticker][ticker + 'ETH'].averageBidPrice,
                            bidYunbi: yunbiData[ticker][ticker + 'CNY'].averageBidPrice,
                            diference: yunbiData[ticker][ticker + 'CNY'].averageAskPrice - krakenData[ticker][ticker + 'ETH'].averageBidPrice,
                            percentage: (yunbiData[ticker][ticker + 'CNY'].averageAskPrice / krakenData[ticker][ticker + 'ETH'].averageBidPrice - 1) * 100
                        };
                        // console.log(`                      Yunbi/Kraken is ${yunbiArbitrageKraken[ticker].percentage.toFixed(2)}%`);
                        // console.log(yunbiArbitrageKraken);
                        console.log('@@@')
                    }
                };

                if (bxinData[ticker] && krakenData[ticker]) {
                    if (krakenData[ticker][ticker + 'EUR'] && bxinData[ticker][ticker + 'THB']) {
                        bxInArbitrageKraken[ticker] = {
                            askKraken: krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            askBxin: bxinData[ticker][ticker + 'THB'].averageAskPrice,
                            bidKraken: krakenData[ticker][ticker + 'EUR'].averageBidPrice,
                            bidBxin: bxinData[ticker][ticker + 'THB'].averageBidPrice,
                            diference: bxinData[ticker][ticker + 'THB'].averageBidPrice - krakenData[ticker][ticker + 'EUR'].averageAskPrice,
                            percentage: (bxinData[ticker][ticker + 'THB'].averageBidPrice / krakenData[ticker][ticker + 'EUR'].averageAskPrice - 1) * 100
                        };
                        // console.log(`                      Bx.in/Kraken is ${bxInArbitrageKraken[ticker].percentage.toFixed(2)}%`);
                        // console.log(bxInArbitrageKraken);
                    }
                };
            });

            //ShapeShift arbitrage analitycs
            //To fix only EURO price get....
            shapeShiftTickers.forEach((ticker) => {

                if (yunbiData[ticker] && shapeShiftData[ticker]) {
                    let minPrice = Number.MAX_SAFE_INTEGER;
                    let maxPrice = Number.MAX_SAFE_INTEGER;

                    for (let i in shapeShiftData[ticker]) {
                        let obj = shapeShiftData[ticker][i];

                        if (obj.averageAskPrice < minPrice) {
                            minPrice = obj.averageAskPrice;
                        }
                        if (obj.averageBidPrice > maxPrice) {
                            maxPrice = obj.averageBidPrice;
                        }

                        if (!yunbiArbitrageShapeShift[ticker]) {
                            yunbiArbitrageShapeShift[ticker] = {};
                        }
                        yunbiArbitrageShapeShift[ticker][`askShapeShift_${obj.name}`] = {
                            askShapeShift: shapeShiftData[ticker][obj.name].averageAskPrice,
                            askYunbi: yunbiData[ticker][ticker + 'CNY'].averageAskPrice,
                            bidYunbi: yunbiData[ticker][ticker + 'CNY'].averageBidPrice,
                            diference: yunbiData[ticker][ticker + 'CNY'].averageBidPrice - shapeShiftData[ticker][obj.name].averageAskPrice,
                            percentage: (yunbiData[ticker][ticker + 'CNY'].averageBidPrice / shapeShiftData[ticker][obj.name].averageAskPrice - 1) * 100
                        };
                    }
                };

                if (bxinData[ticker] && shapeShiftData[ticker]) {
                    let minPrice = Number.MAX_SAFE_INTEGER;
                    let maxPrice = Number.MAX_SAFE_INTEGER;

                    for (let i in shapeShiftData[ticker]) {
                        let obj = shapeShiftData[ticker][i];
                        if (obj.averageAskPrice < minPrice) {
                            minPrice = obj.averageAskPrice;
                        }
                        if (obj.averageBidPrice > maxPrice) {
                            maxPrice = obj.averageBidPrice;
                        }

                        if (!bxinArbitrageShapeShift[ticker]) {
                            bxinArbitrageShapeShift[ticker] = {};
                        }
                        bxinArbitrageShapeShift[ticker][`askShapeShift_${obj.name}`] = {
                            askShapeShift: shapeShiftData[ticker][obj.name].averageAskPrice,
                            askYunbi: bxinData[ticker][ticker + 'THB'].averageAskPrice,
                            bidYunbi: bxinData[ticker][ticker + 'THB'].averageBidPrice,
                            diference: bxinData[ticker][ticker + 'THB'].averageBidPrice - shapeShiftData[ticker][obj.name].averageAskPrice,
                            percentage: (bxinData[ticker][ticker + 'THB'].averageBidPrice / shapeShiftData[ticker][obj.name].averageAskPrice - 1) * 100
                        };
                    }
                };
            });


            //Bittrex arbitrage analitycs
            //To fix only EURO price get....
            bittrexTickers.forEach((ticker) => {
                // console.log(yunbiData);
                // console.log(bittrexData);
                // console.log('....');
                if (yunbiData[ticker] && bittrexData[ticker]) {
                    let minPrice = Number.MAX_SAFE_INTEGER;
                    let maxPrice = Number.MAX_SAFE_INTEGER;

                    for (let i in bittrexData[ticker]) {
                        let obj = bittrexData[ticker][i];

                        if (obj.averageAskPrice < minPrice) {
                            minPrice = obj.averageAskPrice;
                        }
                        if (obj.averageBidPrice > maxPrice) {
                            maxPrice = obj.averageBidPrice;
                        }

                        if (!yunbiArbitrageBittrex[ticker]) {
                            yunbiArbitrageBittrex[ticker] = {};
                        }

                        // console.log(bittrexData);
                        // console.log(ticker);
                        // console.log(obj.name);
                        yunbiArbitrageBittrex[ticker][`askBittrex_${obj.name}`] = {
                            askBittrex: bittrexData[ticker][obj.name].averageAskPrice,
                            askYunbi: yunbiData[ticker][ticker + 'CNY'].averageAskPrice,
                            bidYunbi: yunbiData[ticker][ticker + 'CNY'].averageBidPrice,
                            diference: yunbiData[ticker][ticker + 'CNY'].averageBidPrice - bittrexData[ticker][obj.name].averageAskPrice,
                            percentage: (yunbiData[ticker][ticker + 'CNY'].averageBidPrice / bittrexData[ticker][obj.name].averageAskPrice - 1) * 100
                        };
                    }
                };
                // console.log(bxinData);
                // console.log(bittrexData);
                // console.log('....');
                if (bxinData[ticker] && bittrexData[ticker]) {
                    let minPrice = Number.MAX_SAFE_INTEGER;
                    let maxPrice = Number.MAX_SAFE_INTEGER;

                    for (let i in bittrexData[ticker]) {
                        let obj = bittrexData[ticker][i];
                        if (obj.averageAskPrice < minPrice) {
                            minPrice = obj.averageAskPrice;
                        }
                        if (obj.averageBidPrice > maxPrice) {
                            maxPrice = obj.averageBidPrice;
                        }

                        if (!bxinArbitrageBittrex[ticker]) {
                            bxinArbitrageBittrex[ticker] = {};
                        }
                        bxinArbitrageBittrex[ticker][`askBittrex_${obj.name}`] = {
                            askBittrex: bittrexData[ticker][obj.name].averageAskPrice,
                            askYunbi: bxinData[ticker][ticker + 'THB'].averageAskPrice,
                            bidYunbi: bxinData[ticker][ticker + 'THB'].averageBidPrice,
                            diference: bxinData[ticker][ticker + 'THB'].averageBidPrice - bittrexData[ticker][obj.name].averageAskPrice,
                            percentage: (bxinData[ticker][ticker + 'THB'].averageBidPrice / bittrexData[ticker][obj.name].averageAskPrice - 1) * 100
                        };
                    }
                };
            })






            //Printing result:

                        // 10eth> sell to yunbi BID ETHCNY > ASK REPCNY Yunbi> BID REPETH Kraken > diff now EHT - initial ETH;
                        //Prices now are all EUR, need to get original prices
            console.log( krakenData['REP']['REPETH']);
            let initialETH = 20,
                askYunbiREPCNY = yunbiData['REP']['REPCNY'].avgAskOrigCurrency,
                bidYunbiETHCNY = yunbiData['ETH']['ETHCNY'].avgBidOrigCurrency,
                bidKrakenREPETH = krakenData['REP']['REPETH'].avgBidOrigCurrency,
                CNYRecieved = initialETH*bidYunbiETHCNY,
                REPRecieved = CNYRecieved/askYunbiREPCNY,
                ETHRecieved = REPRecieved*bidKrakenREPETH;

            console.log(`Start with ${initialETH}ETH`);
            console.log(`BID Yunbi ETHCNY: ${bidYunbiETHCNY}`);
            console.log(`ASK Yunbi REPCNY: ${askYunbiREPCNY}`);
            console.log(`BID Kraken REPETH: ${bidKrakenREPETH}`);
            console.log(`CNY bought in Yunbi: ${CNYRecieved}`);
            console.log(`REP bought in Yunbi: ${REPRecieved}`);
            console.log(`ETH bought in Kraken: ${ETHRecieved}`);

            console.log('-----------------Kraken---------------------');
            console.log('............................................');
            console.log('------------Yunbi arbitrage:---------------');
            for (let i in yunbiArbitrageKraken) {
                let percent = yunbiArbitrageKraken[i].percentage;
                console.log(`------------${i} is ${percent.toFixed(2)}%`);
            }
            console.log(yunbiArbitrageKraken);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////

            console.log('------------Bx.in.th arbitrage:------------');
            for (let i in bxInArbitrageKraken) {
                let percent = bxInArbitrageKraken[i].percentage;
                console.log(`------------${i} is ${percent.toFixed(2)}%`);
            }
            console.log(bxInArbitrageKraken);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////




            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

            console.log('-------------- Shape Shift -----------------');
            console.log('............................................');
            console.log('------------Yunbi arbitrage:---------------');
            for (let i in yunbiArbitrageShapeShift) {
                let tempParentObj = yunbiArbitrageShapeShift[i];
                // console.log(tempParentObj);
                for (let j in tempParentObj) {
                    let tempObj = tempParentObj[j];
                    // console.log(tempObj);
                    let percent = tempObj.percentage;
                    console.log(`------------${j.slice(17)} is ${percent.toFixed(2)}%`);
                }
            }
            console.log(yunbiArbitrageShapeShift);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////

            console.log('------------Bx.in.th arbitrage:------------');
            for (let i in bxinArbitrageShapeShift) {
                let tempParentObj = bxinArbitrageShapeShift[i];
                // console.log(tempParentObj);
                for (let j in tempParentObj) {
                    let tempObj = tempParentObj[j];
                    // console.log(tempObj);
                    let percent = tempObj.percentage;
                    console.log(`------------${j.slice(17)} is ${percent.toFixed(2)}%`);
                }
            }
            console.log(bxinArbitrageShapeShift);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


            console.log('-------------- Bittrex -----------------');
            console.log('............................................');
            console.log('------------Yunbi arbitrage:---------------');
            for (let i in yunbiArbitrageBittrex) {
                let tempParentObj = yunbiArbitrageBittrex[i];
                // console.log(tempParentObj);
                for (let j in tempParentObj) {
                    let tempObj = tempParentObj[j];
                    // console.log(tempObj);
                    let percent = tempObj.percentage;
                    console.log(`------------${j.slice(11,14)} is ${percent.toFixed(2)}%`);
                }
            }
            console.log(yunbiArbitrageBittrex);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////

            console.log('------------Bx.in.th arbitrage:------------');
            for (let i in bxinArbitrageBittrex) {
                let tempParentObj = bxinArbitrageBittrex[i];
                // console.log(tempParentObj);
                for (let j in tempParentObj) {
                    let tempObj = tempParentObj[j];
                    // console.log(tempObj);
                    let percent = tempObj.percentage;
                    console.log(`------------${j.slice(11,14)} is ${percent.toFixed(2)}%`);
                }
            }
            console.log(bxinArbitrageBittrex);
            console.log('********************************************');
            ////////////////////////////////////////////////////////////




        })
}