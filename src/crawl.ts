import {JSDOM} from "jsdom";

export function normalizeURL(url: String){
    const split: string[] = url.split("//");

    if(split.length > 1){
        const newUrl:string = split[1];
        if(newUrl){
            if( newUrl.at(-1) == "/"){
                return newUrl.slice(0,-1);
            }
            return newUrl
        }
    }
    else {
        if(url.at(-1) == "/"){
            return url.slice(0,-1);
        }
        return url
    }
}

export function getHeadingFromHTML(html: string):string {
    try{
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const h1 = doc.querySelector("h1") ?? doc.querySelector("h2");
        return (h1?.textContent ?? "").trim();
    } catch{
        return ""
    }
}

export function getFirstParagraphFromHTML(html: string): string{
    try{
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const main = doc.querySelector("main");
        const p = main?.querySelector("p") ?? doc.querySelector("p");
        return (p?.textContent ?? "").trim();
    } catch {
        return "";
    }
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const links: string[] = [];

    for (const anchor of document.querySelectorAll("a")) {
        const href = anchor.getAttribute("href");

        // Skip anchors that do not have an href attribute.
        if (href === null) {
            continue;
        }

        // Handles both absolute URLs and relative paths.
        links.push(new URL(href, baseURL).href);
    }

    return links;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const images: string[] = [];

    for (const image of document.querySelectorAll("img")) {
        const src = image.getAttribute("src");

        // Skip images that do not have a src attribute.
        if (src === null) {
            continue;
        }

        images.push(new URL(src, baseURL).href);
    }

    return images;
}
