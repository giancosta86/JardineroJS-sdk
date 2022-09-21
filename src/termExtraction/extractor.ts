import { Readable, Transform } from "node:stream";
import { Logger } from "@giancosta86/unified-logging";
import { WikiPage } from "@giancosta86/wiki-transform";
import { ImmediateOrPromise, SingleOrArray } from "../core";

export type WikiPageMapper<TPage> = (wikiPage: WikiPage) => TPage;

export type TermExtractorOptions = Readonly<{ logger?: Logger }>;

export type TermExtractor<TPage, TTerm> = (
  page: TPage,
  options?: TermExtractorOptions
) => readonly TTerm[];

export type ExtractionTransformProducer = () => ImmediateOrPromise<
  SingleOrArray<Transform>
>;

export type PagesToReadableMapper<TPage> = (
  pageIterable: AsyncIterable<TPage>
) => Readable;
