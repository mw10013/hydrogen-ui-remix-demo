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
import type { SearchQuery, FeaturedQuery } from "~/lib/gql/graphql";

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

const featuredQuery = graphql(`
  query Featured($pageBy: Int!) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
`);

interface Data {
  searchTerm: string;
  data?: SearchQuery;
  cursor?: string | null;
  featured?: FeaturedQuery;
}

export const loader = (async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get("q") ?? "";
  const cursor = searchParams.get("cursor");
  const data =
    searchTerm !== ""
      ? await graphqlRequest({
          url: shopClient.getStorefrontApiUrl(),
          document: query,
          requestHeaders: shopClient.getPublicTokenHeaders(),
          variables: {
            searchTerm,
            pageBy: PAGINATION_SIZE,
            cursor,
          },
        })
      : undefined;
  const featured =
    !cursor && (searchTerm === "" || data?.products.nodes.length === 0)
      ? await graphqlRequest({
          url: shopClient.getStorefrontApiUrl(),
          document: featuredQuery,
          requestHeaders: shopClient.getPublicTokenHeaders(),
          variables: {
            pageBy: PAGINATION_SIZE,
          },
        })
      : undefined;
  return json<Data>({
    searchTerm,
    data,
    cursor,
    featured,
  });
}) satisfies LoaderFunction;

export default function Search() {
  const { data, searchTerm, featured } = useLoaderData<typeof loader>();
  if (searchTerm === "" || data?.products.nodes.length === 0) {
    return (
      <SearchPage searchTerm={searchTerm}>
        {data?.products.nodes.length === 0 ? (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        ) : null}
        {featured ? <NoResultRecommendations featured={featured} /> : null}
      </SearchPage>
    );
  }
  return (
    <SearchPage searchTerm={searchTerm}>
      <Section>
        {/* Use searchTerm as key so ProductGrid resets data on new search. */}
        <ProductGrid
          key={searchTerm}
          collection={{ products: data?.products } as Collection}
          href={`/search?q=${searchTerm}`}
        />
      </Section>
    </SearchPage>
  );
}
