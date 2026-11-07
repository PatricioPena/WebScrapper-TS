import { argv } from 'node:process';
import {crawlPage, getHTML} from "./crawl";

async function main(){
    const lineItems = argv;
    if(lineItems.length == 2){
        console.log("No arguments where passed...");
        process.exit(1);
    }
    else if(lineItems.length > 3){
        console.log("Too many arguments where passed...");
        process.exit(1);
    }
    else{
        console.log("Starting the crawler...");
        //const crawled = await getHTML(lineItems[2]);
        //console.log(crawled);
        const crawl = await crawlPage(lineItems[2], lineItems[2]);
        process.exit(0);
    }
    //console.log(lineItems);
}

main();