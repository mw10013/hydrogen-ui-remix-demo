/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query productRecommendations($productId: ID!, $count: Int) {\n    recommended: productRecommendations(productId: $productId) {\n      ...ProductCardFragment\n    }\n    additional: products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n": types.ProductRecommendationsDocument,
    "\n  query topProducts($count: Int) {\n    products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n": types.TopProductsDocument,
    "\n  fragment MediaFragment on Media {\n    __typename\n    mediaContentType\n    alt\n    previewImage {\n      url\n    }\n    ... on MediaImage {\n      id\n      image {\n        url\n        width\n        height\n      }\n    }\n    ... on Video {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on Model3d {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on ExternalVideo {\n      id\n      embedUrl\n      host\n    }\n  }\n": types.MediaFragmentFragmentDoc,
    "\n  fragment ProductCardFragment on Product {\n    id\n    title\n    publishedAt\n    handle\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        priceV2 {\n          amount\n          currencyCode\n        }\n        compareAtPriceV2 {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n": types.ProductCardFragmentFragmentDoc,
    "\n  fragment MenuFragment on Menu {\n    id\n    items {\n      ...MenuItemFragment\n      items {\n        ...MenuItemFragment\n      }\n    }\n  }\n": types.MenuFragmentFragmentDoc,
    "\n  fragment MenuItemFragment on MenuItem {\n    id\n    resourceId\n    title\n    type\n    url\n  }\n": types.MenuItemFragmentFragmentDoc,
    "\n  query LayoutMenusQuery(\n    $headerMenuHandle: String!\n    $footerMenuHandle: String!\n  ) {\n    shop {\n      name\n    }\n    headerMenu: menu(handle: $headerMenuHandle) {\n      ...MenuFragment\n    }\n    footerMenu: menu(handle: $footerMenuHandle) {\n      ...MenuFragment\n    }\n  }\n": types.LayoutMenusQueryDocument,
    "\n  query Collections($pageBy: Int!) {\n    collections(first: $pageBy) {\n      nodes {\n        id\n        title\n        description\n        handle\n        seo {\n          description\n          title\n        }\n        image {\n          id\n          url\n          width\n          height\n          altText\n        }\n      }\n    }\n  }\n": types.CollectionsDocument,
    "\n  query homepage {\n    heroBanners: collections(\n      first: 3\n      query: \"collection_type:custom\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        handle\n        title\n        descriptionHtml\n        heading: metafield(namespace: \"hero\", key: \"title\") {\n          value\n        }\n        byline: metafield(namespace: \"hero\", key: \"byline\") {\n          value\n        }\n        cta: metafield(namespace: \"hero\", key: \"cta\") {\n          value\n        }\n        spread: metafield(namespace: \"hero\", key: \"spread\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n        spreadSecondary: metafield(namespace: \"hero\", key: \"spread_secondary\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n      }\n    }\n    featuredCollections: collections(\n      first: 3\n      query: \"collection_type:smart\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        title\n        handle\n        image {\n          altText\n          width\n          height\n          url\n        }\n      }\n    }\n    featuredProducts: products(first: 12) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n": types.HomepageDocument,
    "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      vendor\n      descriptionHtml\n      media(first: 7) {\n        nodes {\n          ...MediaFragment\n        }\n      }\n      productType\n      variants(first: 100) {\n        nodes {\n          id\n          availableForSale\n          selectedOptions {\n            name\n            value\n          }\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n          priceV2 {\n            amount\n            currencyCode\n          }\n          compareAtPriceV2 {\n            amount\n            currencyCode\n          }\n          sku\n          title\n          unitPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      seo {\n        description\n        title\n      }\n    }\n    shop {\n      shippingPolicy {\n        body\n        handle\n      }\n      refundPolicy {\n        body\n        handle\n      }\n    }\n  }\n": types.ProductDocument,
    "\n  query AllProducts($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n": types.AllProductsDocument,
    "\n  query ProductsPage($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.ProductsPageDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query productRecommendations($productId: ID!, $count: Int) {\n    recommended: productRecommendations(productId: $productId) {\n      ...ProductCardFragment\n    }\n    additional: products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query productRecommendations($productId: ID!, $count: Int) {\n    recommended: productRecommendations(productId: $productId) {\n      ...ProductCardFragment\n    }\n    additional: products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query topProducts($count: Int) {\n    products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query topProducts($count: Int) {\n    products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaFragment on Media {\n    __typename\n    mediaContentType\n    alt\n    previewImage {\n      url\n    }\n    ... on MediaImage {\n      id\n      image {\n        url\n        width\n        height\n      }\n    }\n    ... on Video {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on Model3d {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on ExternalVideo {\n      id\n      embedUrl\n      host\n    }\n  }\n"): (typeof documents)["\n  fragment MediaFragment on Media {\n    __typename\n    mediaContentType\n    alt\n    previewImage {\n      url\n    }\n    ... on MediaImage {\n      id\n      image {\n        url\n        width\n        height\n      }\n    }\n    ... on Video {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on Model3d {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on ExternalVideo {\n      id\n      embedUrl\n      host\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProductCardFragment on Product {\n    id\n    title\n    publishedAt\n    handle\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        priceV2 {\n          amount\n          currencyCode\n        }\n        compareAtPriceV2 {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProductCardFragment on Product {\n    id\n    title\n    publishedAt\n    handle\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        priceV2 {\n          amount\n          currencyCode\n        }\n        compareAtPriceV2 {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MenuFragment on Menu {\n    id\n    items {\n      ...MenuItemFragment\n      items {\n        ...MenuItemFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MenuFragment on Menu {\n    id\n    items {\n      ...MenuItemFragment\n      items {\n        ...MenuItemFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MenuItemFragment on MenuItem {\n    id\n    resourceId\n    title\n    type\n    url\n  }\n"): (typeof documents)["\n  fragment MenuItemFragment on MenuItem {\n    id\n    resourceId\n    title\n    type\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LayoutMenusQuery(\n    $headerMenuHandle: String!\n    $footerMenuHandle: String!\n  ) {\n    shop {\n      name\n    }\n    headerMenu: menu(handle: $headerMenuHandle) {\n      ...MenuFragment\n    }\n    footerMenu: menu(handle: $footerMenuHandle) {\n      ...MenuFragment\n    }\n  }\n"): (typeof documents)["\n  query LayoutMenusQuery(\n    $headerMenuHandle: String!\n    $footerMenuHandle: String!\n  ) {\n    shop {\n      name\n    }\n    headerMenu: menu(handle: $headerMenuHandle) {\n      ...MenuFragment\n    }\n    footerMenu: menu(handle: $footerMenuHandle) {\n      ...MenuFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Collections($pageBy: Int!) {\n    collections(first: $pageBy) {\n      nodes {\n        id\n        title\n        description\n        handle\n        seo {\n          description\n          title\n        }\n        image {\n          id\n          url\n          width\n          height\n          altText\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Collections($pageBy: Int!) {\n    collections(first: $pageBy) {\n      nodes {\n        id\n        title\n        description\n        handle\n        seo {\n          description\n          title\n        }\n        image {\n          id\n          url\n          width\n          height\n          altText\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query homepage {\n    heroBanners: collections(\n      first: 3\n      query: \"collection_type:custom\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        handle\n        title\n        descriptionHtml\n        heading: metafield(namespace: \"hero\", key: \"title\") {\n          value\n        }\n        byline: metafield(namespace: \"hero\", key: \"byline\") {\n          value\n        }\n        cta: metafield(namespace: \"hero\", key: \"cta\") {\n          value\n        }\n        spread: metafield(namespace: \"hero\", key: \"spread\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n        spreadSecondary: metafield(namespace: \"hero\", key: \"spread_secondary\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n      }\n    }\n    featuredCollections: collections(\n      first: 3\n      query: \"collection_type:smart\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        title\n        handle\n        image {\n          altText\n          width\n          height\n          url\n        }\n      }\n    }\n    featuredProducts: products(first: 12) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query homepage {\n    heroBanners: collections(\n      first: 3\n      query: \"collection_type:custom\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        handle\n        title\n        descriptionHtml\n        heading: metafield(namespace: \"hero\", key: \"title\") {\n          value\n        }\n        byline: metafield(namespace: \"hero\", key: \"byline\") {\n          value\n        }\n        cta: metafield(namespace: \"hero\", key: \"cta\") {\n          value\n        }\n        spread: metafield(namespace: \"hero\", key: \"spread\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n        spreadSecondary: metafield(namespace: \"hero\", key: \"spread_secondary\") {\n          reference {\n            ...MediaFragment\n          }\n        }\n      }\n    }\n    featuredCollections: collections(\n      first: 3\n      query: \"collection_type:smart\"\n      sortKey: UPDATED_AT\n    ) {\n      nodes {\n        id\n        title\n        handle\n        image {\n          altText\n          width\n          height\n          url\n        }\n      }\n    }\n    featuredProducts: products(first: 12) {\n      nodes {\n        ...ProductCardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      vendor\n      descriptionHtml\n      media(first: 7) {\n        nodes {\n          ...MediaFragment\n        }\n      }\n      productType\n      variants(first: 100) {\n        nodes {\n          id\n          availableForSale\n          selectedOptions {\n            name\n            value\n          }\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n          priceV2 {\n            amount\n            currencyCode\n          }\n          compareAtPriceV2 {\n            amount\n            currencyCode\n          }\n          sku\n          title\n          unitPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      seo {\n        description\n        title\n      }\n    }\n    shop {\n      shippingPolicy {\n        body\n        handle\n      }\n      refundPolicy {\n        body\n        handle\n      }\n    }\n  }\n"): (typeof documents)["\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      vendor\n      descriptionHtml\n      media(first: 7) {\n        nodes {\n          ...MediaFragment\n        }\n      }\n      productType\n      variants(first: 100) {\n        nodes {\n          id\n          availableForSale\n          selectedOptions {\n            name\n            value\n          }\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n          priceV2 {\n            amount\n            currencyCode\n          }\n          compareAtPriceV2 {\n            amount\n            currencyCode\n          }\n          sku\n          title\n          unitPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      seo {\n        description\n        title\n      }\n    }\n    shop {\n      shippingPolicy {\n        body\n        handle\n      }\n      refundPolicy {\n        body\n        handle\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllProducts($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllProducts($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductsPage($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProductsPage($pageBy: Int!, $cursor: String) {\n    products(first: $pageBy, after: $cursor) {\n      nodes {\n        ...ProductCardFragment\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;