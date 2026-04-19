import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Requests from "../components/Requests";
import requestReducer from "../utils/requestSlice";
import { MOCK_REQUESTS_RESPONSE } from "../mocks/mockData";
import axios from "axios";

jest.mock("axios");

const createTestStore = () =>
  configureStore({
    reducer: { request: requestReducer },
  });

const renderRequests = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <Requests />
      </MemoryRouter>
    </Provider>
  );

describe("Request Flow", () => {
  it("should remove request from list when Accept is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_REQUESTS_RESPONSE });
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: "Connection request accepted" } });

    renderRequests();

    await waitFor(() => {
      expect(screen.getByText("Dave Brown")).toBeInTheDocument();
      expect(screen.getByText("Eve Taylor")).toBeInTheDocument();
    });

    const acceptButtons = screen.getAllByText("Accept");
    fireEvent.click(acceptButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/request/review/accepted/"),
        {},
        { withCredentials: true }
      );
    });

    // After accepting, the first request should be removed
    await waitFor(() => {
      expect(screen.queryByText("Dave Brown")).not.toBeInTheDocument();
    });
  });

  it("should remove request from list when Reject is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_REQUESTS_RESPONSE });
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: "Connection request rejected" } });

    renderRequests();

    await waitFor(() => {
      expect(screen.getByText("Dave Brown")).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByText("Reject");
    fireEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/request/review/rejected/"),
        {},
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Dave Brown")).not.toBeInTheDocument();
    });
  });
});
