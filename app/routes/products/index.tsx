import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import { Section } from "~/components/elements/section";
import { PageHeader } from "~/components/global/page-header";
import { shopClient } from "~/lib/utils";
import { request } from "graphql-request";
import { graphql } from "~/lib/gql/gql";
import { PAGINATION_SIZE } from "~/lib/const";
import { useLoaderData } from "@remix-run/react";
import { ProductGrid } from "~/components/product/product-grid";

const query = graphql(`
  query AllProducts($pageBy: Int!, $cursor: String) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCardFragment
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`);

const pageQuery = graphql(`
  query ProductsPage($pageBy: Int!, $cursor: String) {
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

export const loader = (async () => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      pageBy: PAGINATION_SIZE,
    },
  });

  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function AllProducts() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <PageHeader heading="All Products" variant="allCollections" />
      <Section>
        <AllProductsGrid />
      </Section>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

function AllProductsGrid() {
  const { data } = useLoaderData<typeof loader>();
  const products = data.products;

  return (
    <ProductGrid
      key="products"
      url={`/products`}
      collection={{ products } as Collection}
    />
  );
}

// API to paginate products
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
// export async function api(
//   request: HydrogenRequest,
//   { params, queryShop }: HydrogenApiRouteOptions
// ) {
//   if (request.method !== "POST") {
//     return new Response("Method not allowed", {
//       status: 405,
//       headers: { Allow: "POST" },
//     });
//   }

//   const url = new URL(request.url);
//   const cursor = url.searchParams.get("cursor");
//   const country = url.searchParams.get("country");
//   const { handle } = params;

//   return await queryShop({
//     query: PAGINATE_ALL_PRODUCTS_QUERY,
//     variables: {
//       handle,
//       cursor,
//       pageBy: PAGINATION_SIZE,
//       country,
//     },
//   });
// }
