export class Ichimoku {

    static points(arr) {
        // Four interpretation idicators, each with diferent impact on the total points;

        const firstPrice = 40,
            secondPrice = 17,
            thirdPrice = 10,
            fourthPrice = 7,
            fifthPrice = 6;

        let tankenSenNow = tankenSen(arr),
            kijunSenNow = kijunSen(arr),
            senkouSpanANow = senkouSpanA(arr),
            senkouSpanBNow = senkouSpanB(arr),
            chikouSpanNow = chikouSpan(arr),
            price = arr[0].close,
            positivePoints = 0,
            negativePoints = 0,
            aboveTheCloud = (price > tankenSenNow && price > kijunSenNow),
            inTheCloud = ((price > tankenSenNow && price < kijunSenNow) || (price < tankenSenNow && price > kijunSenNow)),
            positiveMultiplicator = 1,
            negativeMultiplicator = 1;



        if (aboveTheCloud) {
            positiveMultiplicator = 1.5;
        } else if (inTheCloud) {

        } else {
            negativeMultiplicator = 1.5;
        }

        // First indicator (is the price above the cloud)
        if (price > tankenSenNow && price > kijunSenNow) {
            positivePoints += firstPrice;
        } else if (price < tankenSenNow && price < kijunSenNow) {
            negativePoints -= firstPrice;
        }

        // Second indicator (is the cloud green)
        if (senkouSpanANow > senkouSpanBNow) {
            positivePoints += secondPrice * positiveMultiplicator * negativeMultiplicator;
        } else {
            negativePoints -= secondPrice * positiveMultiplicator * negativeMultiplicator;
        }

        // Third indicator (If the price is above or below the Base line)
        if (price > kijunSenNow) {
            positivePoints += thirdPrice * positiveMultiplicator * negativeMultiplicator;
        } else {
            negativePoints -= thirdPrice * positiveMultiplicator * negativeMultiplicator;
        }

        // Fourth indicator (if the Conversion line(Tenkan-sen) is above the Base line(Kijun-sen) )
        if (tankenSenNow > kijunSenNow) {
            positivePoints += fourthPrice * positiveMultiplicator * negativeMultiplicator;
        } else {
            negativePoints -= fourthPrice * positiveMultiplicator * negativeMultiplicator;
        }

        // Fifth indicator (if the price 26 periods from now is higher than current price)
        if (price > chikouSpanNow) {
            positivePoints += fifthPrice * positiveMultiplicator * negativeMultiplicator;
        } else {
            negativePoints -= fifthPrice * positiveMultiplicator * negativeMultiplicator;
        }

        let totalPoints = positivePoints + negativePoints;

        return {
            positivePoints,
            negativePoints,
            totalPoints: +totalPoints,
            aboveTheCloud,
            inTheCloud
        }
    }

    // Get indicators data (all five lines):

}

function tankenSen(arr) {
    let curve = 0,
        high = 0,
        low = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < 9; i += 1) {
        if (arr[i].high > high) {
            high = arr[i].high;
        }
        if (arr[i].low < low) {
            low = arr[i].low;
        }
    }
    curve = ((+low) + (+high)) / 2;
    return +curve.toFixed(4);
}

function kijunSen(arr) {
    let curve = 0,
        high = 0,
        low = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < 26; i += 1) {
        if (arr[i].high > high) {
            high = arr[i].high;
        }
        if (arr[i].low < low) {
            low = arr[i].low;
        }
    }
    curve = ((+low) + (+high)) / 2;
    return +curve.toFixed(4);
}

function senkouSpanA(data) {
    let arr = data.slice(26);
    let result = (tankenSen(arr) + kijunSen(arr)) / 2
    return +result.toFixed(4);
}

function senkouSpanB(data) {
    let arr = data.slice(26);
    let curve = 0,
        high = 0,
        low = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < 52; i += 1) {
        if (arr[i].high > high) {
            high = arr[i].high;
        }
        if (arr[i].low < low) {
            low = arr[i].low;
        }
    }
    curve = ((+low) + (+high)) / 2;
    return +curve.toFixed(4);
}

function chikouSpan(arr) {
    let result = arr[25].high;
    return +result;
}