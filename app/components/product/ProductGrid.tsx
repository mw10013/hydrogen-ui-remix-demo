import { useState, useRef, useEffect, useCallback } from "react";
import { flattenConnection } from "@shopify/hydrogen-react";
import { getImageLoadingPriority } from "~/lib/const";
import type {
  Collection,
  Product,
} from "@shopify/hydrogen-react/storefront-api-types";
import { Link, useFetcher } from "@remix-run/react";
import { Grid } from "../elements/Grid";
import { ProductCard } from "../cards/ProductCard";
import { Button } from "../elements/Button";
import type { loader } from "~/routes/products";

export function ProductGrid({
  collection,
  href
}: {
  collection: Collection;
  href: string
}) {
  const nextButtonRef = useRef(null);
  const initialProducts = collection?.products?.nodes || [];
  const { hasNextPage, endCursor } = collection?.products?.pageInfo ?? {};
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cursor, setCursor] = useState(endCursor ?? "");
  const [nextPage, setNextPage] = useState(hasNextPage);
  const haveProducts = initialProducts.length > 0;
  const fetcher = useFetcher<typeof loader>();

  const fetchProducts = useCallback(() => {
    // const href = `${location.pathname}?index&cursor=${cursor}`;
    fetcher.load(`${href}&cursor=${cursor}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            disabled={fetcher.state === "loading"}
            onClick={fetchProducts}
            width="full"
          >
            {fetcher.state === "loading" ? "Loading..." : "Load more products"}
          </Button>
        </div>
      )}
    </>
  );
}
