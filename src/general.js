'use strict';

// bindEvent - Binds an event handler to an element
exports.bindEvent = function(element, type, handler, useCapture) {
	useCapture = (typeof useCapture === "undefined") ? false : useCapture;
	if (element.addEventListener) {
		element.addEventListener(type, handler, useCapture);
	} else {
		element.attachEvent("on" + type, handler);
	}
}