import { Logger } from "@giancosta86/unified-logging";
import { ExpectedTermCatalog } from "../../ExpectedTermCatalog";
import { WikiPageCatalog } from "../../WikiPageCatalog";
import { testTermExtractionTransformsOnSinglePages } from "../transforms";
import { LinguisticPlugin, PipelineOutput } from "../../../LinguisticPlugin";
import { LoggerPipelineOutput } from "../../../LoggerPipelineOutput";
import { WikiPageMapper } from "../../../termExtraction";
import { getDefaultDescribeBlockHeader } from "./_shared";

export type TestPluginExtractionTransformsOnSinglePagesParams<
  TPlugin extends LinguisticPlugin,
  TPage,
  TTerm
> = {
  wikiPageCatalog: WikiPageCatalog;
  wikiPageMapper: WikiPageMapper<TPage>;
  expectedTermCatalog: ExpectedTermCatalog<TTerm>;
  pluginClass: new (logger: Logger, pipelineOutput: PipelineOutput) => TPlugin;
  describeBlockHeader?: string;
};

export function testPluginExtractionTransformsOnSinglePages<
  TPlugin extends LinguisticPlugin,
  TPage,
  TTerm
>({
  wikiPageCatalog,
  wikiPageMapper,
  expectedTermCatalog,
  pluginClass,
  describeBlockHeader
}: TestPluginExtractionTransformsOnSinglePagesParams<
  TPlugin,
  TPage,
  TTerm
>): void {
  const plugin = new pluginClass(console, new LoggerPipelineOutput(console));

  testTermExtractionTransformsOnSinglePages({
    wikiPageCatalog,
    wikiPageMapper,
    expectedTermCatalog,
    createExtractionTransforms: () => plugin.createExtractionTransforms(),
    describeBlockHeader:
      describeBlockHeader ?? getDefaultDescribeBlockHeader(plugin)
  });
}
