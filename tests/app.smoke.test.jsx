import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App.jsx";
import { DataProvider } from "../src/data/DataContext.jsx";

// Mirrors the grouped navigation in App.jsx
const GROUPS = [
  { name: "Meta", tabs: ["Meta", "Updates", "Tiers", "Pro Picks"] },
  { name: "Heroes", tabs: ["Heroes", "Counter", "Compare"] },
  { name: "Draft", tabs: ["Draft", "Threats", "Lock-In"] },
  { name: "Build", tabs: ["Build", "Items", "Emblems", "Spells"] },
  { name: "Guides", tabs: ["Jungle", "Roam", "Macro", "Teams", "Learn", "Glossary"] },
  { name: "You", tabs: ["Play Now", "My Stats", "Climb"] },
];

const renderApp = () => render(<DataProvider><App /></DataProvider>);

// Group buttons render before subtab buttons in the DOM, so for a name shared by
// both (e.g. "Meta", "Heroes") index 0 is the group and the last is the subtab.
const clickGroup = (name) => fireEvent.click(screen.getAllByRole("tab", { name })[0]);
const clickTab = (name) => {
  const els = screen.getAllByRole("tab", { name });
  fireEvent.click(els[els.length - 1]);
};

describe("App shell", () => {
  beforeEach(() => { localStorage.clear(); vi.stubGlobal("fetch", () => Promise.reject(new Error("offline"))); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders the default Meta tab and the grouped nav", () => {
    renderApp();
    expect(screen.getByText("Season 40 Meta")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Guides" })).toBeInTheDocument();
  });

  it("renders every tab in every group without crashing", () => {
    renderApp();
    for (const g of GROUPS) {
      clickGroup(g.name);
      for (const t of g.tabs) clickTab(t);
    }
    // Ends on You > Climb
    expect(screen.getByText(/Climb Plan/i)).toBeInTheDocument();
  });

  it("navigates Guides > Glossary and shows a known term", () => {
    renderApp();
    clickGroup("Guides");
    clickTab("Glossary");
    expect(screen.getByText(/Crowd Control/i)).toBeInTheDocument();
  });

  it("opens hero detail takeover and returns via Back", () => {
    renderApp();
    fireEvent.click(screen.getAllByText("Joy")[0]);
    expect(screen.getByRole("button", { name: /Back/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByText("Season 40 Meta")).toBeInTheDocument();
  });

  it("logs a match in My Stats and persists it to storage", () => {
    renderApp();
    clickGroup("You"); // opens on Play Now
    clickTab("My Stats");
    fireEvent.change(screen.getByPlaceholderText("Hero name..."), { target: { value: "Tigreal" } });
    fireEvent.click(screen.getByRole("button", { name: /Log Match/ }));
    const stored = JSON.parse(localStorage.getItem("mlbb-tracker"));
    expect(stored[0].hero).toBe("Tigreal");
    expect(stored[0].result).toBe("Win");
  });
});
