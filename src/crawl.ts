
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



