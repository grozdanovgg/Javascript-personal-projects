import { Calculate } from '../calculations';
import { Request } from '../util/requester';

export function tickerPoints(startYear, startMonth, startDay, ticker, daysAfterPrediction, pointsTreshhold) {

    let initialDateUnix = (new Date(startYear, startMonth, startDay).getTime() / 1000).toFixed(0);
    let endDateUnix = (Date.now() / 1000).toFixed(0);

    return Request.get(`https://poloniex.com/public?command=returnChartData&currencyPair=${ticker}&start=${initialDateUnix}&end=${endDateUnix}&period=86400`)
        .then((data) => {
            data.reverse();
            let historyDataArr = Calculate.analyseHistoryPredictions(data, daysAfterPrediction, pointsTreshhold);
            let predictions = Calculate.analysePredictionsPrecision(historyDataArr);
            return predictions;
        })
        .catch((error) => {
            return error;
        });

}