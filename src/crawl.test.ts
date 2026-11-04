import { expect, test} from "vitest"
import { normalizeURL, getHeadingFromHTML } from "./crawl"

// NormalizeURL Function ----------
test("", ()=> {
    expect(normalizeURL("www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path");
})

test("", ()=> {
    expect(normalizeURL("www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path");
})

test("", ()=> {
    expect(normalizeURL("https://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path");
})

test("", ()=> {
    expect(normalizeURL("https://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path");
})

test("", ()=> {
    expect(normalizeURL("http://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path");
})

test("", ()=> {
    expect(normalizeURL("http://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path");
})

// GetHeadingFromHTML Function ----------
const htmlWithH1: string = "<html><body>\n" +
    "      <p>Outside paragraph.</p>\n" +
    "      <main>\n" +
    "        <h1>First paragraph.</h1>\n" +
    "        <h2>Second paragraph.</h2>\n" +
    "      </main>\n" +
    "    </body></html>"

const htmlWithH2: string = "<html><body>\n" +
    "      <p>Outside paragraph.</p>\n" +
    "      <main>\n" +
    "        <h2>Second paragraph.</h2>\n" +
    "        <h3>Third paragraph.</h3>\n" +
    "      </main>\n" +
    "    </body></html>"

const htmlWithNoH1orH2: string = "<html><body>\n" +
    "      <p>Outside paragraph.</p>\n" +
    "      <main>\n" +
    "        <h3>Third paragraph.</h3>\n" +
    "        <h4>Forth paragraph.</h4>\n" +
    "      </main>\n" +
    "    </body></html>"

test("", ()=> {
    expect(getHeadingFromHTML(htmlWithH1)).toEqual("First paragraph.");
})

test("", ()=> {
    expect(getHeadingFromHTML(htmlWithH2)).toEqual("Second paragraph.");
})

test("", ()=> {
    expect(getHeadingFromHTML(htmlWithNoH1orH2)).toEqual("Exception -> Html does not contain H1 or H2");
})
