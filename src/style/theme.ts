const BASE_SIZE = 0.25; // in rem units

export function size(amt: number): string {
  return `${amt * BASE_SIZE}rem`;
}

export const COLORS = {
  bg: "#121212",
  bgLight: "#262626",
  bgPop: "#404040",

  text: "#FFFFFF",
  textDim: "#A3A3A3",

  link: "#0074D9",

  placeholder: "rgba(0, 0, 0, 0.4)",
  placeholderBorder: "rgba(0, 0, 0, 0.8)",
};

export const SIZES = {
  sm: size(48),
  md: size(64),
  lg: size(72),
  xl: size(96),

  borderRadius: size(1.5),
};
