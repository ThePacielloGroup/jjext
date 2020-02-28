'use strict';

const modify = require('./modify.js');
const verify = require('./verify.js');
const examples = require('./examples.js');
const observify = require('./observify.js');
const preview = require('./preview.js');

// Make sure we're on a Jira page.
if (document.querySelector('meta[name="application-name"][content="JIRA"]')) {
	// In order to get selects to accept a new size, we have to hack Jira's select styling and set the height to auto, rather than a fixed size.
	const sheet = document.querySelector('link[href*="batch.css"][data-wrm-key*="jira.view.issue"]');
	if (sheet) {
		let cssRules = null;
		try {
            cssRules = sheet.sheet.cssRules;
        } catch (e) {
			// CSS probably comes from a different domain, so we can't access cssRules
		}
		if (cssRules) {
            for (let i = 0; i < cssRules.length; i++) {
                if (cssRules[i].cssText.indexOf('.editable-field form.aui .select') > 0) {
                    if (cssRules[i].cssText.indexOf('height:') > 0) {
                        cssRules[i].style.height = 'auto';
                    }
                }
                // While we're here, remove the width restriction from the remediation guidance container so that it's easier to read.
				if (cssRules[i].cssText.indexOf('.adg3 #details-module .item .editable-field') === 0) {
					if (cssRules[i].cssText.indexOf('max-width:') > 0) {
						cssRules[i].style.maxWidth = null;
					}
				}
            }
        }
	}

	// Add custom styles
	const jjStyles = document.createElement('style');
	jjStyles.textContent = 'img {max-width: 100%;} img#cp-img {max-width: unset;}';
	document.head.appendChild(jjStyles);

	preview.addCodePreviewBtn();
	verify.addAltVerifyBtn();
	examples.addExamplesBtn();
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