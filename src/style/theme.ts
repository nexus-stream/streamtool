const BASE_SPACING = 0.25; // in rem units

export function spacing(amt: number): string {
  return `${amt * BASE_SPACING}rem`;
}

export const COLORS = {
  bg: "#121212",
  bgLight: "#262626",
  bgPop: "#404040",

  text: "#FFFFFF",
  textDim: "#A3A3A3",

  link: "blue",
};

export const SIZES = {
  sm: `${48 * BASE_SPACING}rem`,
  md: `${64 * BASE_SPACING}rem`,
  lg: `${72 * BASE_SPACING}rem`,
  xl: `${96 * BASE_SPACING}rem`,
};
