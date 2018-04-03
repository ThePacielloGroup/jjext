'use strict';

const concat = require('concat');
const path = require('path');
const fs = require('fs');
const userscript_utils = require('userscript-utils').getUpdateMetablock;
const { version } = require('../package.json');

const src = process.argv[2];
const target = './dist/userscript/' + path.basename(src);
const meta = target.replace('.user', '.meta');

if (fs.existsSync(src)) {
    concat(['./include/userscript.header', src], target).then(function() {
            updateVersion();
        }
    );
}

function updateVersion() {
    if (fs.existsSync(target)) {
        fs.readFile(target, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            const result = data.replace(/__VERSION__/g, version);
            fs.writeFile(target, result, 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
        let x = userscript_utils.fromFileSync(target);
        x = x.replace(/__VERSION__/g, version);
        console.log(x);
        fs.writeFileSync(meta, x);
    }
}
