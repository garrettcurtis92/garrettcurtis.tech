import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders exactly one <h1>", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the // 404 eyebrow", () => {
    render(<NotFound />);
    expect(screen.getByText("// 404")).toBeInTheDocument();
  });

  it("renders the H1 as 'Not here.'", () => {
    render(<NotFound />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Not here.");
  });

  it("renders the verbatim body text", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/This URL doesn't resolve\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The site is small\. Start at home/)
    ).toBeInTheDocument();
  });

  it("renders the Home wayfinding link with href='/'", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the About wayfinding link with href='/about'", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });
});
