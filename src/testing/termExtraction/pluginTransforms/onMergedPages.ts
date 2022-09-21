import { Logger } from "@giancosta86/unified-logging";
import { ExpectedTermCatalog } from "../../ExpectedTermCatalog";
import { WikiPageCatalog } from "../../WikiPageCatalog";
import { testTermExtractionTransformsOnMergedPages } from "../transforms";
import { LinguisticPlugin, PipelineOutput } from "../../../LinguisticPlugin";
import { LoggerPipelineOutput } from "../../../LoggerPipelineOutput";
import { PagesToReadableMapper, WikiPageMapper } from "../../../termExtraction";
import { getDefaultDescribeBlockHeader } from "./_shared";

export type TestPluginExtractionTransformsOnMergedPagesParams<
  TPlugin extends LinguisticPlugin,
  TPage,
  TTerm
> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  pagesToReadableMapper: PagesToReadableMapper<TPage>;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  pluginClass: new (logger: Logger, pipelineOutput: PipelineOutput) => TPlugin;
  describeBlockHeader?: string;
};

export function testPluginExtractionTransformsOnMergedPages<
  TPlugin extends LinguisticPlugin,
  TPage,
  TTerm
>({
  wikiPageCatalog,
  wikiPageMapper,
  pagesToReadableMapper,
  expectedTermCatalog,
  pluginClass,
  describeBlockHeader
}: TestPluginExtractionTransformsOnMergedPagesParams<
  TPlugin,
  TPage,
  TTerm
>): void {
  const plugin = new pluginClass(console, new LoggerPipelineOutput(console));

  testTermExtractionTransformsOnMergedPages({
    wikiPageCatalog,
    wikiPageMapper,
    pagesToReadableMapper,
    expectedTermCatalog,
    createExtractionTransforms: () => plugin.createExtractionTransforms(),
    describeBlockHeader:
      describeBlockHeader ?? getDefaultDescribeBlockHeader(plugin)
  });
}
