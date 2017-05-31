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
    baseUrl: 'https://bx.in.th/api',
    // apikey: '10b9e16bc7da4ecd90d086ad35b8c9d4',
    // apisecret: '2d7ddfa50904483cbac3bae74cf3bb00',
    // nonce: getNonce(),
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

export class Bxin {
    static getDepth(pair) {
        var op = request_options;

        op.uri = opts.baseUrl + `/orderbook/?pairing=${pair}`;

        return sendRequestCallback(op);
    };
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