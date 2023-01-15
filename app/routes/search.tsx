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
import type { SearchQuery } from "~/lib/gql/graphql";

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
  const { data, searchTerm } = useLoaderData<typeof loader>();

  if (!data) {
    return <SearchPage searchTerm={searchTerm} />;
  }
  if (data.products.nodes.length === 0) {
    return (
      <SearchPage searchTerm={searchTerm}>
        <Section padding="x">
          <Text className="opacity-50">No results, try something else.</Text>
        </Section>
      </SearchPage>
    );
  }

  return (
    <SearchPage searchTerm={searchTerm}>
      <Section>
        {/* Use searchTerm as key so ProductGrid resets data on new search. */}
        <ProductGrid
          key={searchTerm}
          collection={{ products: data.products } as Collection}
          href={`/search?q=${searchTerm}`}
        />
      </Section>
    </SearchPage>
  );
}
