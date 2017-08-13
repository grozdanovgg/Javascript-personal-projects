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

function exponentialMovingAverage(data, nPeriod) {
    const closingsRaw = data.closings.slice();
    const closingsLength = closingsRaw.length;
    const closings = closingsRaw.reverse().slice(nPeriod - 1, closingsLength);
    const SMAArray = simpleMovingAverage(data, nPeriod);
    const firstBase = SMAArray[SMAArray.length - 1];
    let base = null;
    let firstBaseActive = true;
    const multiplier = (2 / (nPeriod + 1));
    const EMAArrayLength = SMAArray.length;
    const EMAArray = [];

    for (let i = 0; i < EMAArrayLength; i += 1) {
        if (!firstBaseActive) {
            base = (closings[i] * multiplier) + (EMAArray[0] * (1 - multiplier));
        } else {
            base = firstBase;
            firstBaseActive = false;
        };
        EMAArray.unshift(base);
    }
    return EMAArray;
}

function deviations(data, nPeriod) {
    const means = simpleMovingAverage(data, nPeriod);
    const closings = data.closings;
    const deviationsArrayLength = means.length;
    const deviationsHistoryArray = [];
    let singleSquareDeviation = null;
    let nPeriodDeviationsArray = [];
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
    return variancesArr;
};

function boilengerBands(data, nPeriod) {
    const SMA = simpleMovingAverage(data, nPeriod);
    const SD = standardDeviation(data, nPeriod);
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

function trueRange(data, nPeriod) {
    const rowClosings = data.closings.slice();
    const rowLowests = data.lowests.slice();
    const rowHighests = data.highests.slice();
    const length = rowClosings.length;
    const trueRange = [];

    const closings = rowClosings;
    const lowests = rowLowests;
    const highests = rowHighests;

    let diff = null;
    let diffOne = null;
    let diffTwo = null;
    let diffTree = null;
    for (let i = 0; i < length; i += 1) {
        if (i < length - 1) {
            diffOne = highests[i] - lowests[i];
            diffTwo = Math.abs(highests[i] - closings[i + 1]);
            diffTree = Math.abs(lowests[i] - closings[i + 1]);
            diff = Math.max(diffOne, diffTwo, diffTree);
        } else {
            diff = highests[i] - lowests[i];
        };
        // console.log(`${diffOne} ${diffTwo} ${diffTree}`);
        // console.log(diff);
        // console.log('------');
        trueRange.push(diff);
    };
    return trueRange;
}

function averageTrueRange(data, nPeriod) {
    const ATRArray = []
    const TR = trueRange(data, nPeriod).reverse(); //oldest values are first
    const length = TR.length - nPeriod;
    const TRAverage = arrayAverage(TR.slice(0, nPeriod));
    let singleATR = null;
    let lastATR = null;
    let isFirst = true;

    for (let i = 0; i <= length; i += 1) {
        if (!isFirst) {
            singleATR = ((ATRArray[0] * (nPeriod - 1)) + TR[i + nPeriod - 1]) / nPeriod;
        } else {
            singleATR = TRAverage;
            isFirst = false;
        }
        ATRArray.unshift(singleATR);
    }
    return ATRArray;
}

function keltnerChannels(data, nPeriod) {
    const EMA = exponentialMovingAverage(data, nPeriod);
    const ATR = averageTrueRange(data, +(nPeriod / 2).toFixed(0));
    const upperKC = [];
    const lowerKC = [];
    let singleUpperKC = null;
    let singleLowerKC = null;
    for (let i = 0; i < EMA.length; i += 1) {
        singleUpperKC = EMA[i] + (2 * ATR[i]);
        singleLowerKC = EMA[i] - (2 * ATR[i]);
        lowerKC.push(singleLowerKC);
        upperKC.push(singleUpperKC);
    }
    const result = {
        middleKC: EMA,
        lowerKC,
        upperKC
    };
    return result;
}
module.exports = {
    SMA: simpleMovingAverage,
    SD: standardDeviation,
    BB: boilengerBands,
    EMA: exponentialMovingAverage,
    KC: keltnerChannels,
};
