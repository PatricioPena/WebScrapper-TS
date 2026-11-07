import { expect, test} from "vitest"
import {normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML, getURLsFromHTML, getImagesFromHTML, extractPageData} from "./crawl"

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
    const expected:string[] = []
    expect(actual).toEqual(expected)
})

// getImagesFromHTML ----------

test("", ()=>{
    const baseURL = "https://www.example.com"
    const html = '<html><body><img src="/logo.png" alt="Logo"></body></html>'

    const actual = getImagesFromHTML(html, baseURL);
    const expected = ["https://www.example.com/logo.png"]
    expect(actual).toEqual(expected)
})

test("", () => {
    const baseURL = "https://www.example.com"
    const html = '<html><body><span>Boot.dev</span></body></html>'

    const actual = getImagesFromHTML(html, baseURL);
    const expected:string[] = []
    expect(actual).toEqual(expected)
})

// extractPageData ----------

test("", ()=>{
    const inputURL = "https://crawler-test.com";
    const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

    const actual = extractPageData(inputBody, inputURL);
    const expected = {
        url: "https://crawler-test.com",
        heading: "Test Title",
        first_paragraph: "This is the first paragraph.",
        outgoing_links: ["https://crawler-test.com/link1"],
        image_urls: ["https://crawler-test.com/image1.jpg"],
    };

    expect(actual).toEqual(expected);
})