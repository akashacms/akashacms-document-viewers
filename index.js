/**
 *
 * Copyright 2013-2017 David Herron
 *
 * This file is part of AkashaCMS-document-viewers (http://akashacms.com/).
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use strict';

const path     = require('path');
const util     = require('util');
const url      = require('url');
const akasha   = require('akasharender');
const mahabhuta = akasha.mahabhuta;

const pluginName = "@akashacms/plugins-document-viewers";

const _plugin_config = Symbol('config');
const _plugin_options = Symbol('options');

module.exports = class DocumentViewersPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        this[_plugin_config] = config;
        this[_plugin_options] = options;
        options.config = config;
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addAssetsDir(path.join(__dirname, 'assets'));
        config.addMahabhuta(module.exports.mahabhutaArray(options));
    }

    get config() { return this[_plugin_config]; }
    get options() { return this[_plugin_options]; }

    isLegitLocalHref(config, href) {
        return href.startsWith("/vendor/Viewer.js/");
    }

}

var generateGoogleDocViewerUrl = function(documentUrl) {
    return url.format({
        protocol: "http",
        hostname: "docs.google.com",
        pathname: "viewer",
        query: {
            url: documentUrl, embedded: true
        }
    });
};

var generateViewerJSURL = function(docUrl) {
    if (docUrl.indexOf('http://') === 0 || docUrl.indexOf('https://') === 0) {
        return docUrl;
    } else if (docUrl.indexOf('/') === 0) {
        return "../../.."+ docUrl;
    } else {
        return "../../../"+ docUrl;
    }
};

module.exports.mahabhutaArray = function(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new GoogleDocsViewerContent());
    ret.addMahafunc(new GoogleDocsViewLinkContent());
    ret.addMahafunc(new ViewerJSViewerContent());
    ret.addMahafunc(new ViewerJSViewLinkContent());
    return ret;
};

class GoogleDocsViewerContent extends mahabhuta.CustomElement {
    get elementName() { return "googledocs-viewer"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "google-doc-viewer.html.ejs";
        if (!href) throw new Error("URL required for googledocs-viewer");

        return akasha.partial(this.array.options.config, template, {
            docViewerUrl: generateGoogleDocViewerUrl(href)
        });
    }
}

class GoogleDocsViewLinkContent extends mahabhuta.CustomElement {
    get elementName() { return "googledocs-view-link"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "google-doc-viewer-link.html.ejs";
        if (!href) throw new Error("URL required for googledocs-view-link");
        var anchorText = $element.text();
        if (!anchorText) anchorText = "Click Here";

        return akasha.partial(this.array.options.config, template, {
            docViewerUrl: generateGoogleDocViewerUrl(href),
            anchorText
        });
    }
}

class ViewerJSViewerContent extends mahabhuta.CustomElement {
    get elementName() { return "docviewer"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "viewerjs-embed.html.ejs";
        if (!href) throw new Error("URL required for docviewer");
        var width = $element.attr("width");
        if (!width) width = "100%";
        var height = $element.attr("height");
        if (!height) height = "900px";

        return akasha.partial(this.array.options.config, template, {
            docUrl: generateViewerJSURL(href),
            width, height
        });
    }
}

class ViewerJSViewLinkContent extends mahabhuta.CustomElement {
    get elementName() { return "docviewer-link"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "viewerjs-link.html.ejs";
        if (!href) throw new Error("URL required for docviewer-link");
        var anchorText = $element.text();
        if (!anchorText) anchorText = "Click Here";

        return akasha.partial(this.array.options.config, template, {
            docUrl: generateViewerJSURL(href),
            anchorText
        });
    }
}
