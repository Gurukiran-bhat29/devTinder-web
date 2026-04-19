import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("should render the footer component", () => {
    render(<Footer />);
    const footerEl = screen.getByRole("contentinfo");
    expect(footerEl).toBeInTheDocument();
  });

  it("should display copyright text", () => {
    render(<Footer />);
    const copyright = screen.getByText(/Copyright/i);
    expect(copyright).toBeInTheDocument();
  });

  it("should contain social media icons", () => {
    const { container } = render(<Footer />);
    const svgs = container.querySelectorAll("svg");
    // 1 logo svg + 3 social svgs
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });
});
