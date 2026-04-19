import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import EditProfile from "../EditProfile";
import userReducer from "../../utils/userSlice";
import feedReducer from "../../utils/feedSlice";
import { MOCK_USER } from "../../mocks/mockData";

jest.mock("axios");

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      feed: feedReducer,
    },
  });

const renderEditProfile = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <EditProfile user={MOCK_USER} />
      </MemoryRouter>
    </Provider>
  );

describe("EditProfile", () => {
  it("should render Edit Profile heading", () => {
    renderEditProfile();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  it("should pre-fill form fields with user data", () => {
    renderEditProfile();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/photo.jpg")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Full stack developer")).toBeInTheDocument();
  });

  it("should render Save button", () => {
    renderEditProfile();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("should render a preview UserCard", () => {
    renderEditProfile();
    // The preview card also displays the name
    const names = screen.getAllByText("John Doe");
    expect(names.length).toBeGreaterThanOrEqual(1);
  });
});
