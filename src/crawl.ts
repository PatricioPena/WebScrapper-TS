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

export function getURLsFromHTML(html: string, baseURL: string){
    try{
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const allATags = doc.querySelectorAll("a");
        if(allATags.length == 0){
            return "No '<a>' tags in the HTML body"
        }
        const allATagsWithHref = [];
        for (let i = 0; i < allATags.length; i++){
            if(allATags[i]){
                allATagsWithHref.push(baseURL + allATags[i]);
            }
        }
        return allATagsWithHref;
    }catch{
        return "Error"
    }
}

/*
const inputURL = "https://crawler-test.com";
const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>
<a href="/path/two"><span>Boot.dev</span></a>
<a href="/path/three"><span>Boot.dev</span></a>
`;
console.log(getURLsFromHTML(inputBody, inputURL));
*/

export function getImagesFromHTML(html: string, baseURL: string):string{
    try{
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const allImgTags = doc.querySelectorAll("img");
        if(allImgTags.length == 0){
            return "No '<img>' tags in the HTML body"
        }
        const allImgTagsWithSrc = [];
        for (let i = 0; i < allImgTags.length; i++){
            if(allImgTags[i]){
                allImgTagsWithSrc.push(baseURL + allImgTags[i].getAttribute("src"));
            }
        }
        return allImgTagsWithSrc[0];
    }catch{
        return "Error"
    }
}

/*
const inputURL1 = "https://crawler-test.com";
const inputBody1 = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;
console.log(getImagesFromHTML(inputBody1, inputURL1));
*/

