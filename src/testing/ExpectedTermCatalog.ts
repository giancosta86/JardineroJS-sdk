export type ExpectedTermCatalogInput<TTerm> = {
  [pageTitle: string]: readonly TTerm[];
};

export class ExpectedTermCatalog<TTerm> {
  constructor(private readonly input: ExpectedTermCatalogInput<TTerm>) {}

  private allTerms?: readonly TTerm[];

  getByPage(pageTitle: string): readonly TTerm[] {
    const expectedTerms = this.input[pageTitle];

    if (expectedTerms === undefined) {
      throw new Error(`No expected terms declared for page '${pageTitle}'`);
    }

    return expectedTerms;
  }

  getAll(): readonly TTerm[] {
    if (!this.allTerms) {
      const allTerms: TTerm[] = [];

      Object.values(this.input).forEach(terms => allTerms.push(...terms));

      this.allTerms = allTerms;
    }

    return this.allTerms;
  }
}
