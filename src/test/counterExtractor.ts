export function countWords(page: string): number {
  return page.split(/\s+/).length;
}
