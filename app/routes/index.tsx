import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { graphql } from "~/lib/gql/gql";
import { request } from "graphql-request";
import { shopClient } from "~/lib/utils";
import { Hero } from "~/components/sections/Hero";
import { ProductSwimlane } from "~/components/sections/ProductSwimlane";
import { FeaturedCollections } from "~/components/sections/FeaturedCollections";
import type { Product } from "@shopify/hydrogen-react/storefront-api-types";

const query = graphql(`
  query homepage {
    heroBanners: collections(
      first: 3
      query: "collection_type:custom"
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        handle
        title
        descriptionHtml
        heading: metafield(namespace: "hero", key: "title") {
          value
        }
        byline: metafield(namespace: "hero", key: "byline") {
          value
        }
        cta: metafield(namespace: "hero", key: "cta") {
          value
        }
        spread: metafield(namespace: "hero", key: "spread") {
          reference {
            ...MediaFragment
          }
        }
        spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
          reference {
            ...MediaFragment
          }
        }
      }
    }
    featuredCollections: collections(
      first: 3
      query: "collection_type:smart"
      sortKey: UPDATED_AT
    ) {
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
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCardFragment
      }
    }
  }
`);

export const loader = (async () => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
  });

  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const [primaryHero, secondaryHero, tertiaryHero] = data.heroBanners.nodes;

  // const { session } = useOutletContext<ContextType>();
  return (
    <>
      <Hero {...(primaryHero as any)} height="full" top loading="eager" />
      <ProductSwimlane
        products={data.featuredProducts.nodes as Product[]}
        title="Featured Products"
        // divider="bottom"
      />
      <Hero {...(secondaryHero as any)} />
      <FeaturedCollections
        data={data.featuredCollections.nodes as any}
        title="Collections"
      />
      <Hero {...(tertiaryHero as any)} />
    </>
  );
}
