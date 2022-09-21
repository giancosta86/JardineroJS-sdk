import { Logger } from "@giancosta86/unified-logging";
import { PipelineOutput } from "./LinguisticPlugin";

export class LoggerPipelineOutput extends PipelineOutput {
  constructor(private readonly logger: Logger) {
    super();
  }

  sendText(text: string): void {
    this.logger.debug(text);
  }
}
