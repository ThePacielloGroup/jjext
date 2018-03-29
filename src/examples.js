'use strict';

const general = require('./general.js');
let lastFocus = null;

// addExamplesBtn - Adds a button to a Jira dashboard issue page for listing all issues with an 'example' label
exports.addExamplesBtn = function () {
    const dash = document.querySelector('div#dash-options');
    if (dash) {
        const exampleBtn = document.createElement('button');
        exampleBtn.setAttribute('class', 'aui-button');
        const exampleBtnName = document.createTextNode('Examples');
        exampleBtn.appendChild(exampleBtnName);
        general.bindEvent(exampleBtn, 'click', function() {
            getExamples();
        });
        dash.insertBefore(exampleBtn, dash.firstChild);
    }
};

// getExamples - Gets issues with the 'example' label
function getExamples() {
    fetch('https://paciellogroup.atlassian.net/rest/api/2/search?jql=labels=example',{
        method: 'get',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(json => {parseExamples(json)});
}

// parseExamples - Parses the Jira json, putting relevant issue info into an html table
function parseExamples(json) {
    const issues = json.issues;
    if (issues && issues.length) {
        let content = '<table><caption>All issues with an "example" label</caption><tr><th>Issue ID</th><th>Type</th><th>Summary</th><th>WCAG SC</th></tr>';
        for(let i = 0; i < json.issues.length; i++) {
            const issue = json.issues[i];
            content += '<tr>' +
            '<td><a class="tabable" href="https://paciellogroup.atlassian.net/browse/' + issue.key + '">' + issue.key + '</a></td>' +
            '<td>' + issue.fields.issuetype.name + '</td>' +
            '<td><a class="tabable" href="https://paciellogroup.atlassian.net/browse/' + issue.key + '">' + issue.fields.summary + '</a></td><td>';
            const wcag = issue.fields.customfield_10036;
            for (let j = 0 ; j < wcag.length; j++) {
                content += wcag[j].value + (j < wcag.length - 1 ? '<br>' : '');
            }
            content += '</td></tr>';
        }
        content += '</table>';
        examplesDialog(content);
    }
}

// examplesDialog - Displays a modal with the example issues
function examplesDialog(content) {
    lastFocus = document.activeElement;
    const background = document.createElement("div");
    background.setAttribute("id", "dlgExamplesBackground");
    background.setAttribute("tabindex", "-1");
    background.style.cssText = "position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;background-color: rgba(0,0,0,.75);display: flex;align-items: center;justify-content: center;z-index: 1000;";
    document.body.appendChild(background);

    const dialog = document.createElement("div");
    dialog.setAttribute("id", "dlgExamplesDialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-labelledby", "dlgExamplesTitle");
    dialog.setAttribute("aria-hidden", false);
    dialog.style.cssText = "border:2px #000000 solid;border-radius:10px;background:#ffffff;display:flex;flex-direction:column;justify-content:space-between;width:60%;height:50%;";
    general.bindEvent(dialog, "keydown", function(e) {
        e = e || event;
        switch (e.keyCode) {
            case 9: // Tab
                let ctrls = dialog.querySelectorAll(".tabable");
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

    const styles = document.createElement("style");
    styles.setAttribute("type", "text/css");
    styles.innerHTML = "table {\n" +
        "  border-collapse: collapse;\n" +
        "  width: 99%;\n" +
        "}\n" +
        "th, td {\n" +
        "  padding: 0.25rem;\n" +
        "  text-align: left;\n" +
        "  border: 1px solid #ccc;\n" +
        "}\n" +
        "th {\n" +
        "  background: #dcdcdc;\n" +
        "}\n" +
        "tr:hover {\n" +
        "  background: #dcdcdc;\n" +
        "}\n";
    dialog.appendChild(styles);

    const dialogTitle = document.createElement('h1');
    dialogTitle.innerHTML = 'Example Issues';
    dialogTitle.style.cssText = 'margin:10px;';
    dialog.appendChild(dialogTitle);

    const dialogContent = document.createElement('div');
    dialogContent.innerHTML = content;
    dialogContent.style.cssText = 'margin:10px;overflow-y:scroll;';
    dialog.appendChild(dialogContent);

    const dialogCloseBtn = document.createElement('button');
    dialogCloseBtn.setAttribute('id', 'dlgExamplesCloseBtn');
    dialogCloseBtn.setAttribute('class', 'aui-button tabable');
    dialogCloseBtn.innerHTML = 'Close';
    dialogCloseBtn.style.cssText = 'margin:10px;width:100px;flex:1 1 auto;align-self:flex-end;';
    general.bindEvent(dialogCloseBtn, 'click', function(e) {
        closePreviewDlg();
    });
    dialog.appendChild(dialogCloseBtn);

    document.body.setAttribute("aria-hidden", true);
    document.body.style.overflow = "hidden";
    dialog.querySelector('#dlgExamplesCloseBtn').focus();
}

// closePreviewDlg - Closes the dialog
function closePreviewDlg() {
    document.body.setAttribute("aria-hidden", false);
    try {
        const bg = document.querySelector("#dlgExamplesBackground");
        if (bg) {
            bg.removeChild(document.querySelector("#dlgExamplesDialog"));
            document.body.removeChild(bg);
        }
        document.body.style.overflow = "auto";
    } catch (e) {
        console.log(e);
    }
    if (lastFocus) {
        lastFocus.focus();
    }
}


