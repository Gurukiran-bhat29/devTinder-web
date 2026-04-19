import { render, screen } from "@testing-library/react";
import VideoCard from "../VideoCard";
import { MOCK_YOUTUBE_DATA } from "../../mocks/mockData";

const mockVideo = MOCK_YOUTUBE_DATA.items[0];

describe("VideoCard", () => {
  it("should render video title", () => {
    render(<VideoCard info={mockVideo} />);
    expect(screen.getByText("Learn React in 10 Minutes")).toBeInTheDocument();
  });

  it("should render channel name", () => {
    render(<VideoCard info={mockVideo} />);
    expect(screen.getByText("CodeChannel")).toBeInTheDocument();
  });

  it("should render view count", () => {
    render(<VideoCard info={mockVideo} />);
    // Use the same locale as the component to avoid locale-specific formatting differences
    const expectedCount = Number(mockVideo.statistics.viewCount).toLocaleString();
    expect(screen.getByText(`${expectedCount} views`)).toBeInTheDocument();
  });

  it("should render thumbnail image", () => {
    render(<VideoCard info={mockVideo} />);
    const img = screen.getByAltText("thumbnail");
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://i.ytimg.com/vi/vid1/mqdefault.jpg");
  });
});
