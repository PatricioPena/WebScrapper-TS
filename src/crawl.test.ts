import { expect, test} from "vitest"
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML, getURLsFromHTML } from "./crawl"

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

test("getHeadingFromHTML basic", () => {
    const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
    const actual = getHeadingFromHTML(inputBody);
    const expected = "Test Title";
    expect(actual).toEqual(expected);
});

test("getHeadingFromHTML h2 fallback", () => {
    const inputBody = `<html><body><h2>Fallback Title</h2></body></html>`;
    const actual = getHeadingFromHTML(inputBody);
    const expected = "Fallback Title";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML main priority", () => {
    const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "Main paragraph.";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML fallback to first p", () => {
    const inputBody = `
    <html><body>
      <p>First outside paragraph.</p>
      <p>Second outside paragraph.</p>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "First outside paragraph.";
    expect(actual).toEqual(expected);
});

// getURLsFromHTML ----------

test("", () => {
    const baseURL = "https://www.example.com"
    const html = '<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>'

    const actual = getURLsFromHTML(html, baseURL);
    const expected = "https://www.example.com/path/one"
    expect(actual[0]).toEqual(expected)
})

test("", () => {
    const baseURL = "https://www.example.com"
    const html = '<html><body><span>Boot.dev</span></body></html>'

    const actual = getURLsFromHTML(html, baseURL);
    const expected = "No '<a>' tags in the HTML body"
    expect(actual).toEqual(expected)
})