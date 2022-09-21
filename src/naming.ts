export function snakeCaseToCamelCase(identifier: string): string {
  return identifier.replaceAll(
    /_(\w)/g,
    (_matchedString, letterAfterUnderscore) =>
      letterAfterUnderscore.toUpperCase()
  );
}

export function convertKeysToCamelCase(source: object): object {
  const snakeCaseEntries = Object.entries(source).map(([key, value]) => [
    snakeCaseToCamelCase(key),
    value
  ]);

  return Object.fromEntries(snakeCaseEntries);
}
