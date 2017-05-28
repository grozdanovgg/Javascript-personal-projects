function request(method, url, options) {
    let headers = {};
    let body = {};
    if (options) {
        headers = options.headers;
        body = options.body;
    }

    const promise = new Promise((resolve, reject) => $.ajax({
        url,
        method,
        // Interferes with yahoo query 
        // contentType: 'application/json',
        headers: headers,
        data: JSON.stringify(body),
        success: resolve,
        error: reject
    }));
    return promise;
}

export class Request {

    static get(url, options) {
        return request('GET', url, options);
    }

    static post(url, options) {
        return request('POST', url, options);
    }

    static put(url, options) {
        return request('PUT', url, options);
    }
}