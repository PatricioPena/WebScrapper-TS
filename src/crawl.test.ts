import { expect, test} from "vitest"
import { normalizeURL } from "./crawl"

test("", ()=> {
    expect(normalizeURL("www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path")
})

test("", ()=> {
    expect(normalizeURL("www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path")
})


test("", ()=> {
    expect(normalizeURL("https://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path")
})

test("", ()=> {
    expect(normalizeURL("https://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path")
})

test("", ()=> {
    expect(normalizeURL("http://www.boot.dev/blog/path/")).toBe("www.boot.dev/blog/path")
})

test("", ()=> {
    expect(normalizeURL("http://www.boot.dev/blog/path")).toBe("www.boot.dev/blog/path")
})