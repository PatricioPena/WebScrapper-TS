# WebScrapper-TS

A concurrent web crawler written in TypeScript. Starting from a single URL, it follows links within the same domain, extracts useful data from every page it visits, and writes the results to a JSON report.

## What it does

For each page it crawls, the tool extracts:

| Field             | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `url`             | The URL of the page                                                      |
| `heading`         | The first `<h1>` on the page (falls back to the first `<h2>`)            |
| `first_paragraph` | The first `<p>` inside `<main>` (falls back to the first `<p>` on page)  |
| `outgoing_links`  | Every `<a href>` on the page, resolved to absolute URLs                  |
| `image_urls`      | Every `<img src>` on the page, resolved to absolute URLs                 |

### Key features

- **Same-domain only** – links to other hostnames are ignored.
- **URL normalization** – `https://site.com/path/` and `http://site.com/path` are treated as the same page, so nothing is crawled twice.
- **Concurrency control** – uses [`p-limit`](https://github.com/sindresorhus/p-limit) to cap the number of simultaneous requests.
- **Page limit** – stops crawling once a maximum number of pages is reached.
- **Polite requests** – sends a `User-Agent: UserCrawler/1.0` header, skips error responses (status > 399), and skips non-HTML content.
- **JSON report** – results are sorted by URL and saved to `report.json`.

## Requirements

- **Node.js 22.15.0** (see `.nvmrc`)
- npm

If you use [nvm](https://github.com/nvm-sh/nvm), you can switch to the right version with:

```bash
nvm use
```

## Installation

```bash
npm install
```

## Usage

```bash
npm start -- <baseURL> <maxConcurrency> <maxPages>
```

| Argument         | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `baseURL`        | The URL to start crawling from (must include `https://`) |
| `maxConcurrency` | Maximum number of requests running at the same time     |
| `maxPages`       | Maximum number of pages to crawl before stopping        |

### Example

```bash
npm start -- https://examplescrapping.dev/test/accountpage/ 5 25
```

This crawls up to 25 pages starting from that URL, with at most 5 requests in flight at once. When it finishes, it prints the results to the console and writes them to `report.json` in the directory you ran the command from.

> **Note:** `npm start` runs `tsx ./src/main.ts`, so the source files are expected to live in the `src/` folder.

### Example output (`report.json`)

```json
[
  {
    "url": "https://examplescrapping.dev/test/accountpage/",
    "heading": "My Account Page",
    "first_paragraph": "All account information in one place",
    "outgoing_links": [
      "https://examplescrapping.dev/test/accountpage/info/"
    ],
    "image_urls": []
  }
]
```

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm start`     | Runs the crawler with `tsx` (no build needed) |
| `npm test`      | Runs the unit tests once with Vitest          |
| `npm run build` | Compiles the TypeScript with `tsc`            |

## Running the tests

```bash
npm test
```

The tests in `crawl.test.ts` cover:

- `normalizeURL`
- `getHeadingFromHTML`
- `getFirstParagraphFromHTML`
- `getURLsFromHTML`
- `getImagesFromHTML`
- `extractPageData`

## Project structure

```
.
├── src/
│   ├── main.ts          # CLI entry point: parses arguments and starts the crawl
│   ├── crawl.ts         # Crawling logic and HTML extraction helpers
│   ├── crawl.test.ts    # Vitest unit tests
│   └── report.ts        # Writes the crawl results to a JSON file
├── .nvmrc               # Node version
├── package.json
├── tsconfig.json
└── report.json          # Generated output
```

## How it works

1. `main.ts` reads the base URL, concurrency limit, and page limit from the command line.
2. `crawlSiteAsync` creates a `ConcurrentCrawler`, which starts at the base URL.
3. For each page, the crawler:
   - checks that it's on the same domain and hasn't been visited yet,
   - fetches the HTML (limited by `p-limit`),
   - extracts the page data with `extractPageData`,
   - recursively crawls every outgoing link.
4. Once all pages are processed (or the page limit is hit), `writeJSONReport` saves the data to `report.json`.

## Tech stack

- [TypeScript](https://www.typescriptlang.org/)
- [tsx](https://github.com/privatenumber/tsx) – run TypeScript directly
- [jsdom](https://github.com/jsdom/jsdom) – HTML parsing
- [p-limit](https://github.com/sindresorhus/p-limit) – concurrency limiting
- [Vitest](https://vitest.dev/) – testing

## Notes

- Only crawl sites you have permission to crawl, and keep the concurrency low to avoid overloading servers.
- The crawler currently doesn't respect `robots.txt`.
