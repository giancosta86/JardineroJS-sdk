import { join } from "node:path";
import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { WikiPage } from "@giancosta86/wiki-transform";

export class WikiPageCatalog {
  readonly titles: readonly string[];

  constructor(private readonly sourceDirectory: string) {
    this.titles = readdirSync(sourceDirectory).map(
      fileName => fileName.split(".")[0] as string
    );
  }

  async loadPage(title: string): Promise<WikiPage> {
    const pagePath = join(this.sourceDirectory, `${title}.txt`);

    const text = await readFile(pagePath, "utf8");

    return {
      title,
      text
    };
  }

  async *loadAllPages(): AsyncIterable<WikiPage> {
    for (const title of this.titles) {
      yield this.loadPage(title);
    }
  }
}
