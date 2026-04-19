import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Requests from "../Requests";
import requestReducer from "../../utils/requestSlice";
import { MOCK_REQUESTS_RESPONSE } from "../../mocks/mockData";
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

describe("Requests", () => {
  it("should fetch and render request list", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_REQUESTS_RESPONSE });

    renderRequests();

    await waitFor(() => {
      expect(screen.getByText("Dave Brown")).toBeInTheDocument();
    });
    expect(screen.getByText("Eve Taylor")).toBeInTheDocument();
  });

  it("should render Accept and Reject buttons for each request", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_REQUESTS_RESPONSE });

    renderRequests();

    await waitFor(() => {
      const acceptButtons = screen.getAllByText("Accept");
      const rejectButtons = screen.getAllByText("Reject");
      expect(acceptButtons.length).toBe(2);
      expect(rejectButtons.length).toBe(2);
    });
  });

  it("should show 'No connection Found' when list is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: { message: "Data fetched successfully", data: [] } });

    renderRequests();

    await waitFor(() => {
      expect(screen.getByText("No connection Found")).toBeInTheDocument();
    });
  });

  it("should display requester's about text", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_REQUESTS_RESPONSE });

    renderRequests();

    await waitFor(() => {
      expect(screen.getByText("Mobile developer")).toBeInTheDocument();
      expect(screen.getByText("QA engineer")).toBeInTheDocument();
    });
  });
});
