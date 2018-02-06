'use strict';

const formidable = require('formidable');

function parse(opts) {

    return (req, res, next) => {
        const form = new formidable.IncomingForm();
        Object.assign(form, opts);
        // form.on('error', (err) => {
        //     next(err);
        //     return;
        // });
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            Object.assign(req, {fields, files});
            next();
        });
    };
}

module.exports = parse;
exports.parse = parse; // backword compatibility