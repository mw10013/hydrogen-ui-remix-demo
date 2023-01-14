import { PAGINATION_SIZE } from "~/lib/const";
import { FeaturedCollections } from "../sections/FeaturedCollections";
import { ProductSwimlane } from "../sections/ProductSwimlane";

export function NoResultRecommendations() {
  return (
    <>
      <div>No Result Recommendations</div>
      {/* <FeaturedCollections
        title="Trending Collections"
        data={data.featuredCollections.nodes}
      />
      <ProductSwimlane
        title="Trending Products"
        data={data.featuredProducts.nodes}
      /> */}
    </>
  );
}

// const SEARCH_NO_RESULTS_QUERY = gql`
//   ${PRODUCT_CARD_FRAGMENT}
//   query searchNoResult(
//     $country: CountryCode
//     $language: LanguageCode
//     $pageBy: Int!
//   ) @inContext(country: $country, language: $language) {
//     featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
//       nodes {
//         id
//         title
//         handle
//         image {
//           altText
//           width
//           height
//           url
//         }
//       }
//     }
//     featuredProducts: products(first: $pageBy) {
//       nodes {
//         ...ProductCardFragment
//       }
//     }
//   }
// `;
