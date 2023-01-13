import type { Product } from "@shopify/hydrogen-react/storefront-api-types";
import { Section } from "../elements/Section";
import { ProductCard } from "../cards/ProductCard";
import { graphql } from "~/lib/gql";
import request from "graphql-request";
import { shopClient } from "~/lib/utils";

export function ProductSwimlane({
  title,
  products,
  count = 12,
  ...props
}: {
  title: string;
  products: Product[];
  count?: number;
}) {
  return (
    <Section heading={title} padding="y" {...props}>
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {products.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className={"snap-start w-80"}
          />
        ))}
      </div>
    </Section>
  );
}

export const recommendedProductsQuery = graphql(`
  query productRecommendations($productId: ID!, $count: Int) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCardFragment
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
`);

export async function getRecommendedProductsData({
  productId,
  count,
}: {
  productId: string;
  count: number;
}) {
  const { recommended, additional } = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: recommendedProductsQuery,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      productId,
      count,
    },
  });

  const merged = recommended
    ?.concat(additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index
    );
  const productIndex = merged?.map((item) => item.id).indexOf(productId);
  if (productIndex && productIndex !== -1) {
    merged?.splice(productIndex, 1);
  }
  return merged ?? [];
}

export const topProductsQuery = graphql(`
  query topProducts($count: Int) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
`);
