import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import UserCard from "../UserCard";
import feedReducer from "../../utils/feedSlice";
import { MOCK_USER_2 } from "../../mocks/mockData";

const createTestStore = () =>
  configureStore({
    reducer: { feed: feedReducer },
  });

const renderWithProviders = (ui) =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

describe("UserCard", () => {
  it("should render user's full name", () => {
    renderWithProviders(<UserCard user={MOCK_USER_2} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render user's about text", () => {
    renderWithProviders(<UserCard user={MOCK_USER_2} />);
    expect(screen.getByText("Backend engineer")).toBeInTheDocument();
  });

  it("should render user's photo", () => {
    renderWithProviders(<UserCard user={MOCK_USER_2} />);
    const img = screen.getByAltText("User");
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://example.com/jane.jpg");
  });

  it("should render Ignore and Interested buttons", () => {
    renderWithProviders(<UserCard user={MOCK_USER_2} />);
    expect(screen.getByText("Ignore")).toBeInTheDocument();
    expect(screen.getByText("Interested")).toBeInTheDocument();
  });
});
