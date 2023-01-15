import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { shopClient } from "~/lib/utils";
import { request as requestGraphql } from "graphql-request";
import { NotFound } from "~/components/global/NotFound";
import { PageHeader } from "~/components/global/PageHeader";
import { Section } from "~/components/elements/Section";
import { ProductGrid } from "~/components/product/ProductGrid";
import { Text } from "~/components/elements/Text";
import { graphql } from "~/lib/gql/gql";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";

// const PAGE_BY = 48;
const PAGE_BY = 4;

const query = graphql(`
  query CollectionPage($handle: String!, $pageBy: Int!, $cursor: String) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
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
  }
`);

export const loader = (async ({ request, params: { handle } }) => {
  invariant(handle, "Missing handle");
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get("cursor");
  const data = await requestGraphql({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      handle,
      pageBy: PAGE_BY,
      cursor,
    },
  });
  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function CollectionRoute() {
  const { data } = useLoaderData<typeof loader>();
  const collection = data.collection;

  if (!collection) {
    return <NotFound type="collection" />;
  }

  return (
    <>
      <PageHeader heading={collection.title}>
        {collection?.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <Text format width="narrow" as="p" className="inline-block">
                {collection.description}
              </Text>
            </div>
          </div>
        )}
      </PageHeader>
      <Section>
        <ProductGrid
          key={collection.id}
          collection={collection as Collection}
          href={`/collections/${collection.handle}`}
        />
      </Section>
    </>
  );
}
