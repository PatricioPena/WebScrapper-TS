import {JSDOM} from "jsdom";
import {type} from "node:os";
import pLimit from "p-limit";

export type ExtractedPageData = {
    url: string,
    heading: string,
    first_paragraph: string,
    outgoing_links: string[],
    image_urls: string[]
}

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

        if (href === null) {
            continue;
        }

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


export function extractPageData(html:string, pageURL: string): ExtractedPageData{
    try{
        return {
            url: pageURL,
            heading: getHeadingFromHTML(html),
            first_paragraph: getFirstParagraphFromHTML(html),
            outgoing_links: getURLsFromHTML(html, pageURL),
            image_urls: getImagesFromHTML(html, pageURL)
        }
    }
    catch {
     throw new Error("Could not extract page data");
    }
}


export async function getHTML(url: string){
   try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "BootCrawler/1.0"
            },

        });
        if(response.status > 399){
            console.log("Error-level code");
            return;
        }
        if(!response.headers.get("content-type")?.includes("text/html")){
            console.log("Error, content format is not HTML");
            return;
        }
        return response.text();
    }catch(error) {
        console.log("unexpected error: ", error);
   }
}

export async function crawlPage(baseURL:string, currentUrl: string, pages: Record<string, number> = {}){
    const currentURLObj = new URL(currentUrl);
    const baseURLObj = new URL(baseURL);

    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeURL(currentUrl)?.toString();

    if(normalizedURL == undefined){
        return pages;
    }
    if(pages[normalizedURL] !== undefined){
        pages[normalizedURL] += 1;
        return pages;
    }
    else{
        pages[normalizedURL] = 1;
    }
    try {
        const currentHTML = await getHTML(currentUrl);

        console.log(currentHTML);
        if (currentHTML != null) {
            const foundURLs = getURLsFromHTML(currentHTML, currentUrl);
            for(let i = 0; i < foundURLs.length; i++){
                pages = await crawlPage(baseURL, foundURLs[i], pages);
            }
        }
    }
    catch (error){
        console.log("Unexpected Error: ", error);
    }
    return pages
}

class ConcurrentCrawler {
    baseURL: string;
    pages: Record<string, number>;
    limit: Function;
    // added
    maxPages: number;
    shouldStop: boolean;
    allTasks: Set<Promise<void>>
    visited: Set<string>

    constructor(baseURL: string, maxConcurrency: number = 5, maxPages: number) {
        this.baseURL = baseURL;
        this.pages = {};
        this.limit = pLimit(maxConcurrency);
        this.maxPages = maxPages;
        this.shouldStop = false;
        this.allTasks = new Set();
        this.visited = new Set();
    }

    private addPageVisit(normalizedURL: string){
        if(this.shouldStop){
            return false;
        }
        if(this.visited.has(normalizedURL)){
            return false;
        }
        if(this.visited.size == this.maxPages){
            this.shouldStop = true;
            console.log("Reached maximum number of pages to crawl.");
            return false;
        }
        if(this.pages[normalizedURL] !== undefined){
            this.pages[normalizedURL] += 1;
            return false;
        }
        else{
            this.pages[normalizedURL] = 1;
            this.visited.add(normalizedURL);
            return true;
        }
    }

    private async getHTML(currentURL: string){
        {
            return await this.limit(async () =>{
                try {
                    const response = await fetch(currentURL, {
                        method: "GET",
                        headers: {
                            "User-Agent": "BootCrawler/1.0"
                        },

                    });
                    if(response.status > 399)
                    {
                        console.log("Error-level code");
                        return;
                    }
                    if (!response.headers.get("content-type")?.includes("text/html")) {
                        console.log("Error, content format is not HTML");
                        return;
                    }
                    return response.text();
                }
                catch(error)
                {
                    console.log("unexpected error: ", error);
                }
            });
        }
    }

    async crawlPage(currentUrl: string):Promise<void> {

        if(this.shouldStop){
            return;
        }

        const currentURLObj = new URL(currentUrl);
        const baseURLObj = new URL(this.baseURL);

        if (currentURLObj.hostname !== baseURLObj.hostname) {
            return;
        }

        const normalizedURL = normalizeURL(currentUrl)?.toString();

        if(normalizedURL == undefined){
            return;
        }

        if(!this.addPageVisit(normalizedURL)){
           return;
        }

        console.log("Page crawled ", normalizedURL);

        const html = await this.getHTML(currentURLObj.toString());

        if(!html){
            return;
        }

        const allURLs = getURLsFromHTML(html, currentURLObj.toString())

        const promises = [] // allURLs.map((url) => this.crawlPage(url));

        for(let i = 0; i < allURLs.length; i++){
            const value = this.crawlPage(allURLs[i]);

            promises.push(value);

            this.allTasks.add(value);
            value.finally(()  => {
                this.allTasks.delete(value);
            })
        }

        await Promise.all(promises);
    }

    public async crawl(){
        await this.crawlPage(this.baseURL)
        return this.pages;
    }

}

export async function crawlSiteAsync(baseURL: string, maxConcurrency: number = 5, maxPages: number = 1){
     const newCrawler = new ConcurrentCrawler(baseURL, maxConcurrency, maxPages);
     return await newCrawler.crawl();
}