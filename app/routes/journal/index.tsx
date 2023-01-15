import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { flattenConnection } from "@shopify/hydrogen-react";
import type {
  Article,
  Blog as BlogType,
} from "@shopify/hydrogen-react/storefront-api-types";
import request from "graphql-request";
import { ArticleCard } from "~/components/cards/ArticleCard";
import { Grid } from "~/components/elements/Grid";
import { PageHeader } from "~/components/global/PageHeader";
import { getImageLoadingPriority, PAGINATION_SIZE } from "~/lib/const";
import { graphql } from "~/lib/gql/gql";
import { shopClient } from "~/lib/utils";

const BLOG_HANDLE = "Journal";

const query = graphql(`
  query Blog($blogHandle: String!, $pageBy: Int!, $cursor: String) {
    blog(handle: $blogHandle) {
      articles(first: $pageBy, after: $cursor) {
        edges {
          node {
            author: authorV2 {
              name
            }
            contentHtml
            handle
            id
            image {
              id
              altText
              url
              width
              height
            }
            publishedAt
            title
          }
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
      blogHandle: BLOG_HANDLE,
      pageBy: PAGINATION_SIZE,
      cursor: null,
    },
  });
  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function Blog() {
  const { data } = useLoaderData<typeof loader>();
  const rawArticles = flattenConnection<Article>(data.blog?.articles);

  const articles = rawArticles.map((article) => {
    const { publishedAt } = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(publishedAt!)),
    };
  });

  if (articles.length === 0) {
    return <p>No articles found</p>;
  }

  return (
    <>
      <PageHeader heading={BLOG_HANDLE} className="gap-0">
        {/* <pre>{JSON.stringify(articles, null, 2)}</pre> */}
        <Grid as="ol" layout="blog" gap="blog">
          {articles.map((article, i) => {
            return (
              <ArticleCard
                blogHandle={BLOG_HANDLE.toLowerCase()}
                article={article as Article}
                key={article.id}
                loading={getImageLoadingPriority(i, 2)}
              />
            );
          })}
        </Grid>
      </PageHeader>
    </>
  );
}

function JournalsGrid({ pageBy }: { pageBy: number }) {
  const {
    language: { isoCode: languageCode },
    country: { isoCode: countryCode },
  } = useLocalization();

  const { data } = useShopQuery<{
    blog: BlogType;
  }>({
    query: BLOG_QUERY,
    variables: {
      language: languageCode,
      blogHandle: BLOG_HANDLE,
      pageBy,
    },
  });

  useServerAnalytics({
    shopify: {
      canonicalPath: `/${BLOG_HANDLE}`,
      pageType: ShopifyAnalyticsConstants.pageType.page,
    },
  });

  // TODO: How to fix this type?
  const rawArticles = flattenConnection<Article>(data.blog.articles);

  const articles = rawArticles.map((article) => {
    const { publishedAt } = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${languageCode}-${countryCode}`, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(publishedAt!)),
    };
  });

  if (articles.length === 0) {
    return <p>No articles found</p>;
  }

  return (
    <Grid as="ol" layout="blog" gap="blog">
      {articles.map((article, i) => {
        return (
          <ArticleCard
            blogHandle={BLOG_HANDLE.toLowerCase()}
            article={article as Article}
            key={article.id}
            loading={getImageLoadingPriority(i, 2)}
          />
        );
      })}
    </Grid>
  );
}
