import { ChunkInput } from "@giancosta86/worker-transform";
import { WikiPageMapper } from "../../termExtraction";
import { ExpectedTermCatalog } from "../ExpectedTermCatalog";
import { WikiPageCatalog } from "../WikiPageCatalog";

export type TestTermExtractionOperationParams<TPage, TTerm> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  transformOperationModuleId: string;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  describeBlockHeader?: string;
};

export function testTermExtractionOperation<TPage, TTerm>({
  wikiPageCatalog,
  wikiPageMapper,
  transformOperationModuleId,
  expectedTermCatalog,
  describeBlockHeader
}: TestTermExtractionOperationParams<TPage, TTerm>): void {
  describe(describeBlockHeader ?? "The term extraction operation", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const transformOperation = require(transformOperationModuleId);

    it.each(wikiPageCatalog.titles)(
      "should extract terms from '%s'",
      async pageTitle => {
        const wikiPage = await wikiPageCatalog.loadPage(pageTitle);

        const actualPage = wikiPageMapper(wikiPage);

        const expectedTerms = expectedTermCatalog.getByPage(pageTitle);

        const chunkInput: ChunkInput<TPage> = {
          value: actualPage,
          encoding: "utf8"
        };

        const chunkOutput = transformOperation(chunkInput);

        const retrievedTerms = chunkOutput.value;

        expect(retrievedTerms).toIncludeSameMembers(expectedTerms);
      }
    );
  });
}
