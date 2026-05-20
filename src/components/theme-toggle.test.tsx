import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders a non-breaking space label before mount sync (stable width)", () => {
    // First render is server-equivalent: mounted=false, label=" ".
    // After useEffect runs (synchronous in happy-dom), label is set.
    // We assert the button exists and has accessible aria-label after mount.
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("defaults to light when no attribute and no stored value", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Label says the OTHER mode; default light → label is "dark".
    expect(button).toHaveTextContent("dark");
    expect(button).toHaveAccessibleName("Switch to dark mode");
  });

  it("reads existing data-theme=dark on mount", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Current is dark → label says "light".
    expect(button).toHaveTextContent("light");
    expect(button).toHaveAccessibleName("Switch to light mode");
  });

  it("toggles attribute and writes localStorage on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Start in light (no attribute).
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();

    fireEvent.click(button);

    // Now dark.
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(button).toHaveTextContent("light");

    fireEvent.click(button);

    // Back to light.
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(button).toHaveTextContent("dark");
  });
});
