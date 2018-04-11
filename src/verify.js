'use strict';

const general = require('./general.js');

// addAltVerifyBtn - Adds a button to a Jira issue page for verifying alt attributes
exports.addAltVerifyBtn = function () {
	const commandBar = document.querySelector('.command-bar .toolbar-split');
	if (commandBar) {
	    if (!commandBar.querySelector('#altVerifyBtn')) {
            const altBtn = document.createElement('button');
            altBtn.setAttribute('class', 'aui-button');
            altBtn.setAttribute('id', 'altVerifyBtn');
            const altBtnName = document.createTextNode('Verify Alts');
            altBtn.appendChild(altBtnName);
            general.bindEvent(altBtn, 'click', function () {
                verifyAlts();
            });
            commandBar.appendChild(altBtn);
        }
	}
};

// verifyAlts - Verifies the alt attributes in a Jira issue page
function verifyAlts() {
    let r = '';
	const modules = [
        {
            id: '#customfield_10035-val',
            name: 'Remediation'
        },
        {
            id: '#descriptionmodule',
            name: 'Description'
        }
    ];
	modules.forEach(function(module) {
        const jm = document.querySelector(module.id);
        if (jm) {
            const imgs = jm.querySelectorAll('img');
            if (imgs.length) {
                for (let i = 0; i < imgs.length; i++) {
                    const alt = imgs[i].getAttribute('alt');
                    const src = imgs[i].getAttribute('src').split('\\').pop().split('/').pop().split('?')[0];
                    if (alt === null || alt === '' || alt === src) {
                        r += module.name + ': ' + src + ' missing alt (currently ' + (alt === '' ? 'empty' : alt) + ')\r\n';
                    }
                }
            }
        }
	});
    if (r.length) {
        alert(r);
    } else {
        alert('Good to go!');
    }
}

