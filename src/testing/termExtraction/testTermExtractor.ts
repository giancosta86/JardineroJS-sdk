import { WikiPageCatalog } from "../WikiPageCatalog";
import { ExpectedTermCatalog } from "../ExpectedTermCatalog";
import { TermExtractor, WikiPageMapper } from "../../termExtraction";

export type TestTermExtractorParams<TPage, TTerm> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  termExtractor: TermExtractor<TPage, TTerm>;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  describeBlockHeader?: string;
};

export function testTermExtractor<TPage, TTerm>({
  wikiPageCatalog,
  wikiPageMapper,
  termExtractor,
  expectedTermCatalog,
  describeBlockHeader
}: TestTermExtractorParams<TPage, TTerm>): void {
  describe(describeBlockHeader ?? "The term extractor", () => {
    it.each(wikiPageCatalog.titles)(
      "should extract terms from page '%s'",
      async pageTitle => {
        const expectedTerms = expectedTermCatalog.getByPage(pageTitle);

        const wikiPage = await wikiPageCatalog.loadPage(pageTitle);

        const actualPage = wikiPageMapper(wikiPage);

        const actualTerms = termExtractor(actualPage);

        expect(actualTerms).toIncludeSameMembers(expectedTerms);
      }
    );
  });
}
