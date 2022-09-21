import { Readable, Transform } from "node:stream";
import { SqliteWritableBuilder } from "@giancosta86/sqlite-writable";
import { Logger } from "@giancosta86/unified-logging";
import { ImmediateOrPromise, SingleOrArray } from "./core";

const MANDATORY_PLUGIN_KEYS = [
  "getId",
  "getName",
  "getSqliteSchema",
  "createSourceStreams",
  "createExtractionTransforms",
  "createSqliteWritableBuilder"
];

export function validatePotentialPlugin(potentialPlugin: any): void {
  MANDATORY_PLUGIN_KEYS.forEach(expectedKey => {
    if (potentialPlugin[expectedKey] === undefined) {
      throw new Error(
        `The potential linguistic plugin does not contain an expected key: '${expectedKey}'`
      );
    }
  });
}

export abstract class PipelineOutput {
  abstract sendText(text: string): void;

  sendProcessedPagesNotification(processedPages: number): void {
    this.sendText(`Processed pages: ${processedPages.toLocaleString()}`);
  }
}

export abstract class LinguisticPlugin {
  constructor(
    protected readonly logger: Logger,
    protected readonly pipelineOutput: PipelineOutput
  ) {}

  abstract getId(): string;

  abstract getName(): string;

  abstract getSqliteSchema(): ImmediateOrPromise<string>;

  abstract createSourceStreams(): ImmediateOrPromise<SingleOrArray<Readable>>;

  abstract createExtractionTransforms(): ImmediateOrPromise<
    SingleOrArray<Transform>
  >;

  abstract createSqliteWritableBuilder(): ImmediateOrPromise<SqliteWritableBuilder>;

  getStartupQuery(): string {
    return "";
  }

  translateQueryToSql(query: string): ImmediateOrPromise<string> {
    return query;
  }
}
