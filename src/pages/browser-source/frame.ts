import { ReactNode } from "react";
import { z } from "zod/v4";

// Frames package a functional component along with a Zod object representing the type of
// additional props that should be sent to the frame. We use the zod object to automatically
// generate the form to build that frame, and to parse the configuration data from the URLs
// that those forms build.
//
// To put it another way, the nastiness here and in BrowserSourcePage is the price we pay so
// all you need to do to add a new frame is build it with buildFrameComponent and add it to
// the map in frames/index.ts.

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

// Typescript shenanigans to make it so you don't have to define an empty zod
// object if your frame has no configuration parameters.
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
