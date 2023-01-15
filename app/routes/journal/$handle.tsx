import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Image } from "@shopify/hydrogen-react";
import request from "graphql-request";
import invariant from "tiny-invariant";
import { CustomFont } from "~/components/CustomFont";
import { Section } from "~/components/elements/Section";
import { NotFound } from "~/components/global/NotFound";
import { PageHeader } from "~/components/global/PageHeader";
import { ATTR_LOADING_EAGER } from "~/lib/const";
import { graphql } from "~/lib/gql/gql";
import { shopClient } from "~/lib/utils";
import { BLOG_HANDLE } from ".";

const query = graphql(`
  query ArticleDetails($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
      }
    }
  }
`);

export const loader = (async ({ params: { handle } }) => {
  invariant(handle, "Missing article handle");
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      blogHandle: BLOG_HANDLE,
      articleHandle: handle,
    },
  });
  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function Post() {
  const { data } = useLoaderData<typeof loader>();
  if (!data?.blog?.articleByHandle) {
    return <NotFound />;
  }

  const { title, publishedAt, contentHtml, author } = data.blog.articleByHandle;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));

  return (
    <>
      {/* Loads Fraunces custom font only on articles */}
      <CustomFont />
      <PageHeader heading={title} variant="blogPost">
        <span>
          {formattedDate} &middot; {author?.name}
        </span>
      </PageHeader>
      <Section as="article" padding="x">
        {data.blog.articleByHandle.image && (
          <Image
            data={data.blog.articleByHandle.image}
            className="w-full mx-auto mt-8 md:mt-16 max-w-7xl"
            sizes="90vw"
            widths={[400, 800, 1200]}
            width="100px"
            loading={ATTR_LOADING_EAGER}
            loaderOptions={{
              scale: 2,
              crop: "center",
            }}
          />
        )}
        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="article"
        />
      </Section>
    </>
  );
}
