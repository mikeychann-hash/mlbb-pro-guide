import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App.jsx";
import { DataProvider } from "../src/data/DataContext.jsx";

const TABS = ["Meta", "Heroes", "Tiers", "Items", "Counter", "Teams", "Spells", "Jungle", "Roam", "Macro", "Compare", "Emblems", "Pro Picks", "Glossary", "Learn", "My Stats", "Build", "Draft"];

const renderApp = () => render(<DataProvider><App /></DataProvider>);

describe("App shell", () => {
  beforeEach(() => { localStorage.clear(); vi.stubGlobal("fetch", () => Promise.reject(new Error("offline"))); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders the default Meta tab and the tab bar", () => {
    renderApp();
    expect(screen.getByText("Season 40 Meta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Draft" })).toBeInTheDocument();
  });

  it("renders every tab without crashing", () => {
    renderApp();
    for (const t of TABS) {
      fireEvent.click(screen.getByRole("button", { name: t }));
    }
    // After visiting all tabs we end on Draft; its reset button should be present.
    expect(screen.getByRole("button", { name: /Reset/ })).toBeInTheDocument();
  });

  it("switches to Glossary and shows a known term", () => {
    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Glossary" }));
    expect(screen.getByText(/Crowd Control/i)).toBeInTheDocument();
  });

  it("opens hero detail takeover and returns via Back", () => {
    renderApp();
    // Meta tab lists Top Bans (e.g. Joy). Click the first occurrence to open detail.
    fireEvent.click(screen.getAllByText("Joy")[0]);
    expect(screen.getByRole("button", { name: /Back/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByText("Season 40 Meta")).toBeInTheDocument();
  });

  it("logs a match in My Stats and persists it to storage", () => {
    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "My Stats" }));
    fireEvent.change(screen.getByPlaceholderText("Hero name..."), { target: { value: "Tigreal" } });
    fireEvent.click(screen.getByRole("button", { name: /Log Match/ }));
    const stored = JSON.parse(localStorage.getItem("mlbb-tracker"));
    expect(stored[0].hero).toBe("Tigreal");
    expect(stored[0].result).toBe("Win");
  });
});
