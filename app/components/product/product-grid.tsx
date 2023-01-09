import { useState, useRef, useEffect, useCallback } from "react";
import { flattenConnection } from "@shopify/hydrogen-react";
import { getImageLoadingPriority } from "~/lib/const";
import type {
  Collection,
  Product,
} from "@shopify/hydrogen-react/storefront-api-types";
import { Link, useFetcher } from "@remix-run/react";
import { Grid } from "../elements/grid";
import { ProductCard } from "../cards/product-card";
import { Button } from "../elements/button";
import { action } from "~/routes/products";

export function ProductGrid({
  url,
  collection,
}: {
  url: string;
  collection: Collection;
}) {
  const nextButtonRef = useRef(null);
  const initialProducts = collection?.products?.nodes || [];
  const { hasNextPage, endCursor } = collection?.products?.pageInfo ?? {};
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cursor, setCursor] = useState(endCursor ?? "");
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);
  const haveProducts = initialProducts.length > 0;
  const fetcher = useFetcher<typeof action>();

  const fetchProducts = useCallback(async () => {
    setPending(true);
    fetcher.submit(new URLSearchParams({cursor}), {method: "post"})
  }, [cursor]);

  useEffect(() => {
    const fetchData = fetcher.data;
    if (fetchData) {
      // ProductGrid can paginate collection, products and search routes
      const data = fetchData.data as any;
      // @ts-ignore TODO: Fix types
      const newProducts: Product[] = flattenConnection<Product>(
        data.collection?.products || data.products || []
      );
      const { endCursor, hasNextPage } = data.collection?.products?.pageInfo ||
        data.products?.pageInfo || { endCursor: "", hasNextPage: false };

      setProducts((prev) => [...prev, ...newProducts]);
      setCursor(endCursor);
      setNextPage(hasNextPage);
      setPending(false);
    }
  }, [fetcher.data]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchProducts();
        }
      });
    },
    [fetchProducts]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "100%",
    });

    const nextButton = nextButtonRef.current;

    if (nextButton) observer.observe(nextButton);

    return () => {
      if (nextButton) observer.unobserve(nextButton);
    };
  }, [nextButtonRef, cursor, handleIntersect]);

  if (!haveProducts) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <>
      <Grid layout="products">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))}
      </Grid>

      {nextPage && (
        <div
          className="flex items-center justify-center mt-6"
          ref={nextButtonRef}
        >
          <Button
            variant="secondary"
            disabled={pending}
            onClick={fetchProducts}
            width="full"
          >
            {fetcher.state === "submitting" ? "Loading..." : "Load more products"}
          </Button>
        </div>
      )}
    </>
  );
}
