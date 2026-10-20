import "react";

declare module "react" {
  /** Lets markup set the stylesheet's custom properties, e.g. style={{ "--d": 140 }}. */
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
