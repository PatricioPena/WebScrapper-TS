
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
    if(html.includes("<h1>")){
        const split: string[] = html.split("<h1>");
        const firstHeaderLeft = split[1];
        const splitFirst = firstHeaderLeft.split("</h1>");
        return splitFirst[0];
    }
    else if(html.includes("<h2>")){
        const split: string[] = html.split("<h2>");
        const firstHeaderTwoLeft = split[1];
        const splitFirst = firstHeaderTwoLeft.split("</h2>");
        return splitFirst[0];
    }
    else{
        return "Exception -> Html does not contain H1 or H2"
    }
}
