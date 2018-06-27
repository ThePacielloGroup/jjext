'use strict';

exports.addEscapeCheck = function(node) {
    const textareas = node.querySelectorAll('textarea');
    if (textareas && textareas.length === 1) {
        // Store the beginning value
        const textarea = textareas[0];
        let original = textarea.value;
        textarea.addEventListener('keydown', (evt) => {
            // If escape is pressed
            if (evt.keyCode === 27) {
                // Check to see if the content changed
                let blocked = false;
                if (evt.target.value !== original) {
                    if (!confirm('Hang on. You pressed escape, but the content has changed. Did you really mean to cancel your changes?')) {
                        blocked = true;
                        evt.target.focus();
                    }
                }

                if (!blocked) {
                    // The cancel was on purpose, so click the cancel button.
                    const cancelBtn = node.querySelector('button[type=cancel]');
                    if (cancelBtn) {
                        cancelBtn.click();
                    }
                }
            }
        }, true);
    }
};