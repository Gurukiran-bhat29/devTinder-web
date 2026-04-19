import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import VideoContainer from "../VideoContainer";
import videoReducer from "../../utils/videoSlice";
import searchReducer from "../../utils/searchSlice";
import { MOCK_YOUTUBE_DATA } from "../../mocks/mockData";

const createTestStore = () =>
  configureStore({
    reducer: {
      video: videoReducer,
      search: searchReducer,
    },
  });

const renderVideoContainer = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <VideoContainer />
      </MemoryRouter>
    </Provider>
  );

describe("VideoContainer", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(MOCK_YOUTUBE_DATA),
      })
    );
  });

  it("should show shimmer loading initially then render video cards", async () => {
    renderVideoContainer();

    // Shimmer should be visible first
    const placeholders = document.querySelectorAll(".animate-pulse");
    expect(placeholders.length).toBe(10);

    // After fetch resolves, video cards should appear
    await waitFor(() => {
      expect(screen.getByText("Learn React in 10 Minutes")).toBeInTheDocument();
    });

    expect(screen.getByText("JavaScript Tips and Tricks")).toBeInTheDocument();
    expect(screen.getByText("Build a Full Stack App")).toBeInTheDocument();
  });

  it("should render ButtonList and video grid after fetch", async () => {
    await act(async () => {
      renderVideoContainer();
    });

    // Video cards should appear
    expect(screen.getByText("Learn React in 10 Minutes")).toBeInTheDocument();

    // The videos container flex grid should exist
    const videoLinks = screen.getAllByRole("link");
    expect(videoLinks.length).toBe(3);
  });

  it("should render video cards as links to watch page", async () => {
    renderVideoContainer();

    await waitFor(() => {
      expect(screen.getByText("Learn React in 10 Minutes")).toBeInTheDocument();
    });

    const links = screen.getAllByRole("link");
    const watchLinks = links.filter((l) => l.getAttribute("href").includes("/watch?v="));
    expect(watchLinks.length).toBe(3);
  });

  it("should call YouTube API on mount", async () => {
    renderVideoContainer();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("youtube.googleapis.com/youtube/v3/videos")
    );
  });
});
