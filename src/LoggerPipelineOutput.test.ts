import { ArrayLogger } from "@giancosta86/unified-logging";
import { LoggerPipelineOutput } from "./LoggerPipelineOutput";

describe("Sending pipeline output to a logger", () => {
  it("should actually write to the logger", () => {
    const logger = new ArrayLogger();

    const pipelineOutput = new LoggerPipelineOutput(logger);

    pipelineOutput.sendText("Yogi");
    pipelineOutput.sendProcessedPagesNotification(90);

    expect(logger.debugMessages).toEqual(["Yogi", "Processed pages: 90"]);
  });
});
