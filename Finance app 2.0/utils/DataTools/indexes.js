function arrayAverage(arr) {
    const arrLength = arr.length
    let sum = 0;
    for (let i = 0; i < arrLength; i += 1) {
        sum += arr[i];
    };

    return sum / arrLength;
}

function simpleMovingAverage(data, nPeriod) {
    const closings = data.closings;
    const SMAArrayLength = closings.length - nPeriod;
    const SMAArray = [];

    for (let i = 0; i <= SMAArrayLength; i += 1) {
        let singleSMA = null;
        for (let j = 0; j < nPeriod; j += 1) {
            singleSMA += closings[i + j]
        }
        singleSMA /= nPeriod;
        let result = singleSMA.toFixed(4);
        SMAArray.push(+result);
    }
    return SMAArray;
};

function deviations(data, nPeriod) {
    const means = simpleMovingAverage(data, nPeriod);
    const closings = data.closings;
    const deviationsArrayLength = means.length;
    const deviationsHistoryArray = [];
    let singleSquareDeviation = null;
    let nPeriodDeviationsArray = [];

    // console.log(closings);
    // console.log(means);
    for (let i = 0; i < deviationsArrayLength; i += 1) {
        let historyDeviatons = []
        let singleHistoryDeviation = null;
        for (let j = 0; j <= nPeriod; j += 1) {
            singleHistoryDeviation = Math.pow((closings[i + j] - means[i]), 2);
            if (singleHistoryDeviation) {
                historyDeviatons.push(singleHistoryDeviation);
            }
        }
        nPeriodDeviationsArray.push(historyDeviatons);
    }
    // console.log(nPeriodDeviationsArray);
    return nPeriodDeviationsArray;
}

function standardDeviation(data, nPeriod) {
    const nPeriodDeviationsArray = deviations(data, nPeriod);
    const forLength = nPeriodDeviationsArray.length;
    const variancesArr = [];
    let variance = null;
    for (let i = 0; i < forLength; i += 1) {
        variance = arrayAverage(nPeriodDeviationsArray[i]);
        variancesArr.push(Math.sqrt(variance));
    }
    // console.log(variancesArr);
    return variancesArr;
};

function boilengerBands(data, nPeriod) {
    const SMA = simpleMovingAverage(data, nPeriod);
    const SD = standardDeviation(data, nPeriod);
    // console.log(SD);
    const middleBand = SMA;
    const upperBand = SMA.map((num, idx) => {
        return (num + (SD[idx] * 2)).toFixed(4);
    }).splice(0, middleBand.length);
    const lowerBand = SMA.map((num, idx) => {
        return (num - (SD[idx] * 2)).toFixed(4);
    }).splice(0, middleBand.length);
    const boilengerBands = {
        middleBand,
        upperBand,
        lowerBand
    };
    return boilengerBands;
};


module.exports = {
    SMA: simpleMovingAverage,
    SD: standardDeviation,
    BB: boilengerBands,
};
