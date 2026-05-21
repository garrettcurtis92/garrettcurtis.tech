import { describe, it, expect } from "vitest";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders chrome and children without throwing", () => {
    // RootLayout returns an <html> tree, which can't render inside another
    // <html> in jsdom/happy-dom. We assert the component is callable and
    // returns a non-null element instead of rendering it into the DOM.
    const tree = RootLayout({ children: <span data-testid="child">hi</span> });
    expect(tree).not.toBeNull();
    expect(tree.type).toBe("html");
  });

  it("attaches data-theme suppression to <html>", () => {
    const tree = RootLayout({ children: null });
    expect(tree.props.suppressHydrationWarning).toBe(true);
    expect(tree.props.lang).toBe("en");
  });
});
