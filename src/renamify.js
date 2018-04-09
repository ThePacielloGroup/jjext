'use strict';

const general = require('./general.js');

let lastFocus = null;
let container = null;

// addRenameBtn - Adds a button to the attachment preview dialog for renaming
exports.addRenameBtn = function() {
    container = document.querySelector('#cp-title-container');
    if (container) {
        const renameBtn = document.createElement('button');
        renameBtn.setAttribute('class', 'aui-button');
        const renameBtnName = document.createTextNode('Rename Attachment');
        renameBtn.appendChild(renameBtnName);
        const attachmentName = container.innerText;
        general.bindEvent(renameBtn, 'click', function (e) {
            e.preventDefault();
            renameDlg(attachmentName);
        });
        // Add some space before adding the button
        container.firstElementChild.innerHTML += '&nbsp;';
        container.firstElementChild.appendChild(renameBtn);
    }
};

function renameDlg(attachmentName) {
    lastFocus = document.activeElement;
    const background = document.createElement("div");
    background.setAttribute("id", "dlgAttachmentRenameBackground");
    background.setAttribute("tabindex", "-1");
    background.style.cssText = "position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;background-color: rgba(0,0,0,.75);display: flex;align-items: center;justify-content: center;z-index: 1000;";
    container.appendChild(background);

    const dialog = document.createElement("div");
    dialog.setAttribute("id", "dlgAttachmentRenameDialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-labelledby", "dlgAttachmentRenameTitle");
    dialog.setAttribute("aria-hidden", false);
    dialog.style.cssText = "border:2px #000000 solid;border-radius:10px;background:#ffffff;display:flex;flex-direction:column;justify-content:space-between:height:12%;width:40%";
    general.bindEvent(dialog, "keydown", function(e) {
        e = e || event;
        switch (e.keyCode) {
            case 9: // Tab
                const ctrls = dialog.querySelectorAll(".tabable");
                if (e.shiftKey) {
                    if (e.target.isEqualNode(ctrls[0])) {
                        ctrls[ctrls.length - 1].focus();
                        e.preventDefault();
                    }
                } else {
                    if (e.target.isEqualNode(ctrls[ctrls.length -1])) {
                        ctrls[0].focus();
                        e.preventDefault();
                    }
                }
                break;
            case 27: // Escape
                closePreviewDlg();
                break;
            default:
                break;
        }
    });
    background.appendChild(dialog);

    const dialogTitle = document.createElement('h1');
    dialogTitle.setAttribute('id', 'dlgAttachmentRenameTitle');
    dialogTitle.innerHTML = 'Rename Attachment';
    dialogTitle.style.cssText = 'margin:10px;';
    dialog.appendChild(dialogTitle);

    const dialogContent = document.createElement('div');
    dialogContent.innerHTML = '<h2>Notes</h2><ol id="renameNotes">' +
        '<li>The page will reload after renaming. If you have unsaved work, save before renaming.</li>' +
        '<li>Any references to the previous file name will need to be updated manually.</li>' +
        '<li>If you do not have permissions to remove attachments in this issue, the attachment will be duplicated with the new filename. Contact the original author to have the previous attachment removed.</li>' +
    '</ol>';
    dialogContent.innerHTML += 'Name: ';
    dialogContent.style.cssText = 'margin:10px;border:1px #ededed solid;padding:1em;color:#000000;';
    dialog.appendChild(dialogContent);

    const dialogRenameInput = document.createElement('input');
    dialogRenameInput.setAttribute('type', 'text');
    dialogRenameInput.className = 'tabable';
    dialogRenameInput.setAttribute('id', 'attachmentName');
    dialogRenameInput.setAttribute('aria-label', 'Attachment Name');
    dialogRenameInput.setAttribute('aria-describedby', 'renameNotes');
    dialogRenameInput.value = attachmentName;
    dialogRenameInput.setAttribute('data-oldval', attachmentName);
    dialogRenameInput.style.cssText = 'border:1px solid #dcdcdc;outline:0;width:92%;padding:0.5em;';
    dialogContent.appendChild(dialogRenameInput);

    const dialogButtonContainer = document.createElement('div');
    dialogButtonContainer.style.cssText = 'display:flex;flex-direction:row;justify-content:right;';
    dialog.appendChild(dialogButtonContainer);

    const dialogRenameBtn = document.createElement('button');
    dialogRenameBtn.setAttribute('id', 'dlgAttachmentRenameBtn');
    dialogRenameBtn.setAttribute('class', 'aui-button tabable');
    dialogRenameBtn.innerHTML = 'Rename';
    dialogRenameBtn.style.cssText = 'margin:10px;width:100px;flex:0 0 auto;align-self:flex-end;';
    general.bindEvent(dialogRenameBtn, 'click', function(e) {
        renameAttachment(dialog.querySelector('#attachmentName').dataset.oldval, dialog.querySelector('#attachmentName').value);
    });
    dialogButtonContainer.appendChild(dialogRenameBtn);

    const dialogCloseBtn = document.createElement('button');
    dialogCloseBtn.setAttribute('id', 'dlgAttachmentRenameCloseBtn');
    dialogCloseBtn.setAttribute('class', 'aui-button tabable');
    dialogCloseBtn.innerHTML = 'Cancel';
    dialogCloseBtn.style.cssText = 'margin:10px;width:100px;flex:0 0 auto;align-self:flex-end;';
    general.bindEvent(dialogCloseBtn, 'click', function(e) {
        closePreviewDlg();
    });
    dialogButtonContainer.appendChild(dialogCloseBtn);

    container.setAttribute("aria-hidden", true);
    container.style.overflow = 'hidden';
    dialog.querySelector('#attachmentName').focus();
    dialog.querySelector('#attachmentName').select();
}

function closePreviewDlg() {
    container.setAttribute("aria-hidden", false);
    container.style.overflow = 'auto';
    try {
        const bg = container.querySelector("#dlgAttachmentRenameBackground");
        if (bg) {
            bg.removeChild(container.querySelector("#dlgAttachmentRenameDialog"));
            container.removeChild(bg);
        }
    } catch (e) {
        console.log(e);
    }
    if (lastFocus) {
        lastFocus.focus();
    }
}

function renameAttachment(oldName, newName) {
    let attachmentId = null;
    const issueKey = document.querySelector('meta[name=ajs-issue-key]');
    const issueID = issueKey.getAttribute('content');

    fetch('https://paciellogroup.atlassian.net/rest/api/latest/issue/' + issueID + '?fields=attachment',{
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        return getAttachments(response);
    }).then(attachments => {
        const attachment = getAttachment(attachments, oldName);
        attachmentId = attachment.id;
        return attachment;
    }).then(attachment => {
        return downloadAttachment(attachment);
    }).then(response => {
        return packAttachment(response, newName);
    }).then(payload => {
        return uploadAttachment(issueID, payload);
    }).then (response => {
        // Should check response here
        return getIssueDescription(issueID);
    }).then(response => {
        return massageDescription(response, oldName, newName);
    }).then(description => {
        return setDescription(issueID, description);
    }).then(response => {
        // Should check response here
        if (removeAttachment(attachmentId)) {
            alert('Success!');
            document.location.reload(true);
        } else {
            alert("Oops! Something didn't work right.");
        }
    });
    closePreviewDlg();
}

function getAttachments(response) {
    // Get the issue's attachments
    return response.json().then(json => {
        return json.fields.attachment;
    });
}

function getAttachment(attachments, oldName) {
    let attachment = null;
    for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].filename === oldName) {
            attachment = attachments[i];
            break;
        }
    }
    return attachment;
}

function downloadAttachment(attachment) {
    const attachmentId = attachment.id;
    // Download the attachment
    return fetch(attachment.content, {
        method:'get',
        credentials: 'same-origin'
    }).then(response => {
        return response;
    });
}

function packAttachment(response, newName) {
    // Package the attachment for uploading
    return response.blob().then(blob => {
        const fd = new FormData();
        fd.append('file', blob, newName);
        return fd;
    });
}

function uploadAttachment(issueID, payload) {
    // Upload the attachment
    return fetch('https://paciellogroup.atlassian.net/rest/api/latest/issue/' + issueID + '/attachments', {
        method: 'POST',
        credentials: 'same-origin',
        body: payload,
        headers: {
            "Accept": "application/json",
            "X-Atlassian-Token": "no-check"
        }
    }).then(response => {
        return response;
    });
}

function getIssueDescription(issueID) {
    // Get the issue description
    return fetch('https://paciellogroup.atlassian.net/rest/api/latest/issue/' + issueID + '?fields=description',{
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        return response;
    });
}

function massageDescription(response, oldName, newName) {
    // replace filename in description
    return response.json().then(json => {
        const regName = oldName.replace(/[.*+?^${}()|[\]\\]/, '\\$&');
        const regexp = new RegExp(regName, 'g');
        return json.fields.description.replace(regexp, newName);
    });
}

function setDescription(issueID, description) {
    return fetch('https://paciellogroup.atlassian.net/rest/api/latest/issue/' + issueID, {
        method: 'PUT',
        credentials: 'same-origin',
        body: "{\"fields\": { \"description\": \"" + description.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/"/g, '\"') + "\"}}",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response;
    });
}

function removeAttachment(attachmentId) {
    return fetch('https://paciellogroup.atlassian.net/rest/api/latest/attachment/' + attachmentId, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            "Accept": "application/json"
        }
    }).then(response => {
        return (response.status === 204);
    });
}