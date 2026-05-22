import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the verbatim headline 'AI-native builder. Full-stack engineer.'", () => {
    render(<Home />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("AI-native builder. Full-stack engineer.");
  });

  it("renders the subhead with italicized 'when to use AI and when not to'", () => {
    render(<Home />);
    expect(screen.getByText(/I ship software\./)).toBeInTheDocument();
    expect(
      screen.getByText(/The result is production systems built faster/)
    ).toBeInTheDocument();
    const em = screen.getByText("when to use AI and when not to");
    expect(em.tagName).toBe("EM");
  });

  it("renders the hero meta block with three lines", () => {
    render(<Home />);
    expect(screen.getByText("// now")).toBeInTheDocument();
    expect(screen.getByText("Clearwater Analytics")).toBeInTheDocument();
    expect(screen.getByText("Boise, ID")).toBeInTheDocument();
  });

  it("renders the about teaser paragraph verbatim", () => {
    render(<Home />);
    expect(
      screen.getByText(/I'm not a developer who picked up AI/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/grounded in enough infrastructure experience/)
    ).toBeInTheDocument();
  });

  it("renders the about teaser link pointing to /about", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /Read the full about/i });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders the mailto contact link", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /gcurtis1092@gmail\.com/i });
    expect(link).toHaveAttribute("href", "mailto:gcurtis1092@gmail.com");
  });

  it("renders the contact CTA preamble line", () => {
    render(<Home />);
    expect(
      screen.getByText(/Best place to reach me is email/i)
    ).toBeInTheDocument();
  });
});
