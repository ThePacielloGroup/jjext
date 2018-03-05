'use strict';

const general = require('./general.js');

// addAltVerifyBtn - Adds a button to a Jira issue page for verifying alt attributes
exports.addAltVerifyBtn = function () {
	const descMod = document.querySelector('div#descriptionmodule');
	if (descMod) {
		const altBtn = document.createElement('button');
		altBtn.setAttribute('class', 'aui-button');
		const altBtnName = document.createTextNode('Verify Alt(s)');
		altBtn.appendChild(altBtnName);
		general.bindEvent(altBtn, 'click', function() {
			verifyAlts();
		});
		descMod.parentNode.insertBefore(altBtn, descMod);
	}
}

// verifyAlts - Verifies the alt attributes in a Jira issue page's description block
function verifyAlts() {
	let r = '';
	const jm = document.querySelector('#descriptionmodule');
	if (jm) {
		const imgs = jm.querySelectorAll('img');
		if (imgs.length) {
			for (let i = 0; i < imgs.length; i++) {
				const alt = imgs[i].getAttribute('alt');
				const src = imgs[i].getAttribute('src').split('\\').pop().split('/').pop().split('?')[0];
				if (alt === null || alt === '' || alt === src) {
					r += src + ' missing alt (currently ' + (alt === '' ? 'empty' : alt) + ')\r\n';
				}
			}
			if (r.length) {
				alert(r);
			} else {
				alert('Good to go!');
			}
		} else {
			alert('No images found!');
		}
	} else {
		alert('No description module found! Are you on an issue page?');
	}
}

