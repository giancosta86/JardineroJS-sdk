import { Readable, Transform } from "node:stream";
import { SqliteWritableBuilder } from "@giancosta86/sqlite-writable";
import { ImmediateOrPromise, SingleOrArray } from "./core";
import { LinguisticPlugin, validatePotentialPlugin } from "./LinguisticPlugin";
import { LoggerPipelineOutput } from "./LoggerPipelineOutput";

class TestPlugin extends LinguisticPlugin {
  constructor() {
    super(console, new LoggerPipelineOutput(console));
  }

  getId(): string {
    throw new Error("Method not implemented.");
  }

  getName(): string {
    throw new Error("Method not implemented.");
  }

  getSqliteSchema(): ImmediateOrPromise<string> {
    throw new Error("Method not implemented.");
  }

  createSourceStreams(): ImmediateOrPromise<SingleOrArray<Readable>> {
    throw new Error("Method not implemented.");
  }

  createExtractionTransforms(): ImmediateOrPromise<SingleOrArray<Transform>> {
    throw new Error("Method not implemented.");
  }

  createSqliteWritableBuilder(): ImmediateOrPromise<SqliteWritableBuilder> {
    throw new Error("Method not implemented.");
  }
}

describe("Validating a potential plugin", () => {
  it("should accept a well-defined plugin", () => {
    const plugin = new TestPlugin();
    validatePotentialPlugin(plugin);
  });

  it("should throw when receving a non-plugin object", () => {
    expect(() => {
      validatePotentialPlugin({ name: "Yogi" });
    }).toThrow(
      "The potential linguistic plugin does not contain an expected key: 'getId'"
    );
  });
});

describe("Linguistic plugin", () => {
  it("should have the startup query empty by default", () => {
    const plugin = new TestPlugin();
    expect(plugin.getStartupQuery()).toBe("");
  });

  describe("when translating a query to SQL", () => {
    it("should return the query itself by default", () => {
      const plugin = new TestPlugin();
      expect(plugin.translateQueryToSql("DODO")).toBe("DODO");
    });
  });
});
