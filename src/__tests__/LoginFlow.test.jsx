import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../components/Login";
import userReducer from "../utils/userSlice";
import { MOCK_USER } from "../mocks/mockData";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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

describe("Login Flow", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should login successfully and navigate to home", async () => {
    axios.post.mockResolvedValueOnce({ data: MOCK_USER });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        { emailId: "john@example.com", password: "password123" },
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should show error message on login failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: "Invalid credentials" },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("should sign up successfully and navigate to profile", async () => {
    axios.post.mockResolvedValueOnce({ data: { data: MOCK_USER } });

    renderLogin();

    // Toggle to sign up
    fireEvent.click(screen.getByText(/New user\? Sign Up here/i));

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/signUp"),
        {
          firstName: "John",
          lastName: "Doe",
          emailId: "john@example.com",
          password: "password123",
        },
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });
});
