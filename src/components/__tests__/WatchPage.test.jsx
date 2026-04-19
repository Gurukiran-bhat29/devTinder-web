import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WatchPage from "../WatchPage";

const renderWatchPage = (videoId = "testVideoId123") =>
  render(
    <MemoryRouter initialEntries={[`/watch?v=${videoId}`]}>
      <WatchPage />
    </MemoryRouter>
  );

describe("WatchPage", () => {
  it("should render an iframe", () => {
    renderWatchPage();
    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe).toBeInTheDocument();
  });

  it("should embed the correct YouTube video URL", () => {
    renderWatchPage("abc123");
    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe.src).toBe("https://www.youtube.com/embed/abc123");
  });

  it("should have allowFullScreen attribute", () => {
    renderWatchPage();
    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe).toHaveAttribute("allowfullscreen");
  });
});
