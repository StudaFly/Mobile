import { formatPrice, formatDate, capitalizeFirstLetter } from "../../src/utils/format";

describe("formatPrice", () => {
  it("formats price with 2 decimals", () => {
    expect(formatPrice(10)).toBe("10.00 €");
    expect(formatPrice(9.99)).toBe("9.99 €");
    expect(formatPrice(0)).toBe("0.00 €");
  });
});

describe("formatDate", () => {
  it("formats date in French format", () => {
    const date = new Date("2026-03-03");
    expect(formatDate(date)).toBe("03/03/2026");
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes first letter", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("WORLD")).toBe("World");
  });

  it("handles empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });
});
