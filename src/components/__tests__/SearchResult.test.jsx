import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchResult from "../SearchResult";
import { MOCK_YOUTUBE_SEARCH_DATA } from "../../mocks/mockData";

const renderSearchResult = (query = "react") =>
  render(
    <MemoryRouter initialEntries={[`/results?search_query=${query}`]}>
      <SearchResult />
    </MemoryRouter>
  );

describe("SearchResult", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(MOCK_YOUTUBE_SEARCH_DATA),
      })
    );
  });

  it("should show shimmer initially then render search results", async () => {
    renderSearchResult();

    // Shimmer visible first
    const placeholders = document.querySelectorAll(".animate-pulse");
    expect(placeholders.length).toBe(10);

    // After fetch, results appear
    await waitFor(() => {
      expect(screen.getByText("React Tutorial for Beginners")).toBeInTheDocument();
    });
    expect(screen.getByText("Advanced React Patterns")).toBeInTheDocument();
  });

  it("should render search result cards as links to watch page", async () => {
    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText("React Tutorial for Beginners")).toBeInTheDocument();
    });

    const links = screen.getAllByRole("link");
    const watchLinks = links.filter((l) => l.getAttribute("href").includes("/watch?v="));
    expect(watchLinks.length).toBe(2);
  });

  it("should call YouTube search API with the query", async () => {
    renderSearchResult("javascript");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("search?part=snippet")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("javascript")
    );
  });
});
