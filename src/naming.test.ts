import { convertKeysToCamelCase, snakeCaseToCamelCase } from "./naming";

describe("Converting snake case to camel case", () => {
  it("should leave the empty string as it is", () => {
    expect(snakeCaseToCamelCase("")).toBe("");
  });

  it("should leave a non-snake-case string as it is", () => {
    expect(snakeCaseToCamelCase("dodo")).toBe("dodo");
  });

  it("should convert a simple snake-case string", () => {
    expect(snakeCaseToCamelCase("alpha_beta")).toBe("alphaBeta");
  });

  it("should convert any snake-case part of a string", () => {
    expect(snakeCaseToCamelCase("alpha_beta_gamma_delta")).toBe(
      "alphaBetaGammaDelta"
    );
  });

  it("should convert a sequence of snake-case letters", () => {
    expect(snakeCaseToCamelCase("a_b_c_d_e")).toBe("aBCDE");
  });
});

describe("Converting object keys to camel case", () => {
  it("should leave an empty object as it is", () => {
    expect(convertKeysToCamelCase({})).toEqual({});
  });

  it("should affect snake-case keys only", () => {
    const snakeCaseObject = convertKeysToCamelCase({
      omega: 90,
      alpha_beta: 92,
      gamma_delta: 95,
      sigma: 98
    });

    expect(snakeCaseObject).toEqual({
      omega: 90,
      alphaBeta: 92,
      gammaDelta: 95,
      sigma: 98
    });
  });
});
