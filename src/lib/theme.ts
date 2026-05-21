/** Shared theme storage key referenced by the layout bootstrap script and ThemeToggle. */
export const THEME_STORAGE_KEY = "gc:theme";

/** Resolved theme; bootstrap guarantees one of these two values lives on `<html data-theme>`. */
export type Theme = "light" | "dark";
