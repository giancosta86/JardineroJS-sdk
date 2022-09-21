import { join } from "node:path";
import all from "it-all";
import { WikiPage } from "@giancosta86/wiki-transform";
import { WikiPageCatalog } from "./WikiPageCatalog";

const expectedPages: readonly WikiPage[] = [
  { title: "alpha", text: "A" },
  { title: "beta", text: "B" },
  { title: "ro", text: "R" },
  { title: "sigma", text: "S" },
  { title: "tau", text: "T" }
];

function createTestCatalog(): WikiPageCatalog {
  return new WikiPageCatalog(join(__dirname, "..", "test", "pages"));
}

describe("The wiki page catalog", () => {
  it("should return all the titles", () => {
    const catalog = createTestCatalog();

    expect(catalog.titles).toIncludeSameMembers([
      "alpha",
      "beta",
      "ro",
      "sigma",
      "tau"
    ]);
  });

  it("should load the single pages", async () => {
    const catalog = createTestCatalog();

    for (const expectedPage of expectedPages) {
      const actualPage = await catalog.loadPage(expectedPage.title);
      expect(actualPage).toEqual(expectedPage);
    }
  });

  it("should load all the pages", async () => {
    const catalog = createTestCatalog();

    const allPagesIterable = catalog.loadAllPages();

    const allPages = await all(allPagesIterable);

    expect(allPages).toIncludeSameMembers(expectedPages);
  });
});
