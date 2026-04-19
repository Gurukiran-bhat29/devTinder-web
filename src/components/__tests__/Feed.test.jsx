import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Feed from "../Feed";
import userReducer from "../../utils/userSlice";
import feedReducer from "../../utils/feedSlice";
import { MOCK_FEED_RESPONSE } from "../../mocks/mockData";
import axios from "axios";

jest.mock("axios");

const createTestStore = (preloadedFeed = null) =>
  configureStore({
    reducer: {
      user: userReducer,
      feed: feedReducer,
    },
    preloadedState: { feed: preloadedFeed },
  });

const renderFeed = (preloadedFeed = null) =>
  render(
    <Provider store={createTestStore(preloadedFeed)}>
      <MemoryRouter>
        <Feed />
      </MemoryRouter>
    </Provider>
  );

describe("Feed", () => {
  it("should fetch feed data on mount and render user cards", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_FEED_RESPONSE });

    renderFeed();

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("should render Ignore and Interested buttons for each user", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_FEED_RESPONSE });

    renderFeed();

    await waitFor(() => {
      const ignoreButtons = screen.getAllByText("Ignore");
      const interestedButtons = screen.getAllByText("Interested");
      expect(ignoreButtons.length).toBe(2);
      expect(interestedButtons.length).toBe(2);
    });
  });

  it("should not re-fetch if feed is already in store", () => {
    renderFeed(MOCK_FEED_RESPONSE.data);
    expect(axios.get).not.toHaveBeenCalled();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
