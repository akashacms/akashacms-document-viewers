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

import path from 'node:path';
import util from 'node:util';
import akasha, {
    Configuration,
    CustomElement,
    Munger,
    PageProcessor
} from 'akasharender';
const mahabhuta = akasha.mahabhuta;

const __dirname = import.meta.dirname;

const pluginName = "@akashacms/plugins-document-viewers";

export class DocumentViewersPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    #config;

    configure(config, options) {
        this.#config = config;
        this.options = options;
        options.config = config;
        this.akasha = config.akasha;
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addAssetsDir(path.join(__dirname, 'assets'));
        config.addMahabhuta(mahabhutaArray(options, config, this.akasha, this));
    }

    get config() { return this.#config; }

    isLegitLocalHref(config, href) {
        return href.startsWith("/vendor/Viewer.js/");
    }

}

var generateGoogleDocViewerUrl = function(documentUrl) {
    const uRet = new URL('https://docs.google.com/viewer');
    uRet.searchParams = new URLSearchParams({
            url: documentUrl, embedded: true
    });
    return uRet.toString();
    // return url.format({
    //     protocol: "http",
    //     hostname: "docs.google.com",
    //     pathname: "viewer",
    //     query: {
    //         url: documentUrl, embedded: true
    //     }
    // });
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

export function mahabhutaArray(
            options,
            config, // ?: Configuration,
            akasha, // ?: any,
            plugin  // ?: Plugin
) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new GoogleDocsViewerContent(config, akasha, plugin));
    ret.addMahafunc(new GoogleDocsViewLinkContent(config, akasha, plugin));
    ret.addMahafunc(new ViewerJSViewerContent(config, akasha, plugin));
    ret.addMahafunc(new ViewerJSViewLinkContent(config, akasha, plugin));
    return ret;
};

class GoogleDocsViewerContent extends CustomElement {
    get elementName() { return "googledocs-viewer"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "google-doc-viewer.html.ejs";
        if (!href) throw new Error("URL required for googledocs-viewer");

        return this.akasha.partial(this.config, template, {
            docViewerUrl: generateGoogleDocViewerUrl(href)
        });
    }
}

class GoogleDocsViewLinkContent extends CustomElement {
    get elementName() { return "googledocs-view-link"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "google-doc-viewer-link.html.ejs";
        if (!href) throw new Error("URL required for googledocs-view-link");
        var anchorText = $element.text();
        if (!anchorText) anchorText = "Click Here";

        return this.akasha.partial(this.config, template, {
            docViewerUrl: generateGoogleDocViewerUrl(href),
            anchorText
        });
    }
}

class ViewerJSViewerContent extends CustomElement {
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

        return this.akasha.partial(this.config, template, {
            docUrl: generateViewerJSURL(href),
            width, height
        });
    }
}

class ViewerJSViewLinkContent extends CustomElement {
    get elementName() { return "docviewer-link"; }
    process($element, metadata, dirty) {
        var href = $element.attr("href");
        var template = $element.attr('template');
        if (!template) template = "viewerjs-link.html.ejs";
        if (!href) throw new Error("URL required for docviewer-link");
        var anchorText = $element.text();
        if (!anchorText) anchorText = "Click Here";

        return this.akasha.partial(this.config, template, {
            docUrl: generateViewerJSURL(href),
            anchorText
        });
    }
}
