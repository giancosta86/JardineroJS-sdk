import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import open from "better-sqlite3";
import {
  SqliteWritableBuilder,
  TypedObject
} from "@giancosta86/sqlite-writable";
import { convertKeysToCamelCase } from "../naming";
import { ImmediateOrPromise } from "../core";

export type TestSqliteWritableParams<TTerm extends TypedObject> = {
  dbSchema: ImmediateOrPromise<string>;
  getTableNameForTerm: (term: TTerm) => string;
  createSqliteWritableBuilder: () => ImmediateOrPromise<SqliteWritableBuilder>;
  terms: readonly TTerm[];
  describeBlockHeader?: string;
};

export function testSqliteWritable<TTerm extends TypedObject>({
  dbSchema,
  getTableNameForTerm,
  createSqliteWritableBuilder,
  terms,
  describeBlockHeader
}: TestSqliteWritableParams<TTerm>): void {
  async function expectTermToBeStoredOnDb(termToSave: TTerm): Promise<void> {
    const db = open(":memory:");

    try {
      db.exec(await dbSchema);

      const sqliteWritableBuilder = await createSqliteWritableBuilder();

      const sqliteWritable = sqliteWritableBuilder.build(db);

      await pipeline(Readable.from([termToSave]), sqliteWritable);

      const tableName = getTableNameForTerm(termToSave);

      const retrievedTerm = db.prepare(`SELECT * FROM ${tableName}`).get();

      const retrievedTermWithCamelCaseKeys =
        convertKeysToCamelCase(retrievedTerm);

      const actualTerm = {
        type: termToSave.type,
        ...retrievedTermWithCamelCaseKeys
      };

      expect(actualTerm).toEqual(termToSave);
    } finally {
      db.close();
    }
  }

  describe(describeBlockHeader ?? "The SQLite-based writable", () => {
    it.each(terms)(`should store a term of type '$type'`, term =>
      expectTermToBeStoredOnDb(term)
    );
  });
}
