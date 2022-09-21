import { join } from "node:path";
import { createTermExtractionOperation } from "./operation";

const TEST_EXTRACTOR_MODULE = join(__dirname, "..", "test", "counterExtractor");

describe("A synthesized term-extraction operation", () => {
  it("should correctly extract terms", () => {
    const operation = createTermExtractionOperation<string, number>({
      termExtractorModuleId: TEST_EXTRACTOR_MODULE,
      termExtractorExportName: "countWords"
    });

    const output = operation({
      value: "This is a basic test",
      encoding: "utf-8"
    });

    expect(output.value).toBe(5);
  });

  it("should throw if the requested export does not exist", () => {
    const operation = createTermExtractionOperation<string, number>({
      termExtractorModuleId: TEST_EXTRACTOR_MODULE,
      termExtractorExportName: "<<INEXISTING>>"
    });

    expect(() =>
      operation({
        value: "This is a basic test",
        encoding: "utf-8"
      })
    ).toThrow("Cannot find exported terms extractor");
  });
});
