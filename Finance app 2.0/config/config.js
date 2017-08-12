const pairs = ['ETHEUR', /*'BTCEUR'*/ ]
const exchanges = [{
    name: 'kraken',
    pairs,
    interval: 1440,
}];
const indexes = {
    nPeriod: 20
}

module.exports = {
    exchanges,
    indexes
}
