import { ReactNode } from "react";
import { DisplayRace } from "../../data/stages/types";
import { z } from "zod/v4";

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
