const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} €`;
};

describe("formatPrice", () => {
  it("formats price correctly", () => {
    expect(formatPrice(10)).toBe("10.00 €");
    expect(formatPrice(9.99)).toBe("9.99 €");
  });
});
