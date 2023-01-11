import { ShopPayButton, useCart } from "@shopify/hydrogen-react";
import React, { useMemo } from "react";
import invariant from "tiny-invariant";

/**
 * The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export function CartShopPayButton(
  props: Omit<React.ComponentProps<typeof ShopPayButton>, "variantIds">
) {
  const { lines } = useCart();
  invariant(lines, "Missing lines");
  const idsAndQuantities = useMemo(() => {
    return lines.map((line) => {
      invariant(line && line.merchandise && line.merchandise.id && line.quantity, "Invalid line");
      return {
        id: line?.merchandise?.id,
        quantity: line?.quantity,
      };
    });
  }, [lines]);
  return React.createElement(ShopPayButton, {
    variantIdsAndQuantities: idsAndQuantities,
    ...props,
  });
}
