import { useRef } from "react";
import { useScroll } from "react-use";
import { useCart, Money } from "@shopify/hydrogen-react";
import { Text } from "~/components/elements/Text";
import { CartEmpty } from "./CartEmpty";
import { CartLineItem } from "./CartLineItem";
import { Button } from "../elements/Button";
import { CartLineProvider } from "./CartLineProvider";
import type { CartLine } from "@shopify/hydrogen-react/storefront-api-types";
import { CartShopPayButton } from "./CartShopPayButton";

export function CartDetails({
  layout,
  onClose,
}: {
  layout: "drawer" | "page";
  onClose?: () => void;
}) {
  const { lines } = useCart();
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);

  if (lines?.length === 0) {
    return <CartEmpty onClose={onClose} layout={layout} />;
  }

  const container = {
    drawer: "grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]",
    page: "pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12",
  };

  const content = {
    drawer: "px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12",
    page: "flex-grow md:translate-y-4",
  };

  const summary = {
    drawer: "grid gap-6 p-6 border-t md:px-12",
    page: "sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full",
  };

  return (
    <form
      className={container[layout]}
      onSubmit={(evt) => evt.preventDefault()}
    >
      <section
        ref={scrollRef}
        aria-labelledby="cart-contents"
        className={`${content[layout]} ${y > 0 ? "border-t" : ""}`}
      >
        <ul className="grid gap-6 md:gap-10">
          {lines?.map((line) => {
            return (
              <CartLineProvider key={line?.id} line={line as CartLine}>
                <CartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby="summary-heading" className={summary[layout]}>
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        <OrderSummary />
        <CartCheckoutActions />
      </section>
    </form>
  );
}

function CartCheckoutActions() {
  const { checkoutUrl } = useCart();
  return (
    <>
      <div className="grid gap-4">
        {checkoutUrl ? (
          //   <Link to={checkoutUrl} prefetch={false} target="_self">
          <a href={checkoutUrl}>
            <Button as="span" width="full">
              Continue to Checkout
            </Button>
          </a>
        ) : null}
        <CartShopPayButton />
      </div>
    </>
  );
}

function OrderSummary() {
  const { cost } = useCart();
  return (
    <>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              "-"
            )}
          </Text>
        </div>
      </dl>
    </>
  );
}
