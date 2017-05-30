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

export function ichimokuController() {
    const cacheTime = 1, //hours
        year = 2000,
        month = 1,
        day = 1,
        daysAfterPrediction = 10,
        pointsTreshhold = 70;

    // let tickersIndexes = [];
    let tickersResult = {};
    //@ts-ignore
    Data.cacheIndexes("https://poloniex.com/public?command=returnTicker", cacheTime, 'tickersStorage', 'tickersFetchDate')
        .then(() => {
            // return JSON.parse(localStorage.tickersStorage);
            return ['USDT_ETH', 'BTC_BCN', 'USDT_REP', 'USDT_ETC'];
        }).then((tickersIndexes) => {
            //TO SEPARATE GETDABLE DATA AND RENDER THE TABLE:
            Calculate.getTableData(tickersIndexes, year, month, day, daysAfterPrediction, pointsTreshhold);
            // .then((tickersResult) => {
            //     console.log(tickersResult);
            //     return tickersResult;
            // })
        })
}