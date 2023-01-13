import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import request from "graphql-request";
import { CollectionCard } from "~/components/cards/CollectionCard";
import { Grid } from "~/components/elements/Grid";
import { Section } from "~/components/elements/Section";
import { PageHeader } from "~/components/global/PageHeader";
import { getImageLoadingPriority, PAGINATION_SIZE } from "~/lib/const";
import { graphql } from "~/lib/gql";
import { shopClient } from "~/lib/utils";

const query = graphql(`
  query Collections($pageBy: Int!) {
    collections(first: $pageBy) {
      nodes {
        id
        title
        description
        handle
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

export default function Collections() {
  const { data } = useLoaderData<typeof loader>();
  const collections = data.collections.nodes as Collection[];
  return (
    <>
      <PageHeader heading="Collections" />
      <Section>
        <Grid items={collections.length === 3 ? 3 : 2}>
          {collections.map((collection, i) => (
            <CollectionCard
              collection={collection}
              key={collection.id}
              loading={getImageLoadingPriority(i, 2)}
            />
          ))}
        </Grid>
      </Section>
    </>
  );
}
