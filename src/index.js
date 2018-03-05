'use strict';

const modify = require('./modify.js');
const verify = require('./verify.js');
const observify = require('./observify.js');

// Make sure we're on a Jira page.
if (document.querySelector('meta[name="application-name"][content="JIRA"]')) {
	// In order to get selects to accept a new size, we have to hack Jira's select styling and set the height to auto, rather than a fixed size.
	const sheet = document.querySelector('link[href*="batch.css"][data-wrm-key*="jira.view.issue"]').sheet;
	if (sheet) {
		const cssRules = sheet.cssRules;
		for (let i = 0; i < cssRules.length; i++) {
			if (cssRules[i].cssText.indexOf('.editable-field form.aui .select') > 0) {
				if (cssRules[i].cssText.indexOf('height:') > 0) {
					cssRules[i].style.height = 'auto';
					break;
				}
			}
		}
	}
	//addCodePreviewBtn();
	verify.addAltVerifyBtn();
	modify.modifySelects(document);
	observify.myObserver.observe(document.documentElement, {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});
}
