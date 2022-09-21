import { ExpectedTermCatalog } from "./ExpectedTermCatalog";

describe("The catalog of expected terms", () => {
  it("should return the expected terms for a given page", () => {
    const catalog = new ExpectedTermCatalog({
      alpha: [90, 92],
      beta: [95]
    });

    expect(catalog.getByPage("alpha")).toEqual([90, 92]);
    expect(catalog.getByPage("beta")).toEqual([95]);
  });

  it("should return all of its terms", () => {
    const catalog = new ExpectedTermCatalog({
      alpha: [90, 92],
      beta: [95]
    });

    expect(catalog.getAll()).toIncludeSameMembers([90, 92, 95]);
  });

  describe("in case of duplicated terms", () => {
    it("should return all the instances", () => {
      const catalog = new ExpectedTermCatalog({
        alpha: [90, 92],
        beta: [92, 95]
      });

      expect(catalog.getAll()).toIncludeSameMembers([90, 92, 92, 95]);
    });
  });

  describe("when the terms of an undeclared page are requested", () => {
    it("should throw", () => {
      const catalog = new ExpectedTermCatalog({
        alpha: [90, 92],
        beta: [95]
      });

      expect(() => {
        catalog.getByPage("gamma");
      }).toThrow("No expected terms declared for page 'gamma'");
    });
  });
});
