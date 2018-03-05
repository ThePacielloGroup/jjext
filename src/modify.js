'use strict';

// modifySelects - Makes select elements size match the number of their options
exports.modifySelects = function(node) {
	const sels = node.querySelectorAll('select[multiple]');
	if (sels) {
		sels.forEach(function (sel) {
			sel.setAttribute("size", sel.length);
		});
	}
}

