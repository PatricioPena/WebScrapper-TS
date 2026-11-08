import { argv } from 'node:process';
import {crawlPage, crawlSiteAsync, getHTML} from "./crawl";

async function main(){
    const lineItems = argv;
    if(lineItems.length == 2){
        console.log("No arguments where passed...");
        process.exit(1);
    }
    else if(lineItems.length > 5){
        console.log("Too many arguments where passed...");
        process.exit(1);
    }
    else{
        console.log("Starting the crawler...");
        const pages = await crawlSiteAsync(lineItems[2], Number(lineItems[3]), Number(lineItems[4]));

        console.log("Finished crawling.");
        const firstPage = Object.values(pages)[0];
        if (firstPage) {
            console.log(
                `First page record: ${firstPage["url"]} - ${firstPage["heading"]}`,
            );
        }
        console.log(pages);
        process.exit(0);
    }
}

main();