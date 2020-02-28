'use strict';

const general = require('./general.js');
const btns = [
	{label: 'Highlight', html: '(??)', wrapper : {pre:'??', post:'??'}},
	{label: 'Strikethrough', html: '(~~)', wrapper: {pre:'~~', post:'~~'}},
    {label: 'Keyboard', html: '(Kbd)', wrapper: {pre:'{{kbd:', post:'}}'}},
    {label: 'Code', html: '(Code)', wrapper: {pre:'{{', post:'}}'}},
	];

exports.addToolbarButtons = function(node) {
	const toolbarMains = node.querySelectorAll('.aui-toolbar2');
	if (toolbarMains) {
        toolbarMains.forEach(function (toolbarMain) {
            const toolbarPrimary = toolbarMain.querySelector('.aui-toolbar2-primary');
            if (toolbarPrimary) {
                const buttonsDiv = document.createElement('div');
                buttonsDiv.setAttribute('class', 'aui-buttons');
                btns.forEach(btn => {
                    const btnTitle = '[title="' + btn.label + ' ' + btn.html + '"]';
                    if (!toolbarPrimary.querySelector(btnTitle)) {
                        buttonsDiv.appendChild(addBtn(toolbarMain, toolbarPrimary, btn));
                    }
                });
                toolbarPrimary.appendChild(buttonsDiv);
            }
        });
    }
};

function addBtn(toolbarMain, toolbarPrimary, btn) {
    const b = document.createElement('button');
    const parser = new DOMParser();
    const parsed = parser.parseFromString(btn.html, 'text/html');
    b.appendChild(parsed.body.firstChild);
    b.setAttribute('class', 'aui-button');
    b.setAttribute('title', btn.label + ' ' + btn.html);
    b.setAttribute('aria-label', b.getAttribute('title'));
    const btnHandler = {
        toolbarMain: toolbarMain,
        handleEvent: function(e) {
            e.preventDefault && e.preventDefault();
            // a is the textarea
            const a = toolbarMain.parentNode.nextSibling.querySelector('textarea');
            const curPos = a.selectionStart;
            const markup = btn.wrapper.pre + a.value.slice(a.selectionStart, a.selectionEnd) + btn.wrapper.post;
            a.value = a.value.slice(0, a.selectionStart) + markup + a.value.slice(a.selectionEnd);
            a.focus();
            a.setSelectionRange(curPos + markup.length, curPos + markup.length);
        }
    };
    general.bindEvent(b, 'click', btnHandler);
    return b;
}
