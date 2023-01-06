import type { CodegenConfig } from "@graphql-codegen/cli";
import { storefrontApiCustomScalars } from "@shopify/hydrogen-react";

const config: CodegenConfig = {
  schema: "./node_modules/@shopify/hydrogen-react/storefront.schema.json",
  documents: ["app/**/!(*.d).{ts,tsx}", "!app/lib/gql/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./app/lib/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        // https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#the-usefragment-helper
        // fragmentMasking: { unmaskFunctionName: "getFragmentData" },
        fragmentMasking: false,
      },
      config: {
        // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript#config-api-reference
        defaultScalarType: "unknown",
        enumsAsTypes: true,
        useTypeImports: true,
        useImplementingTypes: true,
        scalars: storefrontApiCustomScalars,
      },
    },
  },
};

export default config;
