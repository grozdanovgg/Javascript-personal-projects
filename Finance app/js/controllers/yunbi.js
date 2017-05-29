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
import { Ticker } from '../util/Ticker';
import { Pair } from '../util/Pair';
import { CryptoJS as hmac_sha512 } from '../../node_modules/node.bittrex.api/hmac-sha512.js';
import { Yunbi } from '../util/yunbiData';

let pairs = [{ "id": "btccny", "name": "BTC/CNY" }, { "id": "ethcny", "name": "ETH/CNY" }, { "id": "dgdcny", "name": "DGD/CNY" }, { "id": "btscny", "name": "BTS/CNY" }, { "id": "dcscny", "name": "DCS/CNY" }, { "id": "sccny", "name": "SC/CNY" }, { "id": "etccny", "name": "ETC/CNY" }, { "id": "1stcny", "name": "1SŦ/CNY" }, { "id": "repcny", "name": "REP/CNY" }, { "id": "anscny", "name": "ANS/CNY" }, { "id": "zeccny", "name": "ZEC/CNY" }, { "id": "zmccny", "name": "ZMC/CNY" }, { "id": "gntcny", "name": "GNT/CNY" }, { "id": "qtumcny", "name": "QTUM/CNY" }]

var url = 'https://yunbi.com//api/v2/depth.json?market=btccny&limit=50';

let tickerArray = [],
    promArray = [],
    namesArray = [];

pairs.forEach(pair => {
    let name = pair.id;
    let prom = Yunbi.getDepth(name, 5);
    promArray.push(prom);
    namesArray.push(name);
});




export function yunbiController() {

    let exchanges = Request.get("http://api.fixer.io/latest")
        .then(getEuroCnyExchangeRate);

    Promise.all(promArray)
        .then((data) => {
            console.log(data);
            for (let i = 0; i < promArray.length; i += 1) {
                let tick = new Ticker(namesArray[i]);
            }
        })
}

function getPairsDepth(promArray) {
    return Promise.all(promArray)
}

function getEuroCnyExchangeRate(data) {
    let cnyForEur = data.rates.CNY;
    let eurForCny = 1 / cnyForEur;
    return { cnyForEur, eurForCny }
}