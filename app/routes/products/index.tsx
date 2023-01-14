import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import { Section } from "~/components/elements/Section";
import { PageHeader } from "~/components/global/PageHeader";
import { shopClient } from "~/lib/utils";
import { request } from "graphql-request";
import { graphql } from "~/lib/gql/gql";
import { PAGINATION_SIZE } from "~/lib/const";
import { useLoaderData } from "@remix-run/react";
import { ProductGrid } from "~/components/product/ProductGrid";

const query = graphql(`
  query Products($pageBy: Int!, $cursor: String) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCardFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export const loader = (async ({ params: { cursor } }) => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      pageBy: PAGINATION_SIZE,
      cursor,
    },
  });
  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function AllProducts() {
  const {
    data: { products },
  } = useLoaderData<typeof loader>();
  return (
    <>
      <PageHeader heading="All Products" variant="allCollections" />
      <Section>
        <ProductGrid
          key="products"
          // url={`/products`}
          collection={{ products } as Collection}
        />
      </Section>
    </>
  );
}
