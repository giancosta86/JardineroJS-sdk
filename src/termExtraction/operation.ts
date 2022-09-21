import { ChunkInput, ChunkOutput } from "@giancosta86/worker-transform";
import { TermExtractor } from "./extractor";

export type TermExtractionOperation<TPage, TTerm> = (
  input: ChunkInput<TPage>
) => ChunkOutput<readonly TTerm[]>;

export type CreateTermExtractionOperationParams = {
  termExtractorModuleId: string;
  termExtractorExportName: string;
};

export function createTermExtractionOperation<TPage, TTerm>({
  termExtractorModuleId,
  termExtractorExportName
}: CreateTermExtractionOperationParams): TermExtractionOperation<TPage, TTerm> {
  let termExtractor: TermExtractor<TPage, TTerm> | undefined;

  function extractTermsWithinThread({
    value: page
  }: ChunkInput<TPage>): ChunkOutput<readonly TTerm[]> {
    if (!termExtractor) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const termExtractorModule = require(termExtractorModuleId);

      termExtractor = termExtractorModule[
        termExtractorExportName
      ] as TermExtractor<TPage, TTerm>;

      if (!termExtractor) {
        throw new Error(
          `Cannot find exported terms extractor named '${termExtractorExportName}' in module with id '${termExtractorModuleId}'`
        );
      }
    }

    return { value: termExtractor(page) };
  }

  return extractTermsWithinThread;
}
