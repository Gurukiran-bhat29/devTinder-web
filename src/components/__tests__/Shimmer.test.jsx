import { render, screen } from "@testing-library/react";
import Shimmer from "../Shimmer";

describe("Shimmer", () => {
  it("should render shimmer placeholder elements", () => {
    const { container } = render(<Shimmer />);
    const placeholders = container.querySelectorAll(".animate-pulse");
    expect(placeholders.length).toBe(10);
  });

  it("should render inside a flex container", () => {
    const { container } = render(<Shimmer />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain("flex");
    expect(wrapper.className).toContain("flex-wrap");
  });
});
