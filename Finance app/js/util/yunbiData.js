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



let opts = {
    baseUrl: 'https://yunbi.com//api/v2',
    apikey: '10b9e16bc7da4ecd90d086ad35b8c9d4',
    apisecret: '2d7ddfa50904483cbac3bae74cf3bb00',
    nonce: getNonce(),
    stream: false,
    verbose: true,
    cleartext: false
};

let start,
    request_options = {
        method: 'GET',
        agent: false,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    };

export class Yunbi {
    static getDepth(pair, limit) {
        var op = request_options;
        if (limit) {
            op.uri = opts.baseUrl + `/depth.json?market=${pair}&limit=${limit}`;
        } else {
            op.uri = opts.baseUrl + `/depth.json?market=${pair}`;
        }
        return sendRequestCallback(op);
    };
    // static sendCustomRequest(request_string, credentials) {
    //     var op;
    //     if (credentials === true) {
    //         op = apiCredentials(request_string);
    //     } else {
    //         op = request_options;
    //         op.uri = request_string;
    //     }
    //     return sendRequestCallback(op);
    // };

    // static getmarkets() {
    //     var op = request_options;
    //     op.uri = opts.baseUrl + '/public/getmarkets';
    //     return sendRequestCallback(op);
    // }

    // static getcurrencies() {
    //     var op = request_options;
    //     op.uri = opts.baseUrl + '/public/getcurrencies';
    //     return sendRequestCallback(op);
    // };
    // static getticker(options) {
    //     var op = setRequestUriGetParams(opts.baseUrl + '/public/getticker', options);
    //     return sendRequestCallback(op);
    // };
    // static getmarketsummaries() {
    //     var op = request_options;
    //     op.uri = opts.baseUrl + '/public/getmarketsummaries';
    //     return sendRequestCallback(op);
    // };
    // static getmarketsummary(options) {
    //     var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarketsummary', options);
    //     return sendRequestCallback(op);
    // };
    // static getorderbook(options) {
    //     var op = setRequestUriGetParams(opts.baseUrl + '/public/getorderbook', options);
    //     return sendRequestCallback(op);
    // };
    // static getmarkethistory(options) {
    //     var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarkethistory', options);
    //     return sendRequestCallback(op);
    // };
    // static buylimit(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/buylimit'), options);
    //     return sendRequestCallback(op);
    // };

    // static buymarket(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/buymarket'), options);
    //     return sendRequestCallback(op);
    // };
    // static selllimit(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/selllimit'), options);
    //     return sendRequestCallback(op);
    // };
    // static sellmarket(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/sellmarket'), options);
    //     return sendRequestCallback(op);
    // };
    // static cancel(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/cancel'), options);
    //     return sendRequestCallback(op);
    // };
    // static getopenorders(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/getopenorders'), options);
    //     return sendRequestCallback(op);
    // };
    // static getbalances() {
    //     var op = apiCredentials(opts.baseUrl + '/account/getbalances');
    //     return sendRequestCallback(op);
    // };
    // static getbalance(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getbalance'), options);
    //     return sendRequestCallback(op);
    // };
    // static getwithdrawalhistory(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getwithdrawalhistory'), options);
    //     return sendRequestCallback(op);
    // };
    // static getdepositaddress(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdepositaddress'), options);
    //     return sendRequestCallback(op);
    // };
    // static getdeposithistory(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdeposithistory'), options);
    //     return sendRequestCallback(op);
    // };
    // static getorderhistory(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorderhistory'), options);
    //     return sendRequestCallback(op);
    // };
    // static getorder(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorder'), options);
    //     return sendRequestCallback(op);
    // };
    // static withdraw(options) {
    //     var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/withdraw'), options);
    //     return sendRequestCallback(op);
    // }

}






function getNonce() {
    return Math.floor(new Date().getTime() / 1000);
};

function sendRequestCallback(op) {
    start = Date.now();
    return Request.get(op.uri, op);
}



function apiCredentials(uri) {

    var options = {
        apikey: opts.apikey,
        nonce: getNonce()
    };

    return setRequestUriGetParams(uri, options);
};

function setRequestUriGetParams(uri, options) {
    var op;
    if (typeof(uri) === 'object') {
        op = uri;
        uri = op.uri;
    } else {
        op = request_options;
    }


    var o = Object.keys(options),
        i;
    for (i = 0; i < o.length; i++) {
        uri = updateQueryStringParameter(uri, o[i], options[o[i]]);
    }

    op.headers.apisign = hmac_sha512.HmacSHA512(uri, opts.apisecret); // setting the HMAC hash `apisign` http header
    op.uri = uri;

    return op;
};

function updateQueryStringParameter(uri, key, value) {

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }

    return uri;
};