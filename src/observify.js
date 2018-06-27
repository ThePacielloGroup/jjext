'use strict';

const modify = require('./modify.js');
const editfy = require('./editfy.js');
const preview = require('./preview');
//const renamify = require('./renamify');
const verify = require('./verify.js');
const examples = require('./examples.js');
const savify = require('./savify.js');

exports.myObserver = new MutationObserver(
	function (mutations) {
		mutations.forEach(function (mutation) {
			observer(mutation);
		});
	}
);

// observer - Callback for the MutationObserver
function observer(mutation) {
	switch (mutation.type) {
		case 'childList':
			childListMutationHandler(mutation.addedNodes);
			break;
		case 'attributes':
			break;
		default:
			break;
	}
}

// childListMutationHandler - Handle the addition of nodes to the document
function childListMutationHandler(nodes) {
	nodes.forEach(function (node) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
				if (node.querySelectorAll('select[multiple]').length) {
					modify.modifySelects(node);
				}
				if (node.querySelector('div[id^="wiki-edit"].wiki-edit-toolbar')) {
					editfy.addToolbarButtons(node);
					savify.addEscapeCheck(node);
				}
				if (node.querySelectorAll('.code.panel').length) {
					preview.addCodePreviewBtn();
				}
				if (node.getAttribute('role') === 'dialog' && node.querySelector('#cp-title-container')) {
                    //renamify.addRenameBtn();
				}
                if (node.querySelector('.command-bar')) {
                    verify.addAltVerifyBtn();
                    examples.addExamplesBtn();
                }
				break;
			default:
				break;
		}
	});
}



