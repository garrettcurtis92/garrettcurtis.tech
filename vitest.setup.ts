import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// next/font/google ships as an empty JS stub at runtime; the real loaders are
// applied by Next's SWC plugin at build time. Vitest doesn't run that plugin,
// so calls like `Hanken_Grotesk({ ... })` throw "is not a function" when
// importing modules that use next/font. Mock the loaders here so any test
// that touches a layout/page can render. The mock returns the shape the
// callers consume: a `variable` CSS-variable name and a `className`.
vi.mock("next/font/google", () => {
  const makeLoader = (cssVariable: string) => () => ({
    variable: cssVariable,
    className: cssVariable,
    style: { fontFamily: cssVariable },
  });
  return {
    Hanken_Grotesk: makeLoader("--font-hanken-grotesk"),
    Spectral: makeLoader("--font-spectral"),
    JetBrains_Mono: makeLoader("--font-jetbrains-mono"),
  };
});
