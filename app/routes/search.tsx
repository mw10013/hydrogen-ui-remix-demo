import { PAGINATION_SIZE } from "~/lib/const";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import { graphql } from "~/lib/gql/gql";
import request from "graphql-request";
import { shopClient } from "~/lib/utils";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Section } from "~/components/elements/Section";
import { ProductGrid } from "~/components/product/ProductGrid";
import { Text } from "~/components/elements/Text";
import { NoResultRecommendations } from "~/components/search/NoResultRecommendations";
import { SearchPage } from "~/components/search/SearchPage";

const query = graphql(`
  query search($searchTerm: String, $pageBy: Int!, $cursor: String) {
    products(
      first: $pageBy
      sortKey: RELEVANCE
      query: $searchTerm
      after: $cursor
    ) {
      nodes {
        ...ProductCardFragment
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

// const PAGINATE_SEARCH_QUERY = gql`
//   query ProductsPage(
//     $searchTerm: String
//     $pageBy: Int!
//     $cursor: String
//     $country: CountryCode
//     $language: LanguageCode
//   ) @inContext(country: $country, language: $language) {
//     products(
//       sortKey: RELEVANCE
//       query: $searchTerm
//       first: $pageBy
//       after: $cursor
//     ) {
//       nodes {
//         ...ProductCardFragment
//       }
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//     }
//   }
// `;

export const loader = (async ({
  params: { q: searchTerm = undefined, cursor = undefined },
}) => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      searchTerm,
      pageBy: PAGINATION_SIZE,
      cursor,
    },
  });
  return json({
    data: { ...data, searchTerm },
  });
}) satisfies LoaderFunction;

export default function Search() {
  const {
    data: { products, searchTerm },
  } = useLoaderData<typeof loader>();
  const noResults = products.nodes.length === 0;

  if (noResults) {
    return (
      <SearchPage searchTerm={searchTerm}>
        {noResults && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
        <NoResultRecommendations />
      </SearchPage>
    );
  }

  return (
    <SearchPage searchTerm={searchTerm}>
      <Section>
        <ProductGrid
          key="search"
          //   url={`/search?q=${searchTerm}`}
          collection={{ products } as Collection}
        />
      </Section>
    </SearchPage>
  );
}

// API to paginate the results of the search query.
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
//   const searchTerm = url.searchParams.get("q");
//   const { handle } = params;

//   return await queryShop({
//     query: PAGINATE_SEARCH_QUERY,
//     variables: {
//       handle,
//       cursor,
//       pageBy: PAGINATION_SIZE,
//       country,
//       searchTerm,
//     },
//   });
// }
