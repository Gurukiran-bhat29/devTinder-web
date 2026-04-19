import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Connections from "../Connections";
import connectionReducer from "../../utils/connectionSlice";
import { MOCK_CONNECTIONS_RESPONSE } from "../../mocks/mockData";
import axios from "axios";

jest.mock("axios");

const createTestStore = () =>
  configureStore({
    reducer: { connection: connectionReducer },
  });

const renderConnections = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <Connections />
      </MemoryRouter>
    </Provider>
  );

describe("Connections", () => {
  it("should fetch and render connections list", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_CONNECTIONS_RESPONSE });

    renderConnections();

    await waitFor(() => {
      expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    });
    expect(screen.getByText("Carol Davis")).toBeInTheDocument();
  });

  it("should render Chat button for each connection", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_CONNECTIONS_RESPONSE });

    renderConnections();

    await waitFor(() => {
      const chatButtons = screen.getAllByText("Chat");
      expect(chatButtons.length).toBe(2);
    });
  });

  it("should show 'No connection Found' when list is empty", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    renderConnections();

    await waitFor(() => {
      expect(screen.getByText("No connection Found")).toBeInTheDocument();
    });
  });

  it("should display user photos", async () => {
    axios.get.mockResolvedValueOnce({ data: MOCK_CONNECTIONS_RESPONSE });

    renderConnections();

    await waitFor(() => {
      const photos = screen.getAllByAltText("photo");
      expect(photos.length).toBe(2);
    });
  });
});
