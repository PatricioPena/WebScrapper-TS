import {ExtractedPageData} from "./crawl";
import * as fs from "node:fs";
import * as path from "node:path";

export function writeJSONReport(
    pageData: Record<string, ExtractedPageData>,
    filename = "report.json",
): void{
    const sorted = Object.values(pageData).sort((a, b) => a.url.localeCompare(b.url))

    const file = JSON.stringify(sorted, null, 2);
    const p = path.resolve(process.cwd(), filename)

    fs.writeFileSync(p, file);
}