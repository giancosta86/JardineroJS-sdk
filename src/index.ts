import { Readable, Transform } from "node:stream";
import { SqliteWritableBuilder } from "@giancosta86/sqlite-writable";
import { Logger } from "@giancosta86/unified-logging";

export type PlainOrPromise<T> = T | Promise<T>;

export type SingleOrArray<T> = T | readonly T[];

export abstract class LinguisticPlugin {
  constructor(protected readonly logger: Logger) {}

  abstract getId(): string;

  abstract getSqliteSchema(): PlainOrPromise<string>;

  abstract createSourceStreams(): PlainOrPromise<SingleOrArray<Readable>>;

  abstract createPageTransforms(): PlainOrPromise<SingleOrArray<Transform>>;

  abstract createSqliteWritableBuilder(): PlainOrPromise<SqliteWritableBuilder>;
}
