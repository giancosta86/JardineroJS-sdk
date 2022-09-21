import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { FlattenTransform } from "@giancosta86/flatten-transform";
import { ExpectedTermCatalog } from "../../ExpectedTermCatalog";
import { WikiPageCatalog } from "../../WikiPageCatalog";
import { ensureArray } from "../../../core";
import {
  ExtractionTransformProducer,
  WikiPageMapper
} from "../../../termExtraction";
import { DEFAULT_DESCRIBE_BLOCK_HEADER } from "./_shared";

export type TestTermExtractionTransformsOnSinglePagesParams<TPage, TTerm> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  createExtractionTransforms: ExtractionTransformProducer;
  describeBlockHeader?: string;
};

export function testTermExtractionTransformsOnSinglePages<TPage, TTerm>({
  wikiPageCatalog,
  wikiPageMapper,
  expectedTermCatalog,
  createExtractionTransforms,
  describeBlockHeader
}: TestTermExtractionTransformsOnSinglePagesParams<TPage, TTerm>): void {
  describe(describeBlockHeader ?? DEFAULT_DESCRIBE_BLOCK_HEADER, () => {
    it.each(wikiPageCatalog.titles)(
      "should extract terms for '%s'",
      async pageTitle => {
        const expectedTerms = expectedTermCatalog.getByPage(pageTitle);

        const page = await wikiPageCatalog.loadPage(pageTitle);

        const actualPage = wikiPageMapper(page);

        const extractionTransforms = ensureArray(
          await createExtractionTransforms()
        );

        const actualTerms: TTerm[] = [];

        await pipeline([
          Readable.from([actualPage]),
          ...extractionTransforms,
          new FlattenTransform().on("data", term => actualTerms.push(term))
        ]);

        expect(actualTerms).toIncludeSameMembers(expectedTerms);
      }
    );
  });
}
