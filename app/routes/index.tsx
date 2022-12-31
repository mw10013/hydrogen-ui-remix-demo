import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { graphql } from "~/gql/gql";
import { request } from "graphql-request";
import { shopClient } from "~/lib/utils";
import { Image } from "@shopify/hydrogen-react";
// import type {IndexQueryQuery} from '../gql/graphql';

export const loader = (async () => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    // @TODO: convert to 'getPrivateTokenHeaders({buyerIp})'
    requestHeaders: shopClient.getPublicTokenHeaders(),
  });

  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  // const { session } = useOutletContext<ContextType>();
  return (
    <main className="mt-8 ml-8">
      <h1 className="font-bold text-lg">Welcome to {data.shop?.name}</h1>
      <Image
        data={data.products.nodes[0].variants.nodes[0].image ?? {}}
        width={500}
        loading="eager"
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}

const query = graphql(`
  query IndexQuery {
    shop {
      name
    }
    products(first: 1) {
      nodes {
        # if you uncomment 'blah', it should have a GraphQL validation error in your IDE if you have a GraphQL plugin. It should also give an error during 'npm run dev'
        # blah
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
          }
        }
      }
    }
  }
`);
