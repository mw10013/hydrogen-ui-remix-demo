import { Link } from "@remix-run/react";
import { useCart, Image } from "@shopify/hydrogen-react";
import type { Image as ImageType } from "@shopify/hydrogen-react/storefront-api-types";
import { Text } from "~/components/elements/Text";
import { Heading } from "../elements/Heading";
import { IconRemove } from "../elements/Icon";
import { CartLinePrice } from "./CartLinePrice";
import { useCartLine } from "./CartLineProvider";
import { CartLineQuantity } from "./CartLineQuantity";
import { CartLineQuantityAdjustButton } from "./CartLineQuantityAdjustButton";

export function CartLineItem() {
  const { linesRemove } = useCart();
  const cartLine = useCartLine();
  const { id: lineId, quantity, merchandise } = cartLine;

  return (
    <li key={lineId} className="flex gap-4">
      <div className="flex-shrink">
        <Image
          width={112}
          height={112}
          widths={[112]}
          data={merchandise.image as ImageType}
          loaderOptions={{
            scale: 2,
            crop: "center",
          }}
          className="object-cover object-center w-24 h-24 border rounded md:w-28 md:h-28"
        />
      </div>

      <div className="flex justify-between flex-grow">
        <div className="grid gap-2">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>

          <div className="grid pb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name}>
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />
            </div>
            <button
              type="button"
              onClick={() => linesRemove([lineId])}
              className="flex items-center justify-center w-10 h-10 border rounded"
            >
              <span className="sr-only">Remove</span>
              <IconRemove aria-hidden="true" />
            </button>
          </div>
        </div>
        <Text>
          <CartLinePrice as="span" data={cartLine} />
        </Text>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center border rounded">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity as="div" className="px-2 text-center" />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
