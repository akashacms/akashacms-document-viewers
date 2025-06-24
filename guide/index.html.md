---
layout: plugin-documentation.html.ejs
title: AskashaCMS Document Viewers plugin documentation
---

As popular as HTML is, other document formats such as PDF or various wordprocessor or spreadsheet files need to be displayed on web pages.  An example are sites like SlideShare or Scribd that let people upload Documents, making them embeddable on other sites much like YouTube or Vimeo allow you to upload videos and embed them on other websites.

What `@akashacms/plugins-document-viewers` does is allow the website author to embed rich documents on their website.  It does not provide support for embedding those documents on other websites.


# Installation

Add the following to `package.json`

```json
"dependencies": {
      ...
      "@akashacms/plugins-document-viewers": "^0.9.x",
      ...
}
```

Once added to `package.json` run: `npm install`

# Configuration

Add the following to `config.js`

```js
import { DocumentViewersPlugin } from '@akashacms/plugins-document-viewers';
config
    ...
    .use(DocumentViewersPlugin)
    ...
```

# Custom Tags

## ViewerJS PDF Viewer

ViewerJS (http://viewerjs.org/) is an excellent free document viewer written in JavaScript.  The heavy lifting is done by PDF.js, the PDF viewer used in Firefox.  The primary limitation is that the file being viewed must be hosted by the website.

```html
<docviewer  href="URL" template="TEMPLATE" width="WIDTH" height="HEIGHT"/>
```

Shows the document in-line on the current page.

```html
<docviewer-link  href="URL" template="TEMPLATE">Anchor Text</docviewer-link>
```

Links to a URL that will show the document.  The link will contain the _anchor text_ you provide.

## Google Docs Viewer

A little-known service provided by Google Docs is the ability to embed a document viewer into any website.  The document viewer can view pretty much any file format, since this is more-or-less the same viewer used in GMAIL or the preview mode in Google Docs.

There are some limitations to this viewer.  Google seems to want users of the document viewer to be logged into their Google Account, and if not then the available formats are limited.

```html
<googledocs-viewer href="URL" template="TEMPLATE"/>
```

This instantiates a document viewer showing the given file.

```html
<googledocs-view-link href="URL"
    template="TEMPLATE">
    Anchor Text
</googledocs-view-link>
```

This links to a Google URL that will start the document viewer.  The link will contain the _anchor text_ you provide.

To learn more about this excellent Google service, see: https://googlesystem.blogspot.com/2015/02/google-docs-viewer-page-no-longer.html#gsc.tab=0
