import { ReactNode } from "react";
import { DisplayRace } from "../../data/stages/types";
import { z } from "zod/v4";

// Frames package a functional component along with a Zod object representing the type of
// additional props that should be sent to the frame along with the race information. We
// use Zod here both so we can type check the props object we build from the URL's query
// parameters and so we can automatically generate the form to build URLs for the frame
// instead of building them individually.

// We do some type shenanigans here so we can make the zod object optional for frames that
// don't need additional properties in an ergonomic way.

export type FrameComponent<
  TZodType extends Readonly<{
    [k: string]: z.core.$ZodType<unknown, unknown>;
  }> = Readonly<{ [k: string]: z.core.$ZodType<unknown, unknown> }>
> = {
  displayName: string;
  zodProps: z.ZodObject<TZodType>;
  fc: (
    props: {
      race: DisplayRace;
    } & object
  ) => ReactNode;
};

export function buildFrameComponent<
  TZodType extends Readonly<{ [k: string]: z.core.$ZodType<unknown, unknown> }>
>(
  displayName: string,
  zodProps: z.ZodObject<TZodType>,
  fc: (
    props: { race: DisplayRace } & z.infer<z.ZodObject<TZodType>>
  ) => ReactNode
): FrameComponent<TZodType>;

export function buildFrameComponent(
  displayName: string,
  fc: (props: { race: DisplayRace }) => ReactNode
): FrameComponent;

export function buildFrameComponent(
  displayName: string,
  zodPropsOrFC: unknown,
  fc?: unknown
) {
  if (typeof zodPropsOrFC === "function") {
    return { displayName, zodProps: z.object({}), fc: zodPropsOrFC };
  }

  return { displayName, zodProps: zodPropsOrFC, fc };
}
