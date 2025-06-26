import { ReactNode } from "react";
import { z } from "zod/v4";

// Frames package a functional component along with a Zod object representing the type of
// additional props that should be sent to the frame along with the race information. We
// use Zod here both so we can type check the props object we build from the URL's query
// parameters and so we can automatically generate the form to build URLs for the frame
// instead of building them individually.

// We do some type shenanigans here so we can make the zod object optional for frames that
// don't need additional properties in an ergonomic way.

interface DisplayProperties<TProps = unknown> {
  displayName: string;
  width: number;
  height: number;
  defaultName?: (props: TProps) => string;
  autoResize?: boolean;
  skipRequireRace?: boolean;
}

export type FrameComponent<
  TZodType extends Readonly<{
    [k: string]: z.core.$ZodType<unknown, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }> = any
> = {
  displayProperties: DisplayProperties<z.infer<z.ZodObject<TZodType>>>;
  zodProps: z.ZodObject<TZodType>;
  fc: (props: z.infer<z.ZodObject<TZodType>>) => ReactNode;
};

export function buildFrameComponent<
  TZodType extends Readonly<{ [k: string]: z.core.$ZodType<unknown, unknown> }>
>(
  displayProperties: DisplayProperties<z.infer<z.ZodObject<TZodType>>>,
  zodProps: z.ZodObject<TZodType>,
  fc: (props: z.infer<z.ZodObject<TZodType>>) => ReactNode
): FrameComponent<TZodType>;

export function buildFrameComponent(
  displayProperties: DisplayProperties,
  fc: () => ReactNode
): FrameComponent;

export function buildFrameComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayProperties: DisplayProperties<any>,
  zodPropsOrFC: unknown,
  fc?: unknown
) {
  if (typeof zodPropsOrFC === "function") {
    return { displayProperties, zodProps: z.object({}), fc: zodPropsOrFC };
  }

  return { displayProperties, zodProps: zodPropsOrFC, fc };
}
