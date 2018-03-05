    // addCodePreviewBtn - Adds a button to a Jira issue page for previewing code snippets
    function addCodePreviewBtn() {
        //const codeNames = ['Issue Code', 'Recommended Code', /*'Remediation Guidance'*/];
        const codePanels = document.querySelectorAll('.code.panel');
        for (let i = 0; i < codePanels.length; i++) {
            const c = codePanels[i].querySelector('.codeContent.panelContent');
            if (c) {
                const previewBtn = document.createElement('button');
                previewBtn.setAttribute('class', 'aui-button');
                const previewBtnName = document.createTextNode('Preview Code');
                previewBtn.appendChild(previewBtnName);
                bindEvent(previewBtn, 'click', function(e) {
                    previewCode(e.target);
                });
                //c.parentNode.appendChild(previewBtn);
                document.body.appendChild(previewBtn);
            }
        }

        // Code preview is going to require highlight.js, so we need to add a reference to it.
        // <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
        const s = document.createElement('script');
        s.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js');
        document.head.appendChild(s);

        // Also include the highlight.js styles
        // <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
        const l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css');
        document.head.appendChild(l);

        // Plus some custom styling
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
          /* a11y-light theme */
          /* Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css */
          /* @author: ericwbailey */
          /* modified by patrickhlauke: darkened "deep cerulean" #007faa to #007ea0 to allow for sufficient contrast against custom <mark> element */

          /* Comment */
          .hljs-comment,
          .hljs-quote {
            color: #696969;
          }

          /* Red */
          .hljs-variable,
          .hljs-template-variable,
          .hljs-tag,
          .hljs-name,
          .hljs-selector-id,
          .hljs-selector-class,
          .hljs-regexp,
          .hljs-deletion {
            color: #d91e18;
          }

          /* Orange */
          .hljs-number,
          .hljs-built_in,
          .hljs-builtin-name,
          .hljs-literal,
          .hljs-type,
          .hljs-params,
          .hljs-meta,
          .hljs-link {
            color: #aa5d00;
          }

          /* Yellow */
          .hljs-attribute {
            color: #aa5d00;
          }

          /* Green */
          .hljs-string,
          .hljs-symbol,
          .hljs-bullet,
          .hljs-addition {
            color: #008000;
          }

          /* Blue */
          .hljs-title,
          .hljs-section {
            color: #007ea0;
          }

          /* Purple */
          .hljs-keyword,
          .hljs-selector-tag {
            color: #7928a1;
          }

          .hljs {
            display: block;
            overflow-x: auto;
            background: #fefefe;
            color: #545454;
            padding: 0.5em;
          }

          .hljs-emphasis {
            font-style: italic;
          }

          .hljs-strong {
            font-weight: bold;
          }

          @media screen and (-ms-high-contrast: active) {
            .hljs-addition,
            .hljs-attribute,
            .hljs-built_in,
            .hljs-builtin-name,
            .hljs-bullet,
            .hljs-comment,
            .hljs-link,
            .hljs-literal,
            .hljs-meta,
            .hljs-number,
            .hljs-params,
            .hljs-string,
            .hljs-symbol,
            .hljs-type,
            .hljs-quote {
                  color: highlight;
              }

              .hljs-keyword,
              .hljs-selector-tag {
                  font-weight: bold;
              }
          }      
        `;
        document.head.appendChild(style);
    }

    function previewCode(target) {
        let s = target.previousSibling.querySelector("pre.code-html").textContent;
        let r = highlight(strikethrough(s));
        previewCodeDialog(r);
    }

    function previewCodeDialog(content) {
        lastFocus = document.activeElement;
        const background = document.createElement("div");
        background.setAttribute("id", "dlgCodePreviewBackground");
        background.setAttribute("tabindex", "-1");
        background.style.cssText = "position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;background-color: rgba(0,0,0,.75);display: flex;align-items: center;justify-content: center;z-index: 1000;";
        document.body.appendChild(background);

        const dialog = document.createElement("div");
        dialog.setAttribute("id", "dlgCodePreviewDialog");
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-labelledby", "dlgCodePreviewTitle");
        dialog.setAttribute("aria-hidden", false);
        dialog.style.cssText = "border:2px #000000 solid;border-radius:10px;background:#ffffff;display:flex;flex-direction:column;justify-content:space-between:height:12%;";
        bindEvent(dialog, "keydown", function(e) {
            e = e || event;
            switch (e.keyCode) {
                case 9: // Tab
                    var ctrls = dialog.querySelectorAll(".tabable");
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
        dialogTitle.innerHTML = 'Code Preview';
        dialogTitle.style.cssText = 'margin:10px;';
        dialog.appendChild(dialogTitle);

        const dialogContent = document.createElement('div');
        dialogContent.innerHTML = '<pre><code class="hljs xml">' + content + '</code></pre>';
        dialogContent.style.cssText = 'margin:10px;';
        dialog.appendChild(dialogContent);
        //hljs.highlight('html', dialogContent.innerHTML, true);
        hljs.highlightBlock(dialogContent);

        const dialogCloseBtn = document.createElement('button');
        dialogCloseBtn.setAttribute('id', 'dlgCodePreviewCloseBtn');
        dialogCloseBtn.setAttribute('class', 'aui-button tabable');
        dialogCloseBtn.innerHTML = 'Close';
        dialogCloseBtn.style.cssText = 'margin:10px;width:100px;flex:1 1 auto;align-self:flex-end;';
        bindEvent(dialogCloseBtn, 'click', function(e) {
            closePreviewDlg();
        });
        dialog.appendChild(dialogCloseBtn);

        document.body.setAttribute("aria-hidden", true);
        dialog.querySelector('#dlgCodePreviewCloseBtn').focus();
    }

    function closePreviewDlg() {
        document.body.setAttribute("aria-hidden", false);
        try {
            const bg = document.querySelector("#dlgCodePreviewBackground");
            if (bg) {
                bg.removeChild(document.querySelector("#dlgCodePreviewDialog"));
                document.body.removeChild(bg);
            }
        } catch (e) {
            console.log(e);
        }
        if (lastFocus) {
            lastFocus.focus();
        }
    }

