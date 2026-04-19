import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Feed from "../components/Feed";
import userReducer from "../utils/userSlice";
import feedReducer from "../utils/feedSlice";
import { MOCK_FEED_RESPONSE } from "../mocks/mockData";
import axios from "axios";

jest.mock("axios");

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      feed: feedReducer,
    },
  });

const renderFeed = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <Feed />
      </MemoryRouter>
    </Provider>
  );

describe("Feed Flow", () => {
  it("should remove user card from feed when Interested is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_FEED_RESPONSE });
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: "Success" } });

    renderFeed();

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    // Click Interested on the first user card
    const interestedButtons = screen.getAllByText("Interested");
    fireEvent.click(interestedButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/request/send/interested/"),
        {},
        { withCredentials: true }
      );
    });
  });

  it("should remove user card from feed when Ignore is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_FEED_RESPONSE });
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: "Success" } });

    renderFeed();

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    const ignoreButtons = screen.getAllByText("Ignore");
    fireEvent.click(ignoreButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/request/send/ignored/"),
        {},
        { withCredentials: true }
      );
    });
  });
});
