import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EyebrowLabel } from "./eyebrow-label";

describe("EyebrowLabel", () => {
  it("renders its children as text", () => {
    render(<EyebrowLabel>{"// now"}</EyebrowLabel>);
    expect(screen.getByText("// now")).toBeInTheDocument();
  });

  it("uses a <p> tag (paragraph semantics for a labeled eyebrow)", () => {
    const { container } = render(<EyebrowLabel>{"// 404"}</EyebrowLabel>);
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe("// 404");
  });

  it("applies mono, uppercase, tracked, and accent classes per design-spec §6", () => {
    const { container } = render(<EyebrowLabel>/about</EyebrowLabel>);
    const p = container.querySelector("p");
    expect(p).toHaveClass("font-mono");
    expect(p).toHaveClass("text-xs");
    expect(p).toHaveClass("uppercase");
    expect(p).toHaveClass("tracking-wider");
    expect(p).toHaveClass("text-accent");
  });
});
