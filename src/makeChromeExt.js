'use strict';

const fs = require('fs-extra');
const exec = require('child_process').exec;
const archiver = require('archiver');
const { version } = require('../package.json');
const chromeDir = './dist/chrome';
const filename = chromeDir + '/jira_jubilee-' + version + '.zip';

if (!fs.existsSync(chromeDir)) {
    fs.mkdir(chromeDir);
}

fs.copy('./dist/extension', './dist/chrome').then(() => {
    // Remove unneeded files
    fs.unlink(chromeDir + '/.web-extension-id');
    // modify manifest
    let manifest = JSON.parse(fs.readFileSync(chromeDir + '/manifest.json'));
    delete manifest['applications'];
    fs.writeFileSync(chromeDir + '/manifest.json', JSON.stringify(manifest));
    const fileout = fs.createWriteStream(filename);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    fileout.on('close', function() {
        fs.unlink(chromeDir + '/manifest.json');
        fs.removeSync(chromeDir + '/icons');
        fs.removeSync(chromeDir + '/content_scripts');
       exec('ls -l ' + chromeDir, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            // Remove everything but the zip
       });
    });
    archive.pipe(fileout);
    archive.directory(chromeDir + '/content_scripts', 'content_scripts');
    archive.directory(chromeDir + '/icons', 'icons');
    archive.append(fs.createReadStream(chromeDir + '/manifest.json'), {name: 'manifest.json'});
    archive.finalize();
}).catch(err => console.error(err));