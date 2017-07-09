import $ from 'jquery';
import { Ichimoku } from './util/ichimokuAnalytics';
import { tickerPoints } from './util/tickerPoints';
import { getTemplate } from './util/templater';
import { Coloriser } from './util/coloriser';

export class Calculate {

    static timeUnixToHuman(unixTime) {
        var date = new Date(unixTime * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = `${day}.${month}.${year} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
        return formattedTime;
    }

    static analyseHistoryPredictions(data, daysAfterPrediction, pointsTreshhold) {
        let pointsHistory = [];
        for (var index = daysAfterPrediction; index < data.length - 77; index += 1) {
            let currentData = data.slice(index, (data.length));
            let date = Calculate.timeUnixToHuman(data[index].date),
                points = Ichimoku.points(currentData).totalPoints,
                priceAtPredictionMoment = data[index].close,
                priceAfterPrediction = +(data[index - daysAfterPrediction].close),
                prediction = undefined,
                priceVariation = (((priceAfterPrediction / priceAtPredictionMoment) - 1) * 100);

            if (points >= pointsTreshhold) {
                if (priceAfterPrediction > priceAtPredictionMoment) {
                    prediction = true;
                } else {
                    prediction = false;
                }
            } else if (points <= ((pointsTreshhold) * (-1))) {

                if (priceAfterPrediction > priceAtPredictionMoment) {
                    prediction = false;
                } else {

                    prediction = true;
                }
            } else {
                continue;
            }
            pointsHistory.push({
                date,
                points,
                priceAtPredictionMoment,
                priceAfterPrediction,
                priceVariation,
                prediction
            })
        }
        if (pointsHistory.length > 0) {
            return pointsHistory;
        } else {
            throw Error("The price treshhold is too big. Please provide smaller value");
        }
    }

    static analysePredictionsPrecision(historyDataArr) {
        let countSuccessPredictions = 0,
            countWrongPredictions = 0,
            successPredictionVariatons = [],
            wrongPredictionsVariations = [];
        historyDataArr.forEach((moment) => {
            if (moment.prediction) {
                countSuccessPredictions += 1;
                successPredictionVariatons.push(Math.abs(moment.priceVariation));
            } else {
                countWrongPredictions += 1;
                wrongPredictionsVariations.push(Math.abs(moment.priceVariation));
            }
        });
        let successAverageVariations = (successPredictionVariatons.reduce((a, b) => { return a + b; }) / successPredictionVariatons.length).toFixed(2);
        let wrongAverageVariations = (wrongPredictionsVariations.reduce((a, b) => { return a + b; }) / wrongPredictionsVariations.length).toFixed(2);

        return {
            successPredictions: countSuccessPredictions,
            succesAveragePriceVariaton: successAverageVariations,
            wrongPredictions: countWrongPredictions,
            wrongAveragePriceVariaton: wrongAverageVariations
        }
    }

    static indexPredictionPerformance(tickersResultArray) {
        let reduced = (tickersResultArray.reduce((a, b) => { return { predictionScore: (+a.predictionScore + (+b.predictionScore)) }; }));
        let result = (reduced.predictionScore / tickersResultArray.length).toFixed(2);
        return result;
    }

    //TO RENAME THIS FUNC
    static getTableData(tickersIndexes, startYear, startMonth, startDay, daysAfterPrediction, pointsTreshhold) {
        let i = 0;
        const len = tickersIndexes.length;
        const now = Date.now();
        let tickersResult = {
            data: [],
            lastUpdatedDate: Date.now()
        };

        if (!tickersResult.tickersData || (+tickersResult.resultsLastDate < (now - period))) {
            calculatePoints();
            return Promise.resolve(tickersResult);
        } else {

            return Promise.resolve(JSON.parse(localStorage.tickersData));
        }

        function calculatePoints() {

            if (i < len) {
                return tickerPoints(startYear, startMonth, startDay, tickersIndexes[i], daysAfterPrediction, pointsTreshhold)
                    .then((data) => {
                        //add ticker properties to each ticker
                        data.ticker = tickersIndexes[i];
                        data.predictionScore = ((data.successPredictions / (data.successPredictions + data.wrongPredictions)) * 100).toFixed(2);

                        if (data.successPredictions) {
                            tickersResult.data.push(data);
                            tickersResult.lastUpdatedDate = Date.now();
                        }
                    })
                    .then(() => {
                        i += 1;
                        setTimeout(calculatePoints, 170);
                    })
            } else {
                i = 0;

                let indexPredictionPerformance = Calculate.indexPredictionPerformance(tickersResult.data);
                let templateData = {
                    tickersResultArray: tickersResult.data,
                    indexPredictionPerformance
                }
                return getTemplate('table')
                    .then((template) => {
                        $('#data').html(template(templateData));
                    })
                    .then(() => {
                        $("#main-table").tablesorter();
                    })
                    .then(() => {
                        let tableToColorBy = $('.prediction-score');
                        let pointsElementToColor = $('#indicator-performance');
                        Coloriser.table(tableToColorBy, pointsTreshhold);
                        Coloriser.backgroundPrimary(pointsElementToColor);
                    })
                    .then(() => {
                        $('.table-body').on('click', (clicked) => {
                            let clickedTarget = clicked.target.parentElement;
                            $('.info').removeClass('info');
                            $(clickedTarget).addClass('info');
                        })
                    })
            }
        }
    }
}