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
import { Bittrex } from '../util/bittrexData';


export function bittrexControllerOld() {

    var url = 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC';

    let result = Bittrex.sendCustomRequest(url);
    result.then((data) => {
        console.log(data);
    })

    let res2 = Bittrex.getbalances();

    res2.then((data) => {
        console.log(data);
    })
}