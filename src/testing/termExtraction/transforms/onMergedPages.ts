import { pipeline } from "node:stream/promises";
import { map } from "async-iterable-map";
import { FlattenTransform } from "@giancosta86/flatten-transform";
import { ExpectedTermCatalog } from "../../ExpectedTermCatalog";
import { WikiPageCatalog } from "../../WikiPageCatalog";
import { ensureArray } from "../../../core";
import {
  ExtractionTransformProducer,
  PagesToReadableMapper,
  WikiPageMapper
} from "../../../termExtraction";
import { DEFAULT_DESCRIBE_BLOCK_HEADER } from "./_shared";

export type TestTermExtractionTransformsOnMergedPagesParams<TPage, TTerm> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  pagesToReadableMapper: PagesToReadableMapper<TPage>;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  createExtractionTransforms: ExtractionTransformProducer;
  describeBlockHeader?: string;
};

export function testTermExtractionTransformsOnMergedPages<TPage, TTerm>({
  wikiPageCatalog,
  wikiPageMapper,
  pagesToReadableMapper,
  expectedTermCatalog,
  createExtractionTransforms,
  describeBlockHeader
}: TestTermExtractionTransformsOnMergedPagesParams<TPage, TTerm>): void {
  describe(describeBlockHeader ?? DEFAULT_DESCRIBE_BLOCK_HEADER, () => {
    it("should extract the terms from all the test pages together", async () => {
      const expectedTerms = expectedTermCatalog.getAll();

      const allWikiPages = wikiPageCatalog.loadAllPages();

      const allPages = map(allWikiPages, wikiPageMapper);

      const sourceReadable = pagesToReadableMapper(allPages);

      const extractionTransforms = ensureArray(
        await createExtractionTransforms()
      );

      const actualTerms: TTerm[] = [];

      await pipeline([
        sourceReadable,
        ...extractionTransforms,
        new FlattenTransform().on("data", term => actualTerms.push(term))
      ]);

      expect(actualTerms).toIncludeSameMembers(expectedTerms);
    });
  });
}
