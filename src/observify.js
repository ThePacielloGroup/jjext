'use strict';

const modify = require('./modify.js');
const editfy = require('./editfy.js');

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
				}
				break;
			default:
				break;
		}
	});
}



