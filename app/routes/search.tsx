import { PAGINATION_SIZE } from "~/lib/const";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import { graphql } from "~/lib/gql/gql";
import { request as graphqlRequest } from "graphql-request";
import { shopClient } from "~/lib/utils";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Section } from "~/components/elements/Section";
import { ProductGrid } from "~/components/product/ProductGrid";
import { Text } from "~/components/elements/Text";
import { NoResultRecommendations } from "~/components/search/NoResultRecommendations";
import { SearchPage } from "~/components/search/SearchPage";
import { SearchQuery } from "~/lib/gql/graphql";

const query = graphql(`
  query Search($searchTerm: String, $pageBy: Int!, $cursor: String) {
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

interface Data {
  data?: SearchQuery;
  searchTerm: string;
  cursor?: string | null;
}

export const loader = (async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get("q") ?? "";
  if (searchTerm === "") {
    return json<Data>({ searchTerm });
  }

  const cursor = searchParams.get("cursor");
  const data = await graphqlRequest({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      searchTerm,
      pageBy: PAGINATION_SIZE,
      cursor,
    },
  });
  return json<Data>({
    data,
    searchTerm,
    cursor,
  });
}) satisfies LoaderFunction;

export default function Search() {
  const { data, searchTerm, cursor } = useLoaderData<typeof loader>();

  if (!data || data?.products.nodes.length === 0) {
    return (
      <SearchPage searchTerm={searchTerm}>
        {data?.products.nodes.length === 0 && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
      </SearchPage>
    )
  }

  return (
    <div>
      <p>Search Term: {searchTerm}</p>
      <p>Cursor: {cursor}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  //   const noResults = products.nodes.length === 0;

  //   if (noResults) {
  //     return (
  //       <SearchPage searchTerm={searchTerm}>
  //         {noResults && (
  //           <Section padding="x">
  //             <Text className="opacity-50">No results, try something else.</Text>
  //           </Section>
  //         )}
  //         <NoResultRecommendations />
  //       </SearchPage>
  //     );
  //   }

  //   return (
  //     <SearchPage searchTerm={searchTerm}>
  //       <Section>
  //         <div>Search Term: {searchTerm}</div>
  //         <pre>{JSON.stringify(products, null, 2)}</pre>
  //         <ProductGrid
  //           key="search"
  //           //   url={`/search?q=${searchTerm}`}
  //           collection={{ products } as Collection}
  //         />
  //       </Section>
  //     </SearchPage>
  //   );
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
