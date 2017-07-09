import { krakenController } from '../controllers/krakennew'
import { bittrexController } from '../controllers/bittrex';
import { yunbiController } from '../controllers/yunbi';
import { bxinController } from '../controllers/bxin';
import { shapeShiftController } from '../controllers/shapeShift';
import { getTemplate } from '../util/templater';
import { Coloriser } from '../util/coloriser';

let moneyToSpend = {
    eur: 4400,
    eth: 20
};
export function arbitrageController() {
    let inputDiv = $('#input-div'),
        inputField = inputDiv.append(`Ethereum ammount:  <input type="number" value="10" name="quantity" id="input-field" min="1" max="100000">`),
        inputETHEUR = inputDiv.append(`ETHEUR price:  <input type="number" value="200" name="quantity" id="input-exch-course" min="1" max="100000">`),
        inputBitton = inputDiv.append(`<button type="button" id="calculate-btn" class="btn btn-info">Calculate</button>`);

    $('#calculate-btn').on('click', () => {
        // console.log(+$('#input-field').val());
        moneyToSpend.eth = $('#input-field').val();
        moneyToSpend.eur = $('#input-exch-course').val() * moneyToSpend.eth;
        // console.log(moneyToSpend);
        arbitrageData();
    });
}




// function diff(arr, arr2) {
//     let ret = [];
//     arr.sort();
//     arr2.sort();
//     for (let i = 0; i < arr.length; i += 1) {
//         if (arr2.indexOf(arr[i]) > -1) {
//             ret.push(arr[i]);
//         }
//     }
//     return ret;
// }
// let tempy = bittrexController(moneyToSpend);

function arbitrageData() {
    // console.log(moneyToSpend);

    let p1 = krakenController(moneyToSpend),
        p2 = shapeShiftController(moneyToSpend),
        p3 = bittrexController(moneyToSpend),
        p4 = yunbiController(moneyToSpend),
        p5 = bxinController(moneyToSpend);
    let promiseArray = [p1, p2, p3, p4, p5];
    Promise.all(promiseArray)
        .then((data) => {
            // console.log('here');
            // console.log(data);
            let krakenData = data[0],
                shapeShiftData = data[1],
                bittrexData = data[2],
                yunbiData = data[3],
                bxinData = data[4];

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

            let arbitrageTickers = [{
                    main: 'Kraken',
                    second: 'Yunbi',
                    A: 'ETH',
                    B: 'REP',
                    C: 'CNY',
                    D: ''
                },
                {
                    main: 'Kraken',
                    second: 'Yunbi',
                    A: 'ETH',
                    B: 'ETC',
                    C: 'CNY',
                    D: ''
                },
                {
                    main: 'Kraken',
                    second: 'Yunbi',
                    A: 'ETH',
                    B: 'EOS',
                    C: 'CNY',
                    D: ''
                }
                // {
                //     main: 'Bittrex',
                //     second: 'Yunbi',
                //     A: 'ETH',
                //     B: 'ETC',
                //     C: 'CNY',
                //     D: 'BTC'
                // },
            ]
            let mainData = '',
                secondaryData = '';

            let arbitrageActionsArr = [];
            arbitrageTickers.forEach((ticker) => {
                // console.log(ticker.main);
                switch (ticker.main) {
                    case 'Kraken':
                        mainData = krakenData;
                        secondaryData = yunbiData;
                        break;
                    case 'Bittrex':
                        mainData = bittrexData;
                        secondaryData = yunbiData;
                        break;
                    default:
                        break;
                }

                //TO BE FIXED!!!
                // console.log(mainData);
                // console.log(secondaryData);
                // console.log(mainData[ticker.B]);
                // console.log(ticker.B + ticker.A);
                let startSum = moneyToSpend.eth,
                    bid2AC = secondaryData[ticker.A][ticker.A + ticker.C].avgBidOrigCurrency.toFixed(4),
                    ask2BC = secondaryData[ticker.B][ticker.B + ticker.C].avgAskOrigCurrency.toFixed(4);
                let bid1BA = mainData[ticker.B][ticker.B + ticker.A].avgBidOrigCurrency.toFixed(4),
                    CRecieved = (startSum * bid2AC * 0.999).toFixed(4),
                    BRecieved = (CRecieved / ask2BC * 0.999).toFixed(4),
                    ARecieved = (BRecieved * bid1BA * 0.9974).toFixed(4),
                    profit = (ARecieved - startSum).toFixed(4),
                    percent = (((ARecieved / startSum) - 1) * 100).toFixed(2);


                let result = {
                        startSum,
                        main: ticker.main,
                        second: ticker.second,
                        A: ticker.A,
                        B: ticker.B,
                        C: ticker.C,
                        D: ticker.D,
                        bid2AC,
                        ask2BC,
                        bid1BA,
                        CRecieved,
                        BRecieved,
                        ARecieved,
                        profit,
                        percent
                    }
                    // console.log(secondaryData[ticker.B][ticker.B + ticker.C]);
                    // console.log(result);
                if (ticker.D !== '') {
                    let stepThreeAsk1DB = mainData[ticker.D][tickerD + ticker.B].avgAskOrigCurrency.toFixed(4),
                        DRecieved = (BRecieved / ask2BC * 0.9974).toFixed(4);
                    result[stepThreeAsk1DB] = stepThreeAsk1DB;
                    result[DRecieved] = DRecieved;
                }


                arbitrageActionsArr.push(result)
            })


            // let askYunbiREPCNY = yunbiData['REP']['REPCNY'].avgAskOrigCurrency,
            //     bidYunbiETHCNY = yunbiData['ETH']['ETHCNY'].avgBidOrigCurrency,
            //     bidKrakenREPETH = krakenData['REP']['REPETH'].avgBidOrigCurrency,
            //     CNYRecieved = initialETH * bidYunbiETHCNY,
            //     REPRecieved = CNYRecieved / askYunbiREPCNY,
            //     ETHRecieved = REPRecieved * bidKrakenREPETH;

            // let arbitrageActionsObj = {
            //     startSum: moneyToSpend.eth,
            //     '1': 'Kraken',
            //     '2': 'Yunbi',
            //     A: 'ETH',
            //     B: 'REP',
            //     C: 'CNY',
            //     D: '',
            //     bid2AC: bidYunbiETHCNY.toFixed(4),
            //     ask2BC: yunbiData[arbitrageActionsObj.B][arbitrageActionsObj.B + arbitrageActionsObj.C].avgAskOrigCurrency.toFixed(4),
            //     bid1BA: bidKrakenREPETH.toFixed(4),
            //     CRecieved: CNYRecieved.toFixed(4),
            //     BRecieved: REPRecieved.toFixed(4),
            //     ARecieved: ETHRecieved.toFixed(4)
            // };
            return arbitrageActionsArr;


        })
        .then((arbitrageActionsArr) => {
            getTemplate('table-arbitrage')
                .then((template) => {
                    $('#data').html(template(arbitrageActionsArr));
                })
                .then(() => {
                    let tableToColorBy = $('.percent');
                    // console.log(tableToColorBy);
                    Coloriser.table(tableToColorBy, 0);
                });
        });
}