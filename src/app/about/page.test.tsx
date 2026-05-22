import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./page";

describe("About page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<About />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the profile photo with alt='Garrett Curtis'", () => {
    render(<About />);
    expect(screen.getByAltText("Garrett Curtis")).toBeInTheDocument();
  });

  it("renders the /about eyebrow", () => {
    render(<About />);
    expect(screen.getByText("/about")).toBeInTheDocument();
  });

  it("renders the H1 as 'About.'", () => {
    render(<About />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("About.");
  });

  it("renders the verbatim first About paragraph", () => {
    render(<About />);
    expect(
      screen.getByText(/I came up through corporate IT/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all of it production-grade\./)
    ).toBeInTheDocument();
  });

  it("renders the verbatim second About paragraph", () => {
    render(<About />);
    expect(
      screen.getByText(/I'm not a developer who picked up AI/)
    ).toBeInTheDocument();
  });

  it("renders the 'How I work.' H2", () => {
    render(<About />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe("How I work.");
  });

  it("renders all five principle lead phrases", () => {
    render(<About />);
    expect(screen.getByText("Vertical slices.")).toBeInTheDocument();
    expect(screen.getByText("Spec before code.")).toBeInTheDocument();
    expect(screen.getByText("The repo tells the story.")).toBeInTheDocument();
    expect(screen.getByText("Tradeoffs out loud.")).toBeInTheDocument();
    expect(
      screen.getByText("AI does the typing; I do the judgment.")
    ).toBeInTheDocument();
  });
});
