'use strict';
import { CryptoJS as hmac_sha512 } from '../../node_modules/node.bittrex.api/hmac-sha512.js';
import request from 'request';
// import JSONStream from 'JSONStream';
// var request = require('request'),
// let hmac_sha512 = require('../../node_modules/node.bittrex.api/hmac-sha512.js');
// JSONStream = require('JSONStream'),
// es = require('event-stream');
export function bittrexController() {


    // console.log('hey in');


    bittrex.options({
        'apikey': '10b9e16bc7da4ecd90d086ad35b8c9d4',
        'apisecret': '2d7ddfa50904483cbac3bae74cf3bb00',
        'stream': false,
        'verbose': true,
        'cleartext': false
    });

    bittrex.getbalance({ currency: 'BTC' }, function(data) {
        console.log(data);
    })

}

var start,
    request_options = {
        method: 'GET',
        agent: false,
        headers: {
            "User-Agent": "Mozilla/4.0 (compatible; Node Bittrex API)",
            "Content-type": "application/x-www-form-urlencoded"
        }
    };

var opts = {
    baseUrl: 'https://bittrex.com/api/v1.1',
    apikey: 'APIKEY',
    apisecret: 'APISECRET',
    verbose: false,
    cleartext: false,
    stream: false
};

var getNonce = function() {
    return Math.floor(new Date().getTime() / 1000);
};

var extractOptions = function(options) {

    var o = Object.keys(options),
        i;
    for (i = 0; i < o.length; i++) {
        opts[o[i]] = options[o[i]];
    }
};

var apiCredentials = function(uri) {

    var options = {
        apikey: opts.apikey,
        nonce: getNonce()
    };

    return setRequestUriGetParams(uri, options);
};

var setRequestUriGetParams = function(uri, options) {
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

var updateQueryStringParameter = function(uri, key, value) {

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }

    return uri;
};

var sendRequestCallback = function(callback, op) {
    start = Date.now();

    switch (opts.stream) {

        case true:
            request(op)
                .pipe(JSONStream.parse('*'))

            break;
        case false:
            request(op, function(error, result, body) {
                if (!body || !result || result.statusCode != 200) {
                    callback({ error: error, result: result });
                } else {
                    callback(((opts.cleartext) ? body : JSON.parse(body)));
                    ((opts.verbose) ? console.log("requested from " + result.request.href + " in: %ds", (Date.now() - start) / 1000) : '');

                }
            });
            break;
    }
};



let bittrex = {
    options: function(options) {
        extractOptions(options);
    },
    sendCustomRequest: function(request_string, callback, credentials) {
        var op;

        if (credentials === true) {
            op = apiCredentials(request_string);
        } else {
            op = request_options;
            op.uri = request_string;
        }
        sendRequestCallback(callback, op);
    },
    getmarkets: function(callback) {
        var op = request_options;
        op.uri = opts.baseUrl + '/public/getmarkets';
        sendRequestCallback(callback, op);
    },
    getcurrencies: function(callback) {
        var op = request_options;
        op.uri = opts.baseUrl + '/public/getcurrencies';
        sendRequestCallback(callback, op);
    },
    getticker: function(options, callback) {
        var op = setRequestUriGetParams(opts.baseUrl + '/public/getticker', options);
        sendRequestCallback(callback, op);
    },
    getmarketsummaries: function(callback) {
        var op = request_options;
        op.uri = opts.baseUrl + '/public/getmarketsummaries';
        sendRequestCallback(callback, op);
    },
    getmarketsummary: function(options, callback) {
        var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarketsummary', options);
        sendRequestCallback(callback, op);
    },
    getorderbook: function(options, callback) {
        var op = setRequestUriGetParams(opts.baseUrl + '/public/getorderbook', options);
        sendRequestCallback(callback, op);
    },
    getmarkethistory: function(options, callback) {
        var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarkethistory', options);
        sendRequestCallback(callback, op);
    },
    buylimit: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/buylimit'), options);
        sendRequestCallback(callback, op);
    },

    buymarket: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/buymarket'), options);
        sendRequestCallback(callback, op);
    },
    selllimit: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/selllimit'), options);
        sendRequestCallback(callback, op);
    },
    sellmarket: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/sellmarket'), options);
        sendRequestCallback(callback, op);
    },
    cancel: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/cancel'), options);
        sendRequestCallback(callback, op);
    },
    getopenorders: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/getopenorders'), options);
        sendRequestCallback(callback, op);
    },
    getbalances: function(callback) {
        var op = apiCredentials(opts.baseUrl + '/account/getbalances');
        sendRequestCallback(callback, op);
    },
    getbalance: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getbalance'), options);
        sendRequestCallback(callback, op);
    },
    getwithdrawalhistory: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getwithdrawalhistory'), options);
        sendRequestCallback(callback, op);
    },
    getdepositaddress: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdepositaddress'), options);
        sendRequestCallback(callback, op);
    },
    getdeposithistory: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdeposithistory'), options);
        sendRequestCallback(callback, op);
    },
    getorderhistory: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorderhistory'), options);
        sendRequestCallback(callback, op);
    },
    getorder: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorder'), options);
        sendRequestCallback(callback, op);
    },
    withdraw: function(options, callback) {
        var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/withdraw'), options);
        sendRequestCallback(callback, op);
    }

};