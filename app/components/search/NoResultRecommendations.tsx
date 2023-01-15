import type {
  Collection,
  Product,
} from "@shopify/hydrogen-react/storefront-api-types";
import type { FeaturedQuery } from "~/lib/gql/graphql";
import { FeaturedCollections } from "../sections/FeaturedCollections";
import { ProductSwimlane } from "../sections/ProductSwimlane";

export function NoResultRecommendations({
  featured,
}: {
  featured: FeaturedQuery;
}) {
  return (
    <>
      <FeaturedCollections
        title="Trending Collections"
        data={featured.featuredCollections.nodes as Collection[]}
      />
      <ProductSwimlane
        title="Trending Products"
        products={featured.featuredProducts.nodes as Product[]}
      />
    </>
  );
}
