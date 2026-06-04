import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../src/components/ErrorBoundary.jsx";

const Boom = () => { throw new Error("boom"); };

describe("ErrorBoundary", () => {
  it("renders a recoverable fallback when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reload app/i })).toBeInTheDocument();
    spy.mockRestore();
  });

  it("renders children normally when no error", () => {
    render(<ErrorBoundary><div>all good</div></ErrorBoundary>);
    expect(screen.getByText("all good")).toBeInTheDocument();
  });
});
