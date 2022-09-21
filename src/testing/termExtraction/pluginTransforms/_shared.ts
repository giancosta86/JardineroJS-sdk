import { LinguisticPlugin } from "../../../LinguisticPlugin";

export function getDefaultDescribeBlockHeader(
  plugin: LinguisticPlugin
): string {
  return `The extraction transforms for plugin '${plugin.getName()}'`;
}
