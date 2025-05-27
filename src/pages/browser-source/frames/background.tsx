import { z } from "zod/v4";
import { buildFrameComponent } from "../frame";
import mario64Img from "../../../assets/mario64bkg.png";
import zelda64Img from "../../../assets/zelda64bkg.jpg";

const Params = z.object({
  theme: z.enum(["mario64", "zelda64"]).default("mario64"),
});

export const backgroundFrame = buildFrameComponent(
  {
    displayName: "Background",
    width: 1920,
    height: 1080,
  },
  Params,
  ({ theme }) => {
    const img = getImage(theme);
    return (
      <div
        className="w-full h-full bg-contain bg-center"
        style={{
          background: `url('${img}')`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }
);

function getImage(theme: z.infer<typeof Params.shape.theme>): string {
  switch (theme) {
    case "mario64":
      return mario64Img;
    case "zelda64":
      return zelda64Img;
  }
}
