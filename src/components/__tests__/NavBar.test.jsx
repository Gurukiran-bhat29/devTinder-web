import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import NavBar from "../NavBar";
import userReducer from "../../utils/userSlice";
import feedReducer from "../../utils/feedSlice";
import searchReducer from "../../utils/searchSlice";
import videoReducer from "../../utils/videoSlice";
import connectionReducer from "../../utils/connectionSlice";
import requestReducer from "../../utils/requestSlice";
import { MOCK_USER, MOCK_SUGGESTIONS_DATA } from "../../mocks/mockData";

jest.mock("axios");

const createStoreWith = (user = null) =>
  configureStore({
    reducer: {
      user: userReducer,
      feed: feedReducer,
      connection: connectionReducer,
      request: requestReducer,
      video: videoReducer,
      search: searchReducer,
    },
    preloadedState: { user },
  });

const renderNavBar = (user = null) =>
  render(
    <Provider store={createStoreWith(user)}>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </Provider>
  );

describe("NavBar", () => {
  it("should render DevTinder brand text", () => {
    renderNavBar();
    expect(screen.getByText(/DevTinder/)).toBeInTheDocument();
  });

  it("should not show user dropdown when not logged in", () => {
    renderNavBar();
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });

  it("should show welcome message when user is logged in", () => {
    renderNavBar(MOCK_USER);
    expect(screen.getByText(/Welcome, John/)).toBeInTheDocument();
  });

  it("should show Videos link when user is logged in", () => {
    renderNavBar(MOCK_USER);
    expect(screen.getByText(/Videos/)).toBeInTheDocument();
  });

  it("should render search input when user is logged in", () => {
    renderNavBar(MOCK_USER);
    expect(screen.getByPlaceholderText("Search videos")).toBeInTheDocument();
  });

  it("should show dropdown menu items when logged in", () => {
    renderNavBar(MOCK_USER);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should show search suggestions after typing", async () => {
    jest.useFakeTimers();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(MOCK_SUGGESTIONS_DATA),
      })
    );

    renderNavBar(MOCK_USER);
    const searchInput = screen.getByPlaceholderText("Search videos");

    fireEvent.change(searchInput, { target: { value: "react" } });
    fireEvent.focus(searchInput);

    // Advance past the 500ms debounce
    jest.advanceTimersByTime(600);

    jest.useRealTimers();

    await waitFor(() => {
      // Suggestions render as "🔍 <suggestion>", so use partial text matching
      expect(screen.getByText(/react tutorial/)).toBeInTheDocument();
    });

    expect(screen.getByText(/react hooks/)).toBeInTheDocument();
    expect(screen.getByText(/react native/)).toBeInTheDocument();
  });
});
