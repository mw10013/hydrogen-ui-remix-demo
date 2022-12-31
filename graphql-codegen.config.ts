import type { CodegenConfig } from "@graphql-codegen/cli";
// Due to issues with TurboRepo and dev dependencies, we can't use this in the monorepo. But if we could, then it would look like this import, and then used below in "scalars"
// import {storefrontApiCustomScalars} from '@shopify/hydrogen-react';

const config: CodegenConfig = {
  schema: "./node_modules/@shopify/hydrogen-react/storefront.schema.json",
  documents: ["app/**/!(*.d).{ts,tsx}", "!app/gql/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./app/gql/": {
      preset: "client",
      plugins: [],
      config: {
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript#config-api-reference
        enumsAsTypes: true,
        useTypeImports: true,
        // scalars: storefrontApiCustomScalars,
        scalars: {
          // Because of the limitations outlined above, these need to be kept in sync with the original definitions in the @shopify/hydrogen-react repo!
          DateTime: "string",
          Decimal: "string",
          HTML: "string",
          URL: "string",
          Color: "string",
          UnsignedInt64: "string",
        },
      },
    },
  },
};

export default config;
