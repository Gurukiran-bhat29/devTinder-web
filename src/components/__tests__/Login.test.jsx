import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../Login";
import userReducer from "../../utils/userSlice";

const createTestStore = () =>
  configureStore({
    reducer: { user: userReducer },
  });

const renderLogin = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

describe("Login", () => {
  it("should render Login heading by default", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("should render email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should render Login button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should toggle to Sign Up form when clicking the toggle link", () => {
    renderLogin();
    const toggleLink = screen.getByText(/New user\? Sign Up here/i);
    fireEvent.click(toggleLink);

    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("should show first name and last name fields in Sign Up mode", () => {
    renderLogin();
    fireEvent.click(screen.getByText(/New user\? Sign Up here/i));

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it("should toggle back to Login from Sign Up", () => {
    renderLogin();
    fireEvent.click(screen.getByText(/New user\? Sign Up here/i));
    fireEvent.click(screen.getByText(/Existing user\? Login here/i));

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });
});
