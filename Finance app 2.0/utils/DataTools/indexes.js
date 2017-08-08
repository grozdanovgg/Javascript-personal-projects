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
        SMAArray.push(singleSMA);
    }
    // console.log(SMAArray);
    return SMAArray;
};

function deviations(data, means, nPeriod) {
    const closings = data.closings;
    // console.log(closings);
    // console.log(means);
    //WRONG
    const deviationsArrayLength = means.length;
    const deviationsArray = [];
    let singleSquareDeviation = null;
    for (let i = 0; i < deviationsArrayLength; i += 1) {
        singleSquareDeviation = Math.pow((closings[i] - means[i]), 2);
        deviationsArray.push(singleSquareDeviation);
    }

    return deviationsArray;
}

function variances(deviationsArr, nPeriod) {
    const forLength = deviationsArr.length - nPeriod;
    const variancesArr = [];

    for (let i = 0; i <= forLength; i += 1) {
        let singleVariance = null;
        for (let j = 0; j < nPeriod; j += 1) {
            singleVariance += deviationsArr[i + j];
        }
        variancesArr.push(singleVariance / nPeriod);
    }
    return variancesArr;
}

function standardDeviation(data, nPeriod) {
    const closings = data.closings;
    const means = simpleMovingAverage(data, nPeriod);
    const deviationsArr = deviations(data, means, nPeriod);
    const variancesArr = variances(deviationsArr, nPeriod);
    const standardDeviation = variancesArr.map((variance) => Math.sqrt(variance));

    return standardDeviation;
}

function boilengerBands(data, nPeriod) {
    const SMA = simpleMovingAverage(data, nPeriod);
    const SD = standardDeviation(data, nPeriod);
    const middleBand = SMA.splice(0, nPeriod);
    const upperBand = SMA.map((num, idx) => {
        return num + (SD[idx] * 2)
    }).splice(0, nPeriod);
    const lowerBand = SMA.map((num, idx) => {
        return num - (SD[idx] * 2)
    }).splice(0, nPeriod);
    const boilengerBands = {
            middleBand,
            upperBand,
            lowerBand
        }
        // console.log(boilengerBands);
    return boilengerBands;
};


module.exports = {
    SMA: simpleMovingAverage,
    SD: standardDeviation,
    BB: boilengerBands,
};
