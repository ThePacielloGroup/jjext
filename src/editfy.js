'use strict';

const general = require('./general.js');

exports.addToolbarButtons = function(node) {
	const toolbarMains = node.querySelectorAll('.aui-toolbar2');
	toolbarMains.forEach(function(toolbarMain) {
		const toolbarPrimary = toolbarMain.querySelector('.aui-toolbar2-primary');
		if (toolbarPrimary) {
			addHighlightBtn(toolbarMain, toolbarPrimary);
			addStrikethroughBtn(toolbarMain, toolbarPrimary);
			addKbdBtn(toolbarMain, toolbarPrimary);
		}
	});
};

function addHighlightBtn(toolbarMain, toolbarPrimary) {
	const b = document.createElement('button');
	b.innerHTML = '(??)';
	b.setAttribute('class', 'aui-button');
	b.setAttribute('title', 'Highlight (??)');
	b.setAttribute('aria-label', 'Highlight');
	const btnHandler = {
		toolbarMain: toolbarMain,
		handleEvent: function(e) {
			e.preventDefault && e.preventDefault();
			// a is the textarea
			const a = toolbarMain.parentNode.nextSibling.querySelector('textarea');
			const curPos = a.selectionStart;
			const markup = '??' + a.value.slice(a.selectionStart, a.selectionEnd) + '??';
			a.value = a.value.slice(0, a.selectionStart) + markup + a.value.slice(a.selectionEnd);
			a.focus();
			a.setSelectionRange(curPos + markup.length, curPos + markup.length);
		}
	};
	general.bindEvent(b, 'click', btnHandler);
	toolbarPrimary.appendChild(b);
};

function addStrikethroughBtn(toolbarMain, toolbarPrimary) {
	const b = document.createElement('button');
	b.innerHTML = '(~~)';
	b.setAttribute('class', 'aui-button');
	b.setAttribute('title', 'Strikethrough (??)');
	b.setAttribute('aria-label', 'Strikethrough');
	const btnHandler = {
		toolbarMain: toolbarMain,
		handleEvent: function(e) {
			e.preventDefault && e.preventDefault();
			// a is the textarea
			const a = toolbarMain.parentNode.nextSibling.querySelector('textarea');
			const curPos = a.selectionStart;
			const markup = '~~' + a.value.slice(a.selectionStart, a.selectionEnd) + '~~';
			a.value = a.value.slice(0, a.selectionStart) + markup + a.value.slice(a.selectionEnd);
			a.focus();
			a.setSelectionRange(curPos + markup.length, curPos + markup.length);
		}
	};
	general.bindEvent(b, 'click', btnHandler);
	toolbarPrimary.appendChild(b);
};

function addKbdBtn(toolbarMain, toolbarPrimary) {
	const b = document.createElement('button');
	b.innerHTML = '{{Kbd}}';
	b.setAttribute('class', 'aui-button');
	b.setAttribute('title', 'Keyboard (Kbd)');
	b.setAttribute('aria-label', 'Keyboard');
	const btnHandler = {
		toolbarMain: toolbarMain,
		handleEvent: function(e) {
			e.preventDefault && e.preventDefault();
			// a is the textarea
			const a = toolbarMain.parentNode.nextSibling.querySelector('textarea');
			const curPos = a.selectionStart;
			const markup = '{{kbd:' + a.value.slice(a.selectionStart, a.selectionEnd) + '}}';
			a.value = a.value.slice(0, a.selectionStart) + markup + a.value.slice(a.selectionEnd);
			a.focus();
			a.setSelectionRange(curPos + markup.length, curPos + markup.length);
		}
	};
	general.bindEvent(b, 'click', btnHandler);
	toolbarPrimary.appendChild(b);
};

/**
 * Replaces custom formatted strings to use HTML <mark> elements
 * @param {String} text Text to convert
 * @returns {void|*|{REPLACE, REPLACE_NEGATIVE}|String|string|XML}
 */
function highlight(text) {
	// Uses [\s\S] to capture multilines (See https://stackoverflow.com/questions/4544636/what-does-s-s-mean-in-regex-in-php/4544642#4544642)
	const regex = /\?{2}([\s\S]*?)\?{2}/gm;
	const subst = '<mark>$1</mark>';
	return text.replace(regex, subst);
}

/**
 * Replaces KB like strikethrough markup "~~" with HTML <del> elements
 * @param {String} text Text to convert
 * @returns {void|*|{REPLACE, REPLACE_NEGATIVE}|String|string|XML}
 */
function strikethrough(text) {
	// Uses [\s\S] to capture multilines (See https://stackoverflow.com/questions/4544636/what-does-s-s-mean-in-regex-in-php/4544642#4544642)
	const regex = /~{2}([\s\S]*?)~{2}/gm;
	const subst = '<del>$1</del>';
	return text.replace(regex, subst);
}

