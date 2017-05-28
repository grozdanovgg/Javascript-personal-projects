import $ from 'jquery';
import { Request } from './requester';
import Handlebars from 'handlebars';

// const cached = {};

export function getTemplate(name) {

    // if (cached[name]) {
    //     return Promise.resolve(cached[name]);
    // }
    let result = Request.get(`../../templates/${name}.handlebars`)
        .then(template => {
            const compiledTemplate = Handlebars.compile(template);
            return Promise.resolve(compiledTemplate);
        })
        .catch((error) => {
            console.log(error);
        })
    return result;
}