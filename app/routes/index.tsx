import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { graphql } from "~/lib/gql/gql";
import { request } from "graphql-request";
import { shopClient } from "~/lib/utils";
import { Hero } from "~/components/sections/hero";

export const MediaFragment = graphql(`
  fragment MediaFragment on Media {
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`);

export const ProductCardFragment = graphql(`
  fragment ProductCardFragment on Product {
    id
    title
    publishedAt
    handle
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        priceV2 {
          amount
          currencyCode
        }
        compareAtPriceV2 {
          amount
          currencyCode
        }
      }
    }
  }
`);

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
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

/*

Type '{ height: "full"; top: true; loading: "eager"; id: string; handle: string; title: string; descriptionHtml: string; __typename?: "Collection" | undefined; heading?: SerializeObject<UndefinedToOptional<{ __typename?: "Metafield" | undefined; value: string; }>> | null | undefined; byline?: SerializeObject<...> | ... 1 ...' 
  is not assignable to type 
  '{ byline: Metafield; cta: Metafield; handle: string; heading: Metafield; height?: "full" | undefined; loading?: "eager" | "lazy" | undefined; spread: Metafield; spreadSecondary: Metafield; top?: boolean | undefined; }'.
  Types of property 'byline' are incompatible.
    Type 'SerializeObject<UndefinedToOptional<{ __typename?: "Metafield" | undefined; value: string; }>> | null | undefined' is not assignable to type 'Metafield'.
      Type 'undefined' is not assignable to type 'Metafield'.ts(2322)

*/
