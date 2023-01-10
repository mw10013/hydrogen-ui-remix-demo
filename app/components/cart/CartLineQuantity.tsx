import React from "react";
import { useCartLine } from "./CartLineProvider";

export function CartLineQuantity<
  TTag extends keyof JSX.IntrinsicElements = "span"
>(
  props: JSX.IntrinsicElements[TTag] & {
    /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
    as?: TTag;
  }
): JSX.Element {
  const cartLine = useCartLine();
  const { as, ...passthroughProps } = props;
  const Wrapper = as ? as : "span";
  return React.createElement(
    Wrapper,
    { ...passthroughProps },
    cartLine.quantity
  );
}
