import { render, screen } from "@testing-library/react";
import ButtonList from "../ButtonList";
import { CATEGORY_LIST } from "../../utils/videoConstants";

describe("ButtonList", () => {
  it("should render all category buttons", () => {
    render(<ButtonList />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(CATEGORY_LIST.length);
  });

  it("should render each category name", () => {
    render(<ButtonList />);
    CATEGORY_LIST.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
