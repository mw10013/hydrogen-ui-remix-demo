import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import request from "graphql-request";
import invariant from "tiny-invariant";
import { Heading } from "~/components/elements/Heading";
import { Section } from "~/components/elements/Section";
import { NotFound } from "~/components/global/NotFound";
import { graphql } from "~/lib/gql/gql";
import { getExcerpt, shopClient } from "~/lib/utils";
import { Text } from "~/components/elements/Text";
import { ProductProvider } from "@shopify/hydrogen-react";
import { ProductDetail } from "~/components/product/ProductDetail";
import { ProductForm } from "~/components/product/ProductForm";

const query = graphql(`
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...MediaFragment
        }
      }
      productType
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
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
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`);

export const loader = (async ({ params: { handle } }) => {
  invariant(handle, "Missing product handle");
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    requestHeaders: shopClient.getPublicTokenHeaders(),
    variables: {
      handle,
    },
  });
  return json({
    data,
  });
}) satisfies LoaderFunction;

export default function Product() {
  const {
    data: { product, shop },
  } = useLoaderData<typeof loader>();
  if (!product) {
    return <NotFound type="product" />;
  }

  const { media, title, vendor, descriptionHtml, id, productType } = product;
  const { shippingPolicy, refundPolicy } = shop;
  const {
    priceV2,
    id: variantId,
    sku,
    title: variantTitle,
  } = product.variants.nodes[0];

  return (
    <ProductProvider data={product}>
      <Section padding="x" className="px-0"></Section>
      <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
        {/* <ProductGallery
          media={media.nodes}
          className="w-screen md:w-full lg:col-span-2"
        /> */}
        <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
          <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
            <div className="grid gap-2">
              <Heading as="h1" format className="whitespace-normal">
                {title}
              </Heading>
              {vendor && (
                <Text className={"opacity-50 font-medium"}>{vendor}</Text>
              )}
            </div>
            <ProductForm />
            <div className="grid gap-4 py-4">
              {descriptionHtml && (
                <ProductDetail
                  title="Product Details"
                  content={descriptionHtml}
                />
              )}
              {shippingPolicy?.body && (
                <ProductDetail
                  title="Shipping"
                  content={getExcerpt(shippingPolicy.body)}
                  learnMore={`/policies/${shippingPolicy.handle}`}
                />
              )}
              {refundPolicy?.body && (
                <ProductDetail
                  title="Returns"
                  content={getExcerpt(refundPolicy.body)}
                  learnMore={`/policies/${refundPolicy.handle}`}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* <pre>{JSON.stringify(product, null, 2)}</pre>
      <pre>{JSON.stringify(shop, null, 2)}</pre> */}
    </ProductProvider>
    // <ProductOptionsProvider data={product}>
    //   <Section padding="x" className="px-0">
    //     <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
    //       <ProductGallery
    //         media={media.nodes}
    //         className="w-screen md:w-full lg:col-span-2"
    //       />
    //       <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
    //         <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
    //           <div className="grid gap-2">
    //             <Heading as="h1" format className="whitespace-normal">
    //               {title}
    //             </Heading>
    //             {vendor && (
    //               <Text className={"opacity-50 font-medium"}>{vendor}</Text>
    //             )}
    //           </div>
    //           <ProductForm />
    //           <div className="grid gap-4 py-4">
    //             {descriptionHtml && (
    //               <ProductDetail
    //                 title="Product Details"
    //                 content={descriptionHtml}
    //               />
    //             )}
    //             {shippingPolicy?.body && (
    //               <ProductDetail
    //                 title="Shipping"
    //                 content={getExcerpt(shippingPolicy.body)}
    //                 learnMore={`/policies/${shippingPolicy.handle}`}
    //               />
    //             )}
    //             {refundPolicy?.body && (
    //               <ProductDetail
    //                 title="Returns"
    //                 content={getExcerpt(refundPolicy.body)}
    //                 learnMore={`/policies/${refundPolicy.handle}`}
    //               />
    //             )}
    //           </div>
    //         </section>
    //       </div>
    //     </div>
    //   </Section>
    //   {/* <ProductSwimlane title="Related Products" data={id} /> */}
    // </ProductOptionsProvider>
  );
}
