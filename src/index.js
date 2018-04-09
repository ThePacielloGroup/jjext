'use strict';

console.log("JJEXT Init");

console.log("require modify");
const modify = require('./modify.js');
console.log("require verify");
const verify = require('./verify.js');
console.log("require examples");
const examples = require('./examples.js');
console.log("require observe");
const observify = require('./observify.js');
console.log("require preview");
const preview = require('./preview.js');

console.log("checking page");
// Make sure we're on a Jira page.
if (document.querySelector('meta[name="application-name"][content="JIRA"]')) {
	console.log("on Jira page");
	// In order to get selects to accept a new size, we have to hack Jira's select styling and set the height to auto, rather than a fixed size.
	console.log("checking sheet");
	const sheet = document.querySelector('link[href*="batch.css"][data-wrm-key*="jira.view.issue"]');
	console.log(sheet);
	if (sheet) {
		console.log("got sheet");
		let cssRules = null;
		try {
            cssRules = sheet.sheet.cssRules;
        } catch (e) {
			// CSS probably comes from a different domain, so we can't access cssRules
		}
		console.log(cssRules);
		if (cssRules) {
            for (let i = 0; i < cssRules.length; i++) {
                console.log(i);
                if (cssRules[i].cssText.indexOf('.editable-field form.aui .select') > 0) {
                    if (cssRules[i].cssText.indexOf('height:') > 0) {
                        cssRules[i].style.height = 'auto';
                        break;
                    }
                }
            }
        }
		console.log("done with sheet");
	}
	console.log("Adding code preview");
	preview.addCodePreviewBtn();
	console.log("Adding verify alt");
	verify.addAltVerifyBtn();
	console.log("Adding examples");
	examples.addExamplesBtn();
	console.log("Modifying selects");
	modify.modifySelects(document);
	console.log("Observing");
	observify.myObserver.observe(document.documentElement, {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});
}