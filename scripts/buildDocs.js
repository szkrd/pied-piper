/*global find:false, cat:false*/
require('shelljs/global')
const meta = require('../package.json');
const showdown = require('showdown')
showdown.setFlavor('github')

let mds = find('server/routes').filter(fn => fn.match(/README.md$/))
let text = mds.map(fn => cat(fn) + '').join('\n')

text.to('api.md')
let converter = new showdown.Converter()
let html = converter.makeHtml(text);

`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Pied Piper API</title>
    <link rel="stylesheet" href="//cdn.rawgit.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css">
    <style type="text/css">
      body { font-face: arial, helvetica; }
      h1.page-title { text-align: right; padding: 5px; margin: 0; font-size: 25px; color: #4e9a06; }
      .markdown-body h1 { color: #eeeeec; background-color: #2e3436; border-radius: 5px; padding: 5px 10px; }
      .markdown-body h2 { text-decoration: underline; color: #3465a4; }
    </style>
  </head>
  <body>
    <h1 class="page-title">${meta.name} v${meta.version}</h1>
    <div class="markdown-body">${html}</div>
  </body>
</html>
`.to('docs/index.html')
