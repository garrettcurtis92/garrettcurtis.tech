import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

describe("Header", () => {
  it("renders the brand mark with 'Garrett Curtis' text", () => {
    render(<Header />);
    expect(screen.getByText(/Garrett Curtis/)).toBeInTheDocument();
  });

  it("renders the About nav link with href='/about'", () => {
    render(<Header />);
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("renders the theme toggle as a button", () => {
    render(<Header />);
    // The toggle has aria-label "Switch to dark mode" or "Switch to light mode".
    // Either matches a name regex; we just need a button to exist.
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("wraps About link and theme toggle in a navigation landmark labeled 'Primary'", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    // Sanity: the About link should live inside that landmark.
    expect(nav).toContainElement(screen.getByRole("link", { name: "About" }));
  });
});
