import React from "react";
import { create, act } from "react-test-renderer";
import App from "../App";

describe("App", () => {
  it("renders correctly", async () => {
    let tree;
    await act(async () => {
      tree = create(<App />);
    });
    expect(tree.toJSON()).toBeTruthy();
  });
});
