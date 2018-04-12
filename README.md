First install required packages:

    npm install

To build the userscript:

    npm run build:user

(output to dist/extension/content_scripts/tpg_jira_jubilee.user.js)

To build the Firefox extension:

    npm run build:ff

(output to dist/web-ext-artifacts)

To build the Chrome zip (to submit for publishing):

    npm run build:chrome

(output to dist/chrome)

To sign the extension:

    web-ext sign -s ./dist/extension -a ./dist/web-ext-artifacts --api-key=[API_KEY] --api-secret=[API_SECRET]

API_KEY & API_SECRET obtained from Mozilla Developer Hub account.
